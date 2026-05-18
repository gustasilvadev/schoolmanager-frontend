import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '#/lib/utils'

const alertVariants = cva('rounded-lg border px-4 py-3 text-sm', {
  variants: {
    variant: {
      error: 'border-red-800 bg-red-950 text-red-400',
      success: 'border-green-800 bg-green-950 text-green-400',
      info: 'border-blue-800 bg-blue-950 text-blue-400',
    },
  },
  defaultVariants: { variant: 'error' },
})

interface AlertProps extends VariantProps<typeof alertVariants> {
  message: string
  className?: string
}

export function Alert({ message, variant, className }: AlertProps) {
  return (
    <div className={cn(alertVariants({ variant }), className)}>
      <p>{message}</p>
    </div>
  )
}
