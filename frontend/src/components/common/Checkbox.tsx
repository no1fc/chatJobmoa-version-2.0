import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = '',
  ...props
}) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        className={`w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 ${className}`}
        {...props}
      />
      <label className="text-sm font-normal text-slate-900">{label}</label>
    </div>
  );
};
