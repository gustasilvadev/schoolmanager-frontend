import { cn } from '@/lib/utils'

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-16 w-16 text-2xl',
  xl: 'h-20 w-20 text-3xl',
} as const

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: keyof typeof SIZES
  className?: string
  /** Cor de fundo (Tailwind) usada no fallback de iniciais. */
  fallbackClassName?: string
}

export function Avatar({
  src,
  name,
  size = 'md',
  className,
  fallbackClassName,
}: AvatarProps) {
  const initial = name?.trim().charAt(0).toUpperCase() || '?'

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white',
        SIZES[size],
        !src && (fallbackClassName ?? 'bg-slate-700'),
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name ?? 'Avatar'}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  )
}
