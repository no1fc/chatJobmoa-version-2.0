'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useUserStore } from '@/store/userStore';
import { usePostingStore } from '@/store/postingStore';
import { postingService, JobPosting } from '@/services/postingService';

export const PostingDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const postingId = params.id as string;
  const { isAuthenticated, token } = useUserStore();
  const { currentPosting, setCurrentPosting } = usePostingStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<JobPosting>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchPosting = async () => {
      try {
        setLoading(true);
        const posting = await postingService.getOne(postingId, token!);
        setCurrentPosting(posting);
        setFormData(posting);
      } catch (err) {
        setError('프로젝트를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosting();
  }, [isAuthenticated, postingId, router, token, setCurrentPosting]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const updated = await postingService.update(postingId, formData, token!);
      setCurrentPosting(updated);
      alert('저장되었습니다!');
    } catch (err) {
      setError('저장에 실패했습니다.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-slate-600">로딩 중...</p>
      </div>
    );
  }

  if (error && !currentPosting) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/dashboard">
            <Button variant="primary">대시보드로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
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
              <Link href="/dashboard">
                <Button variant="text">대시보드</Button>
              </Link>
              <Button
                variant="accent"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '저장 중...' : '저장하기'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            채용 공고 작성
          </h2>
          <p className="text-base text-slate-500">
            채용 공고에 필요한 정보를 입력하세요
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* 기본 정보 */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              기본 정보
            </h3>
            <div className="space-y-4">
              <Input
                label="프로젝트 제목"
                name="title"
                type="text"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="예: 시니어 백엔드 개발자 채용"
              />
              <Input
                label="회사명"
                name="companyName"
                type="text"
                value={formData.companyName || ''}
                onChange={handleChange}
                placeholder="예: AI 솔루션즈"
              />
              <Input
                label="직무 (Job Title)"
                name="jobTitle"
                type="text"
                value={formData.jobTitle || ''}
                onChange={handleChange}
                placeholder="예: Backend Developer"
              />
            </div>
          </section>

          {/* INP-001: 핵심 채용 정보 */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              채용 상세 정보
            </h3>
            <div className="space-y-4">
              <Input
                label="경력 요건"
                name="careerLevel"
                type="text"
                value={formData.careerLevel || ''}
                onChange={handleChange}
                placeholder="예: 신입, 경력 3년 이상, 무관"
              />
              <Input
                label="고용 형태"
                name="employmentType"
                type="text"
                value={formData.employmentType || ''}
                onChange={handleChange}
                placeholder="예: 정규직, 계약직"
              />
              <Input
                label="급여 수준"
                name="salaryRange"
                type="text"
                value={formData.salaryRange || ''}
                onChange={handleChange}
                placeholder="예: 연봉 4,000만원 ~ 6,000만원"
              />
              <Input
                label="근무지"
                name="workLocation"
                type="text"
                value={formData.workLocation || ''}
                onChange={handleChange}
                placeholder="예: 서울시 강남구"
              />
            </div>
          </section>

          {/* INP-003: 기업 정보 */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              기업 정보
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  회사 소개
                </label>
                <textarea
                  name="companyIntro"
                  className="flex w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  rows={4}
                  value={formData.companyIntro || ''}
                  onChange={handleChange}
                  placeholder="회사에 대한 소개를 작성해주세요"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  기업 문화
                </label>
                <textarea
                  name="companyCulture"
                  className="flex w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  rows={4}
                  value={formData.companyCulture || ''}
                  onChange={handleChange}
                  placeholder="기업 문화에 대해 작성해주세요"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  복리후생
                </label>
                <textarea
                  name="benefits"
                  className="flex w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  rows={4}
                  value={formData.benefits || ''}
                  onChange={handleChange}
                  placeholder="제공하는 복리후생을 작성해주세요"
                />
              </div>
              <Input
                label="로고 이미지 URL"
                name="logoImageUrl"
                type="text"
                value={formData.logoImageUrl || ''}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                helperText="추후 이미지 업로드 기능이 추가될 예정입니다"
              />
            </div>
          </section>

          {/* INP-004: 스타일 설정 */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              디자인 스타일 (AI 생성용)
            </h3>
            <div className="space-y-4">
              <Input
                label="색상 톤"
                name="colorTone"
                type="text"
                value={formData.colorTone || ''}
                onChange={handleChange}
                placeholder="예: blue, green, orange"
              />
              <Input
                label="스타일 컨셉"
                name="styleConcept"
                type="text"
                value={formData.styleConcept || ''}
                onChange={handleChange}
                placeholder="예: professional, friendly, modern"
              />
            </div>
          </section>

          {/* 저장 버튼 */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="accent"
              size="lg"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '저장 중...' : '저장하기'}
            </Button>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg">
                취소
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostingDetailPage;
