'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { useUserStore } from '@/store/userStore';

export const DashboardPage = () => {
  const router = useRouter();
  const { isAuthenticated, logout } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
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
            <h1 className="text-2xl font-bold text-blue-600">대시보드</h1>
            <Button variant="secondary" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            환영합니다!
          </h2>
          <p className="text-base text-slate-600 mb-6">
            AI 채용 콘텐츠 제작 플랫폼에 오신 것을 환영합니다.
            <br />
            아직 프로젝트가 없습니다. 새로운 채용 공고를 만들어보세요.
          </p>
          <Button variant="accent" size="lg">
            새 채용 공고 만들기
          </Button>
        </div>

        {/* Future: 프로젝트 목록이 여기에 표시됩니다 (PRJ-001) */}
      </main>
    </div>
  );
};

export default DashboardPage;
