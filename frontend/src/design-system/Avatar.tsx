import { getAvatarColor, getInitials } from '@/utils';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
};

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold flex-shrink-0 ring-2 ring-white ${SIZE_CLASSES[size]} ${getAvatarColor(name)} ${className}`}
      title={name}
      aria-label={name}
    >
      {getInitials(name)}
    </span>
  );
}
