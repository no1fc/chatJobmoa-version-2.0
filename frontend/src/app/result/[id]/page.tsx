'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { postingService, JobPosting } from '@/services/postingService';
import { Button } from '@/components/common/Button';
import { useUserStore } from '@/store/userStore';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const postingId = params.id as string;
  const { isAuthenticated, token } = useUserStore();

  const [posting, setPosting] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'poster' | 'banner' | 'html'>('poster');
  const [exporting, setExporting] = useState(false);
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
  }, [mounted, isAuthenticated, token, postingId, router]);

  const fetchPosting = async () => {
    if (!token) return;

    try {
      const data = await postingService.getOne(postingId, token);
      setPosting(data);

      // Set default active tab based on what's available
      if (data.generatedPosterUrl) {
        setActiveTab('poster');
      } else if (data.generatedBannerUrl) {
        setActiveTab('banner');
      } else if (data.generatedHtml) {
        setActiveTab('html');
      }
    } catch (error) {
      console.error('Failed to fetch posting:', error);
      alert('프로젝트를 불러오는데 실패했습니다. 다시 로그인해주세요.');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async (imageUrl: string, filename: string) => {
    try {
      setExporting(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('다운로드에 실패했습니다.');
    } finally {
      setExporting(false);
    }
  };

  const handleCopyHtml = async () => {
    if (!posting?.generatedHtml) return;
    
    try {
      await navigator.clipboard.writeText(posting.generatedHtml);
      alert('HTML 코드가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('Copy failed:', error);
      alert('복사에 실패했습니다.');
    }
  };

  const handleExportPDF = async () => {
    if (!posting?.generatedHtml) return;
    
    try {
      setExporting(true);
      // Create a temporary window with the HTML content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('팝업이 차단되었습니다. 팝업을 허용해주세요.');
        return;
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${posting.title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${posting.generatedHtml}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Wait for content to load
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF 내보내기에 실패했습니다.');
    } finally {
      setExporting(false);
    }
  };

  const handleBackToEdit = () => {
    router.push(`/posting/${postingId}`);
  };

  if (!mounted || !isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">결과물을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!posting) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">프로젝트를 찾을 수 없습니다.</p>
          <Button onClick={() => router.push('/dashboard')}>대시보드로 이동</Button>
        </div>
      </div>
    );
  }

  const hasPosters = posting.generatedPosterUrl;
  const hasBanner = posting.generatedBannerUrl;
  const hasHtml = posting.generatedHtml;
  const hasAnyContent = hasPosters || hasBanner || hasHtml;

  if (!hasAnyContent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">생성된 결과물이 없습니다.</p>
          <Button onClick={handleBackToEdit}>프로젝트로 돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToEdit}
            className="text-sm text-slate-600 hover:text-slate-900 mb-4 flex items-center gap-2"
          >
            ← 프로젝트로 돌아가기
          </button>
          <h1 className="text-3xl font-bold text-slate-900">{posting.title}</h1>
          <p className="text-slate-600 mt-2">생성된 채용 콘텐츠</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-slate-200">
            <div className="flex gap-1 p-2">
              {hasPosters && (
                <button
                  onClick={() => setActiveTab('poster')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'poster'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  포스터
                </button>
              )}
              {hasBanner && (
                <button
                  onClick={() => setActiveTab('banner')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'banner'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  배너
                </button>
              )}
              {hasHtml && (
                <button
                  onClick={() => setActiveTab('html')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'html'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  채용 페이지
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Poster Tab */}
            {activeTab === 'poster' && hasPosters && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">포스터</h2>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => handleDownloadImage(posting.generatedPosterUrl!, `${posting.title}-poster.png`)}
                      disabled={exporting}
                    >
                      {exporting ? '다운로드 중...' : 'PNG 다운로드'}
                    </Button>
                  </div>
                </div>
                <div className="bg-slate-100 rounded-lg p-8 flex items-center justify-center">
                  <img
                    src={posting.generatedPosterUrl}
                    alt="Generated Poster"
                    className="max-w-full max-h-[800px] rounded-lg shadow-lg"
                  />
                </div>
              </div>
            )}

            {/* Banner Tab */}
            {activeTab === 'banner' && hasBanner && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">배너</h2>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => handleDownloadImage(posting.generatedBannerUrl!, `${posting.title}-banner.png`)}
                      disabled={exporting}
                    >
                      {exporting ? '다운로드 중...' : 'PNG 다운로드'}
                    </Button>
                  </div>
                </div>
                <div className="bg-slate-100 rounded-lg p-8 flex items-center justify-center">
                  <img
                    src={posting.generatedBannerUrl}
                    alt="Generated Banner"
                    className="max-w-full max-h-[400px] rounded-lg shadow-lg"
                  />
                </div>
              </div>
            )}

            {/* HTML Tab */}
            {activeTab === 'html' && hasHtml && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">채용 페이지</h2>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={handleCopyHtml}
                    >
                      HTML 코드 복사
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleExportPDF}
                      disabled={exporting}
                    >
                      {exporting ? '내보내는 중...' : 'PDF로 내보내기'}
                    </Button>
                  </div>
                </div>
                
                {/* Preview Frame */}
                <div className="bg-white border-2 border-slate-300 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-300">
                    <p className="text-xs text-slate-600">미리보기</p>
                  </div>
                  <div className="p-6 max-h-[800px] overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: posting.generatedHtml }} />
                  </div>
                </div>

                {/* HTML Code View */}
                <details className="bg-slate-50 rounded-lg border border-slate-300">
                  <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-slate-700 hover:bg-slate-100">
                    HTML 소스 코드 보기
                  </summary>
                  <div className="px-4 py-3 border-t border-slate-300">
                    <pre className="text-xs text-slate-700 overflow-x-auto bg-white p-4 rounded border border-slate-200">
                      <code>{posting.generatedHtml}</code>
                    </pre>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button variant="secondary" onClick={handleBackToEdit}>
            프로젝트 편집
          </Button>
          <Button onClick={() => router.push('/dashboard')}>
            대시보드로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
