import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCreateClass, useUpdateClass } from '@/hooks/useClasses'
import type { ClassItem } from '@/types/classes'

const schema = z.object({
  class_name: z
    .string()
    .min(1, 'Nome obrigatório')
    .max(45, 'Máximo 45 caracteres'),
  class_school_year: z
    .string()
    .min(1, 'Ano letivo obrigatório')
    .max(45, 'Máximo 45 caracteres'),
})

type FormValues = z.infer<typeof schema>

interface ClassFormModalProps {
  open: boolean
  editing: ClassItem | null
  onClose: () => void
}

export function ClassFormModal({
  open,
  editing,
  onClose,
}: ClassFormModalProps) {
  const { mutate: create, isPending: creating } = useCreateClass()
  const { mutate: update, isPending: updating } = useUpdateClass()
  const isPending = creating || updating

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) {
      reset(
        editing
          ? {
              class_name: editing.class_name,
              class_school_year: editing.class_school_year,
            }
          : { class_name: '', class_school_year: '' },
      )
    }
  }, [open, editing, reset])

  function onSubmit(values: FormValues) {
    if (editing) {
      update({ id: editing.class_id, payload: values }, { onSuccess: onClose })
    } else {
      create(values, { onSuccess: onClose })
    }
  }

  return (
    <Modal
      open={open}
      title={editing ? 'Editar Turma' : 'Nova Turma'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nome da Turma"
          placeholder="Ex: Turma A – Manhã"
          error={errors.class_name?.message}
          {...register('class_name')}
        />
        <Input
          label="Ano Letivo"
          placeholder="Ex: 2024"
          error={errors.class_school_year?.message}
          {...register('class_school_year')}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? 'Salvando...' : editing ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
