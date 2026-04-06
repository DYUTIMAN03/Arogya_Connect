import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const defaultId = React.useId();
    const inputId = id || defaultId;

    return (
      <div className={clsx('flex flex-col', className)}>
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx('input', error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50')}
          {...props}
        />
        {error && <span className="text-red-400 text-xs mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
