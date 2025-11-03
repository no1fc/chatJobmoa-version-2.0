'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Button } from '@/components/common/Button';
import { AIKeywordSuggester } from '@/components/posting/AIKeywordSuggester';
import { ColorPalettePicker } from '@/components/posting/ColorPalettePicker';
import { BenefitSelector } from '@/components/posting/BenefitSelector';
import { postingService, JobPosting } from '@/services/postingService';
import { aiGeneratorService } from '@/services/aiGeneratorService';
import { useUserStore } from '@/store/userStore';

export const PostingEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const postingId = params.id as string;
  const { isAuthenticated, token } = useUserStore();

  const [posting, setPosting] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated || !token) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    fetchPosting();
  }, [mounted, isAuthenticated, token, router]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    jobType: '',
    position: '',
    careerLevel: '',
    employmentType: '',
    salaryRange: '',
    workLocation: '',
    companyIntro: '',
    companyCulture: '',
    benefits: '',
    colorTone: '#2563EB',
    styleConcept: '',
    selectedBenefits: [] as string[],
    keywords: [] as string[],
  });



  const fetchPosting = async () => {
    if (!token) return;

    try {
      const data = await postingService.getOne(postingId, token);
      setPosting(data);

      setFormData({
        title: data.title || '',
        companyName: data.companyName || '',
        jobType: data.jobType || '',
        position: data.position || '',
        careerLevel: data.careerLevel || '',
        employmentType: data.employmentType || '',
        salaryRange: data.salaryRange || '',
        workLocation: data.workLocation || '',
        companyIntro: data.companyIntro || '',
        companyCulture: data.companyCulture || '',
        benefits: data.benefits || '',
        colorTone: data.colorTone || '#2563EB',
        styleConcept: data.styleConcept || '',
        selectedBenefits: data.selectedBenefitsJson
          ? JSON.parse(data.selectedBenefitsJson)
          : [],
        keywords: data.keywords || [],
      });
    } catch (error) {
      console.error('Failed to fetch posting:', error);
      alert('프로젝트를 불러오는데 실패했습니다. 다시 로그인해주세요.');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token) return;

    setSaving(true);
    try {
      const { selectedBenefits, ...dataToSave } = formData;
      await postingService.update(
        postingId,
        {
          ...dataToSave,
          selectedBenefitsJson: JSON.stringify(selectedBenefits),
          keywords: formData.keywords,
        },
        token,
      );

      // 로고 파일 업로드
      if (logoFile) {
        await aiGeneratorService.uploadLogo(postingId, logoFile, token);
      }

      alert('저장되었습니다.');
      fetchPosting();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateImages = async () => {
    if (!token) return;

    setGenerating(true);
    try {
      await aiGeneratorService.generateImages(postingId, token);
      alert('이미지 생성이 완료되었습니다!');
      fetchPosting();
    } catch (error) {
      console.error('Failed to generate images:', error);
      alert('이미지 생성에 실패했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateHtml = async () => {
    if (!token) return;

    setGenerating(true);
    try {
      await aiGeneratorService.generateHtml(postingId, token);
      alert('HTML 생성이 완료되었습니다!');
      fetchPosting();
    } catch (error) {
      console.error('Failed to generate HTML:', error);
      alert('HTML 생성에 실패했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  const handleViewResult = () => {
    router.push(`/result/${postingId}`);
  };

  const handleKeywordsChange = useCallback((keywords: string[]) => {
    setFormData((prev) => {
      // 배열 내용이 실제로 변경되었는지 확인
      if (prev.keywords.length === keywords.length && 
          prev.keywords.every((k, i) => k === keywords[i])) {
        return prev;
      }
      return { ...prev, keywords };
    });
  }, []);

  if (!mounted || !isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-base text-slate-600">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8 space-y-8">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">{formData.title}</h1>
            <Button variant="secondary" onClick={() => router.push('/dashboard')}>
              목록으로
            </Button>
          </div>

          {/* INP-001: 핵심 채용 정보 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">핵심 채용 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="회사명"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
              />
              <Input
                label="직종"
                placeholder="예: IT/인터넷/통신"
                value={formData.jobType}
                onChange={(e) =>
                  setFormData({ ...formData, jobType: e.target.value })
                }
              />
              <Input
                label="직무"
                placeholder="예: 시니어 백엔드 개발자"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
              />
              <Input
                label="경력 요건"
                placeholder="예: 5년 이상"
                value={formData.careerLevel}
                onChange={(e) =>
                  setFormData({ ...formData, careerLevel: e.target.value })
                }
              />
              <Input
                label="고용 형태"
                placeholder="예: 정규직"
                value={formData.employmentType}
                onChange={(e) =>
                  setFormData({ ...formData, employmentType: e.target.value })
                }
              />
              <Input
                label="급여 수준"
                placeholder="예: 연봉 5000만원~"
                value={formData.salaryRange}
                onChange={(e) =>
                  setFormData({ ...formData, salaryRange: e.target.value })
                }
              />
              <Input
                label="근무지"
                placeholder="예: 서울시 강남구"
                value={formData.workLocation}
                onChange={(e) =>
                  setFormData({ ...formData, workLocation: e.target.value })
                }
              />
            </div>
          </section>

          {/* INP-002: AI 키워드 추천 */}
          <section className="p-6 bg-slate-50 rounded-lg">
            <AIKeywordSuggester
              jobType={formData.jobType}
              position={formData.position}
              initialKeywords={formData.keywords}
              onKeywordsChange={handleKeywordsChange}
            />
          </section>

          {/* INP-003: 기업 정보 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">기업 정보</h2>
            <Textarea
              label="회사 소개, 자격 요건, 우대 사항을 작성해주세요."
              placeholder="회사를 소개하고 원하는 인재 정보를 입력하세요 @ 제목 - 구분 해서 작성해주세요."
              value={formData.companyIntro}
              onChange={(e) =>
                setFormData({ ...formData, companyIntro: e.target.value })
              }
              rows={4}
            />
            <Textarea
              label="회사의 기업 문화, 전형 절차, 지원기간, 문의처를 작성해주세요."
              placeholder="기업의 분위기를 알려주고 지원 절차를 설명해주세요"
              value={formData.companyCulture}
              onChange={(e) =>
                setFormData({ ...formData, companyCulture: e.target.value })
              }
              rows={4}
            />
            <Textarea
              label="복리후생"
              placeholder="제공하는 복리후생을 나열해주세요"
              value={formData.benefits}
              onChange={(e) =>
                setFormData({ ...formData, benefits: e.target.value })
              }
              rows={4}
            />

            {/* 로고 업로드 */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                회사 로고
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {posting?.logoImageUrl && (
                <img
                  src={posting.logoImageUrl}
                  alt="로고"
                  className="mt-4 h-20 object-contain"
                />
              )}
            </div>
          </section>

          {/* INP-004: 스타일 설정 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">디자인 스타일 설정</h2>
            <ColorPalettePicker
              selectedColor={formData.colorTone}
              selectedStyle={formData.styleConcept}
              onColorChange={(color) =>
                setFormData({ ...formData, colorTone: color })
              }
              onStyleChange={(style) =>
                setFormData({ ...formData, styleConcept: style })
              }
            />
          </section>

          {/* INP-005: 중소기업 혜택 */}
          <section className="space-y-4">
            <BenefitSelector
              selectedBenefits={formData.selectedBenefits}
              onSelectionChange={(benefits) =>
                setFormData({ ...formData, selectedBenefits: benefits })
              }
            />
          </section>

          {/* 저장 및 생성 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? '저장 중...' : '저장하기'}
            </Button>
            <Button
              variant="accent"
              onClick={handleGenerateImages}
              disabled={generating}
              className="flex-1"
            >
              {generating ? 'AI 생성 중...' : 'AI 이미지 생성'}
            </Button>
            <Button
              variant="accent"
              onClick={handleGenerateHtml}
              disabled={generating}
              className="flex-1"
            >
              {generating ? 'AI 생성 중...' : 'HTML 생성'}
            </Button>
          </div>

          {/* 결과 보기 버튼 */}
          {(posting?.generatedPosterUrl ||
            posting?.generatedBannerUrl ||
            posting?.generatedHtml) && (
            <div className="pt-4">
              <Button onClick={handleViewResult} size="lg" className="w-full">
                생성된 결과물 보기 →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostingEditPage;
