'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { useUserStore } from '@/store/userStore';

export const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated, logout } = useUserStore();

  const handleStartClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">AI 채용 플랫폼</h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="text">대시보드</Button>
                  </Link>
                  <Button variant="secondary" onClick={handleLogout}>
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="text">로그인</Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="primary">회원가입</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl mb-6">
              AI로 손쉽게 만드는
              <br />
              전문 채용 공고
            </h2>
            <p className="text-xl text-slate-500 mb-8 max-w-2xl mx-auto">
              중소기업 채용 담당자를 위한 AI 기반 채용 콘텐츠 자동 생성 플랫폼.
              <br />
              기본 정보만 입력하면 전문적인 채용 공고가 완성됩니다.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="accent" size="lg" onClick={handleStartClick}>
                무료로 시작하기
              </Button>
              {!isAuthenticated && (
                <Link href="/login">
                  <Button variant="secondary" size="lg">
                    로그인
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              주요 기능
            </h3>
            <p className="text-base text-slate-500">
              AI가 당신의 채용 업무를 혁신합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg border border-slate-300 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">
                AI 포스터 생성
              </h4>
              <p className="text-slate-500">
                채용 정보를 입력하면 AI가 자동으로 전문적인 채용 포스터를 디자인합니다.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg border border-slate-300 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">
                웹 배너 제작
              </h4>
              <p className="text-slate-500">
                다양한 채용 플랫폼에 즉시 활용 가능한 가로형 웹 배너를 생성합니다.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg border border-slate-300 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">
                HTML 공고 생성
              </h4>
              <p className="text-slate-500">
                반응형 HTML 형식의 채용 공고를 생성하여 어디서나 게시할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              이런 분들께 추천합니다
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h5 className="text-base font-medium text-slate-900 mb-1">디자인 툴을 다루기 어려운 분</h5>
                <p className="text-sm text-slate-500">전문적인 디자인 지식 없이도 멋진 채용 콘텐츠를 만들 수 있습니다.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h5 className="text-base font-medium text-slate-900 mb-1">채용 문구 작성이 부담스러운 분</h5>
                <p className="text-sm text-slate-500">AI가 지원자의 눈길을 끄는 매력적인 문구를 제안합니다.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h5 className="text-base font-medium text-slate-900 mb-1">시간과 비용을 절약하고 싶은 분</h5>
                <p className="text-sm text-slate-500">반복되는 채용 공고 제작 업무를 자동화하여 효율성을 높입니다.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h5 className="text-base font-medium text-slate-900 mb-1">중소기업 지원 혜택 정보가 필요한 분</h5>
                <p className="text-sm text-slate-500">정부 지원 혜택을 자동으로 찾아 공고에 포함시킬 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            무료로 AI 채용 콘텐츠를 생성해보세요
          </p>
          <Button variant="accent" size="lg" onClick={handleStartClick}>
            무료로 시작하기
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-slate-400">
              © 2025 AI 채용 콘텐츠 제작 플랫폼. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
