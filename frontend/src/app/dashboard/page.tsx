'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { useUserStore } from '@/store/userStore';
import { postingService, PostingListItem } from '@/services/postingService';

const DashboardPage = () => {
  const router = useRouter();
  const { isAuthenticated, logout, token } = useUserStore();
  const [postings, setPostings] = useState<PostingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Hydration 문제 해결: 클라이언트 사이드에서만 실행
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchPostings = async () => {
      try {
        setLoading(true);
        const response = await postingService.getAll(
          { page: 1, limit: 10, sortBy: 'updatedAt', order: 'desc' },
          token!,
        );
        setPostings(response.data);
      } catch (err) {
        setError('프로젝트 목록을 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostings();
  }, [mounted, isAuthenticated, router, token]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleCreateNew = () => {
    router.push('/new');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 프로젝트를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await postingService.delete(id, token!);
      setPostings(postings.filter((p) => p.id !== id));
    } catch (err) {
      alert('프로젝트 삭제에 실패했습니다.');
      console.error(err);
    }
  };

  if (!mounted || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
                잡모아
              </h1>
            </Link>
            <div className="flex gap-4">
              <Link href="/">
                <Button variant="text">메인</Button>
              </Link>
              <Button variant="secondary" onClick={handleLogout}>
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              내 채용 프로젝트
            </h2>
            <p className="text-base text-slate-500">
              생성한 채용 공고 프로젝트를 관리하세요
            </p>
          </div>
          <Button variant="accent" size="lg" onClick={handleCreateNew}>
            + 새 프로젝트 만들기
          </Button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-slate-600">로딩 중...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : postings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              아직 프로젝트가 없습니다
            </h3>
            <p className="text-base text-slate-600 mb-6">
              새로운 채용 공고를 만들어보세요
            </p>
            <Button variant="accent" size="lg" onClick={handleCreateNew}>
              첫 프로젝트 시작하기
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {postings.map((posting) => (
              <div
                key={posting.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {posting.title}
                    </h3>
                    <div className="flex gap-4 items-center text-sm text-slate-500">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          posting.status === 'DRAFT'
                            ? 'bg-slate-200 text-slate-700'
                            : posting.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {posting.status === 'DRAFT'
                          ? '작성 중'
                          : posting.status === 'PUBLISHED'
                            ? '게시됨'
                            : '보관됨'}
                      </span>
                      <span>
                        최종 수정:{' '}
                        {new Date(posting.updatedAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/posting/${posting.id}`}>
                      <Button variant="primary">수정</Button>
                    </Link>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(posting.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
