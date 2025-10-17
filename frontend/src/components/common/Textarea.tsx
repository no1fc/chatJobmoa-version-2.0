import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const baseClasses =
    'flex min-h-[80px] w-full rounded-md border bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  const normalClasses = 'border-slate-300 focus:ring-blue-500';
  const errorClasses = 'border-red-500 focus:ring-red-500';

  const textareaClasses = `${baseClasses} ${error ? errorClasses : normalClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          {label}
        </label>
      )}
      <textarea className={textareaClasses} {...props} />
      {error && <p className="text-sm font-normal text-red-500 mt-2">{error}</p>}
      {helperText && !error && (
        <p className="text-sm font-normal text-slate-500 mt-2">{helperText}</p>
      )}
    </div>
  );
};
