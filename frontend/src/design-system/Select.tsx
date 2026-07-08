import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: ReactNode;
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, leftIcon, wrapperClassName = '', className = '', id, ...props }, ref) => {
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
            <span className="pointer-events-none absolute left-3 text-text-muted z-10" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <select
            ref={ref}
            id={inputId}
            className={[
              'w-full appearance-none h-9 rounded-lg border bg-white text-sm text-text-primary',
              'pr-8 transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple',
              'disabled:bg-surface-secondary disabled:text-text-muted disabled:cursor-not-allowed',
              error
                ? 'border-red-400 focus:ring-red-400/20'
                : 'border-surface-border hover:border-surface-border-strong',
              leftIcon ? 'pl-9' : 'pl-3',
              className,
            ].join(' ')}
            aria-invalid={!!error}
            {...props}
          >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 h-4 w-4 text-text-muted" aria-hidden="true" />
        </div>
        {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
