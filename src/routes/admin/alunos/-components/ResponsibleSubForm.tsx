import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { StudentFormValues } from './StudentFormModal'

interface ResponsibleSubFormProps {
  index: number
  register: UseFormRegister<StudentFormValues>
  errors: FieldErrors<StudentFormValues>
  onRemove: () => void
}

export function ResponsibleSubForm({
  index,
  register,
  errors,
  onRemove,
}: ResponsibleSubFormProps) {
  const responsibleErrors = errors.responsibles?.[index]

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-700 bg-slate-800/40 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-400">
          Responsável {index + 1}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          title="Remover responsável"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Input
        label="Nome"
        placeholder="Nome completo"
        error={responsibleErrors?.responsible_name?.message}
        {...register(`responsibles.${index}.responsible_name`)}
      />
      <Input
        label="E-mail"
        type="email"
        placeholder="responsavel@email.com"
        error={responsibleErrors?.responsible_email?.message}
        {...register(`responsibles.${index}.responsible_email`)}
      />
    </div>
  )
}
