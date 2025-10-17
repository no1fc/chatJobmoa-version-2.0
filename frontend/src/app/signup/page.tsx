'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Checkbox } from '@/components/common/Checkbox';
import { authService } from '@/services/authService';
import { useUserStore } from '@/store/userStore';

export const SignUpPage = () => {
  const router = useRouter();
  const setAccessToken = useUserStore((state) => state.setAccessToken);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '',
    emailCode: '',
    phoneCode: '',
    termsAgreement: false,
    marketingAgreement: false,
  });

  const [tokens, setTokens] = useState({
    emailVerificationToken: '',
    phoneVerificationToken: '',
  });

  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);

  const handleSendEmailCode = async () => {
    if (!formData.email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await authService.sendVerification({
        type: 'EMAIL',
        recipient: formData.email,
      });
      setEmailCodeSent(true);
      alert('이메일로 인증번호가 발송되었습니다.');
    } catch (err) {
      setError('이메일 발송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPhoneCode = async () => {
    if (!formData.phoneNumber) {
      setError('전화번호를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await authService.sendVerification({
        type: 'SMS',
        recipient: formData.phoneNumber,
      });
      setPhoneCodeSent(true);
      alert('휴대폰으로 인증번호가 발송되었습니다.');
    } catch (err) {
      setError('문자 발송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!formData.emailCode) {
      setError('이메일 인증번호를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await authService.verifyCode({
        type: 'EMAIL',
        recipient: formData.email,
        code: formData.emailCode,
      });
      setTokens((prev) => ({ ...prev, emailVerificationToken: response.verificationToken }));
      alert('이메일 인증이 완료되었습니다.');
    } catch (err) {
      setError('이메일 인증에 실패했습니다. 인증번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhoneCode = async () => {
    if (!formData.phoneCode) {
      setError('휴대폰 인증번호를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await authService.verifyCode({
        type: 'SMS',
        recipient: formData.phoneNumber,
        code: formData.phoneCode,
      });
      setTokens((prev) => ({ ...prev, phoneVerificationToken: response.verificationToken }));
      alert('휴대폰 인증이 완료되었습니다.');
    } catch (err) {
      setError('휴대폰 인증에 실패했습니다. 인증번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!formData.termsAgreement) {
      setError('개인정보보호정책에 동의해주세요.');
      return;
    }

    if (!tokens.emailVerificationToken || !tokens.phoneVerificationToken) {
      setError('이메일과 휴대폰 인증을 모두 완료해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.signUp({
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        emailVerificationToken: tokens.emailVerificationToken,
        phoneVerificationToken: tokens.phoneVerificationToken,
        termsAgreement: formData.termsAgreement,
        marketingAgreement: formData.marketingAgreement,
      });

      setAccessToken(response.accessToken);
      alert('회원가입이 완료되었습니다!');
      router.push('/dashboard');
    } catch (err) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">회원가입</h2>
          <p className="text-sm text-slate-500 mt-2">
            AI 채용 콘텐츠 제작을 시작하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이메일 */}
          <div>
            <Input
              label="이메일"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@email.com"
              required
            />
            <div className="mt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleSendEmailCode}
                disabled={isLoading || emailCodeSent}
              >
                {emailCodeSent ? '인증번호 발송됨' : '이메일 인증번호 받기'}
              </Button>
            </div>
          </div>

          {emailCodeSent && (
            <div>
              <Input
                label="이메일 인증번호"
                type="text"
                value={formData.emailCode}
                onChange={(e) => setFormData({ ...formData, emailCode: e.target.value })}
                placeholder="6자리 인증번호"
                maxLength={6}
              />
              <div className="mt-2">
                <Button
                  type="button"
                  variant="accent"
                  size="sm"
                  onClick={handleVerifyEmailCode}
                  disabled={isLoading || !!tokens.emailVerificationToken}
                >
                  {tokens.emailVerificationToken ? '인증 완료' : '인증 확인'}
                </Button>
              </div>
            </div>
          )}

          {/* 비밀번호 */}
          <Input
            label="비밀번호"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="8자 이상"
            required
            minLength={8}
          />

          <Input
            label="비밀번호 확인"
            type="password"
            value={formData.passwordConfirm}
            onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
            placeholder="비밀번호 재입력"
            required
          />

          {/* 전화번호 */}
          <div>
            <Input
              label="전화번호"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="01012345678 (- 제외)"
              required
            />
            <div className="mt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleSendPhoneCode}
                disabled={isLoading || phoneCodeSent}
              >
                {phoneCodeSent ? '인증번호 발송됨' : '휴대폰 인증번호 받기'}
              </Button>
            </div>
          </div>

          {phoneCodeSent && (
            <div>
              <Input
                label="휴대폰 인증번호"
                type="text"
                value={formData.phoneCode}
                onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                placeholder="6자리 인증번호"
                maxLength={6}
              />
              <div className="mt-2">
                <Button
                  type="button"
                  variant="accent"
                  size="sm"
                  onClick={handleVerifyPhoneCode}
                  disabled={isLoading || !!tokens.phoneVerificationToken}
                >
                  {tokens.phoneVerificationToken ? '인증 완료' : '인증 확인'}
                </Button>
              </div>
            </div>
          )}

          {/* 약관 동의 */}
          <div className="space-y-3">
            <Checkbox
              label="개인정보보호정책에 동의합니다 (필수)"
              checked={formData.termsAgreement}
              onChange={(e) => setFormData({ ...formData, termsAgreement: e.target.checked })}
            />
            <Checkbox
              label="마케팅 및 이벤트 정보 수신에 동의합니다 (선택)"
              checked={formData.marketingAgreement}
              onChange={(e) => setFormData({ ...formData, marketingAgreement: e.target.checked })}
            />
          </div>

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
            {isLoading ? '처리 중...' : '가입 완료'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                로그인
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
