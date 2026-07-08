import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, wrapperClassName = '', className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 text-text-muted" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full h-9 rounded-lg border bg-white text-sm text-text-primary placeholder:text-text-muted',
              'transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple',
              'disabled:bg-surface-secondary disabled:text-text-muted disabled:cursor-not-allowed',
              error
                ? 'border-red-400 focus:ring-red-400/20 focus:border-red-400'
                : 'border-surface-border hover:border-surface-border-strong',
              leftIcon ? 'pl-9' : 'pl-3',
              rightIcon ? 'pr-9' : 'pr-3',
              className,
            ].join(' ')}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <span className="pointer-events-none absolute right-3 text-text-muted" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p id={`${inputId}-error`} className="text-xs text-red-600 flex items-center gap-1" role="alert">{error}</p>}
        {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-text-muted">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, wrapperClassName = '', className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={[
            'w-full rounded-lg border bg-white text-sm text-text-primary placeholder:text-text-muted',
            'px-3 py-2.5 resize-y',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple',
            'disabled:bg-surface-secondary disabled:cursor-not-allowed',
            error
              ? 'border-red-400 focus:ring-red-400/20'
              : 'border-surface-border hover:border-surface-border-strong',
            className,
          ].join(' ')}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
