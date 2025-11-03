'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { authService } from '@/services/authService';
import { useUserStore } from '@/store/userStore';

const LoginPage = () => {
  const router = useRouter();
  const setAccessToken = useUserStore((state) => state.setAccessToken);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      setAccessToken(response.accessToken);
      router.push('/dashboard');
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">로그인</h2>
          <p className="text-sm text-slate-500 mt-2">
            계정에 로그인하여 서비스를 이용하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="이메일"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="example@email.com"
            required
          />

          <Input
            label="비밀번호"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="비밀번호를 입력하세요"
            required
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-slate-500">
              계정이 없으신가요?{' '}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                회원가입
              </Link>
            </p>
            <Link href="/" className="block text-sm text-slate-500 hover:text-slate-700">
              메인 페이지로 돌아가기
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
