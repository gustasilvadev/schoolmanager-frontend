import { forwardRef, useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ label, error, className, id, ...props }, ref) {
    const [visible, setVisible] = useState(false)
    const inputId = id ?? props.name

    return (
      <div className="space-y-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-300"
          >
            {label}
          </label>
        ) : (
          <div className="space-y-1.5"></div>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={visible ? 'text' : 'password'}
            className={cn(
              'w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 pr-11 text-sm text-white',
              'placeholder:text-slate-500',
              'focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={visible}
            tabIndex={-1}
            className={cn(
              'absolute inset-y-0 right-0 flex items-center px-3 text-slate-500',
              'hover:text-slate-300 focus:text-indigo-400 focus:outline-none',
              'transition-colors',
            )}
          >
            {visible ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    )
  },
)
