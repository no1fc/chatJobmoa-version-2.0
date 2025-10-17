import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const baseClasses =
    'flex h-10 w-full rounded-md border bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  const normalClasses = 'border-slate-300 focus:ring-blue-500';
  const errorClasses = 'border-red-500 focus:ring-red-500';

  const inputClasses = `${baseClasses} ${error ? errorClasses : normalClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && <p className="text-sm font-normal text-red-500 mt-2">{error}</p>}
      {helperText && !error && (
        <p className="text-sm font-normal text-slate-500 mt-2">{helperText}</p>
      )}
    </div>
  );
};
