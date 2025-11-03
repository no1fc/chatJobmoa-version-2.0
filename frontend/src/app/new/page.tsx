'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useUserStore } from '@/store/userStore';
import { postingService } from '@/services/postingService';

const NewPostingPage = () => {
  const router = useRouter();
  const { isAuthenticated, token } = useUserStore();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('프로젝트 제목을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const newPosting = await postingService.create({ title }, token!);
      router.push(`/posting/${newPosting.id}`);
    } catch (err) {
      setError('프로젝트 생성에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
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
            <Link href="/dashboard">
              <Button variant="text">대시보드로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            새 채용 프로젝트 만들기
          </h2>
          <p className="text-base text-slate-500 mb-8">
            프로젝트의 제목을 입력하고 시작하세요
          </p>

          <form onSubmit={handleSubmit}>
            <Input
              label="프로젝트 제목"
              type="text"
              placeholder="예: 시니어 백엔드 개발자 채용"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={error || undefined}
              helperText="나중에 언제든지 수정할 수 있습니다"
            />

            <div className="flex gap-4 mt-8">
              <Button
                type="submit"
                variant="accent"
                size="lg"
                disabled={loading}
              >
                {loading ? '생성 중...' : '프로젝트 생성'}
              </Button>
              <Link href="/dashboard">
                <Button type="button" variant="secondary" size="lg">
                  취소
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewPostingPage;
