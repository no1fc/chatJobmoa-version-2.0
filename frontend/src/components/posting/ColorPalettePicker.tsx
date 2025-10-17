'use client';

import React, { useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';

interface StyleOption {
  value: string;
  label: string;
}

interface ColorPalettePickerProps {
  selectedColor?: string;
  selectedStyle?: string;
  onColorChange: (color: string) => void;
  onStyleChange: (style: string) => void;
}

const styleOptions: StyleOption[] = [
  { value: 'professional', label: '전문적인' },
  { value: 'friendly', label: '친근한' },
  { value: 'modern', label: '첨단 기술' },
  { value: 'creative', label: '창의적인' },
];

export const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  selectedColor = '#2563EB',
  selectedStyle,
  onColorChange,
  onStyleChange,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = (color: ColorResult) => {
    onColorChange(color.hex);
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 block">
          색상 톤 선택
        </label>
        <div className="flex items-start gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-3 px-4 py-3 rounded-md border-2 border-slate-300 hover:border-slate-400 transition-all bg-white"
            >
              <div
                className="w-10 h-10 rounded-md border border-slate-300"
                style={{ backgroundColor: selectedColor }}
              />
              <div className="text-left">
                <div className="text-sm font-medium text-slate-700">색상 선택</div>
                <div className="text-xs text-slate-500">{selectedColor}</div>
              </div>
            </button>

            {showColorPicker && (
              <div className="absolute z-10 mt-2">
                <div
                  className="fixed inset-0"
                  onClick={() => setShowColorPicker(false)}
                />
                <ChromePicker
                  color={selectedColor}
                  onChange={handleColorChange}
                  disableAlpha
                />
              </div>
            )}
          </div>

          <div className="flex-1 text-sm text-slate-600">
            <p>원하는 색상을 자유롭게 선택하세요.</p>
            <p className="text-xs text-slate-500 mt-1">
              AI가 선택한 색상을 기반으로 포스터와 배너를 생성합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 block">
          스타일 컨셉 선택
        </label>
        <div className="flex flex-wrap gap-3">
          {styleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onStyleChange(option.value)}
              className={`px-4 py-2 rounded-md border-2 transition-all ${
                selectedStyle === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-300 text-slate-700 hover:border-slate-400'
              }`}
            >
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
