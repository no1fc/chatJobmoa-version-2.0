'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/common/Button';
import { aiGeneratorService } from '@/services/aiGeneratorService';
import { useUserStore } from '@/store/userStore';

interface AIKeywordSuggesterProps {
  jobType: string;
  position: string;
  initialKeywords?: string[];
  onKeywordsChange: (keywords: string[]) => void;
  onSuggestion?: (keywords: string[], qualifications: string[]) => void;
}

export const AIKeywordSuggester: React.FC<AIKeywordSuggesterProps> = ({
  jobType,
  position,
  initialKeywords = [],
  onKeywordsChange,
  onSuggestion,
}) => {
  const { token } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [recommendedKeywords, setRecommendedKeywords] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(initialKeywords);
  const [customKeyword, setCustomKeyword] = useState('');
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const isInitialMount = useRef(true);

  useEffect(() => {
    setSelectedKeywords(initialKeywords);
  }, [initialKeywords]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    onKeywordsChange(selectedKeywords);
  }, [selectedKeywords, onKeywordsChange]);

  const handleRecommend = async () => {
    if (!jobType || !position) {
      setError('직종과 직무를 먼저 입력해주세요.');
      return;
    }

    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await aiGeneratorService.recommendKeywords(
        { jobType, position },
        token,
      );

      setRecommendedKeywords(result.keywords);
      setQualifications(result.qualifications);

      if (onSuggestion) {
        onSuggestion(result.keywords, result.qualifications);
      }
    } catch (err) {
      setError('AI 추천을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    } else {
      if (selectedKeywords.length >= 10) {
        setError('키워드는 최대 10개까지만 선택할 수 있습니다.');
        return;
      }
      setSelectedKeywords([...selectedKeywords, keyword]);
      setError('');
    }
  };

  const addCustomKeyword = () => {
    const trimmed = customKeyword.trim();

    if (!trimmed) {
      setError('키워드를 입력해주세요.');
      return;
    }

    if (selectedKeywords.includes(trimmed)) {
      setError('이미 추가된 키워드입니다.');
      return;
    }

    if (selectedKeywords.length >= 10) {
      setError('키워드는 최대 10개까지만 선택할 수 있습니다.');
      return;
    }

    setSelectedKeywords([...selectedKeywords, trimmed]);
    setCustomKeyword('');
    setError('');
  };

  const removeKeyword = (keyword: string) => {
    setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomKeyword();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">AI 키워드 추천</h3>
        <Button
          variant="accent"
          onClick={handleRecommend}
          disabled={loading || !jobType || !position}
        >
          {loading ? 'AI 분석 중...' : 'AI 추천 받기'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {recommendedKeywords.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">추천 키워드 (클릭하여 선택)</h4>
          <div className="flex flex-wrap gap-2">
            {recommendedKeywords.map((keyword, index) => (
              <button
                key={index}
                type="button"
                onClick={() => toggleKeyword(keyword)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedKeywords.includes(keyword)
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {keyword}
                {selectedKeywords.includes(keyword) && ' ✓'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-700">직접 키워드 입력</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={customKeyword}
            onChange={(e) => setCustomKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="키워드를 입력하세요"
            className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={selectedKeywords.length >= 10}
          />
          <Button
            variant="primary"
            onClick={addCustomKeyword}
            disabled={selectedKeywords.length >= 10}
          >
            추가
          </Button>
        </div>
      </div>

      {selectedKeywords.length > 0 && (
        <div className="p-4 bg-slate-50 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-700">선택된 키워드</h4>
            <span className="text-sm text-slate-600">{selectedKeywords.length}/10</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-white text-slate-700 rounded-full border border-slate-300"
              >
                <span>{keyword}</span>
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="ml-1 text-slate-500 hover:text-red-600 transition-colors font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {qualifications.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">우대 자격요건</h4>
          <ul className="list-disc list-inside space-y-1">
            {qualifications.map((qual, index) => (
              <li key={index} className="text-sm text-slate-600">
                {qual}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
