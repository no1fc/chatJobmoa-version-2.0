'use client';

import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/common/Checkbox';
import { aiGeneratorService, SmeBenefit } from '@/services/aiGeneratorService';

interface BenefitSelectorProps {
  selectedBenefits?: string[];
  onSelectionChange: (benefitIds: string[]) => void;
}

export const BenefitSelector: React.FC<BenefitSelectorProps> = ({
  selectedBenefits = [],
  onSelectionChange,
}) => {
  const [benefits, setBenefits] = useState<SmeBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    try {
      const data = await aiGeneratorService.getActiveBenefits();
      setBenefits(data);
    } catch (err) {
      setError('혜택 목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (benefitId: string) => {
    const newSelection = selectedBenefits.includes(benefitId)
      ? selectedBenefits.filter((id) => id !== benefitId)
      : [...selectedBenefits, benefitId];

    onSelectionChange(newSelection);
  };

  if (loading) {
    return (
      <div className="w-full p-6 bg-white rounded-lg border border-slate-300">
        <p className="text-sm text-slate-500">혜택 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 rounded-lg border border-red-200">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">
        중소기업 취업자 지원 혜택 선택
      </h3>
      <p className="text-sm text-slate-500">
        채용 공고에 포함할 혜택을 선택하세요
      </p>

      <div className="space-y-3">
        {benefits.map((benefit) => (
          <label
            key={benefit.id}
            className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-300 hover:border-blue-500 cursor-pointer transition-colors"
          >
            <Checkbox
              checked={selectedBenefits.includes(benefit.id)}
              onChange={() => handleToggle(benefit.id)}
            />
            <div className="flex-1">
              <p className="text-base font-medium text-slate-900">
                {benefit.name}
              </p>
              <p className="text-sm text-slate-600 mt-1">
                {benefit.description}
              </p>
              {benefit.sourceUrl && (
                <a
                  href={benefit.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  자세히 보기 →
                </a>
              )}
            </div>
          </label>
        ))}
      </div>

      {benefits.length === 0 && (
        <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-500 text-center">
            현재 이용 가능한 혜택이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};
