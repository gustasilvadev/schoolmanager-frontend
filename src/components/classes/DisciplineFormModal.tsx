import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
  useCreateDiscipline,
  useUpdateDiscipline,
} from '@/hooks/useDisciplines'
import type { Discipline } from '@/types/classes'

const schema = z.object({
  discipline_name: z
    .string()
    .min(1, 'Nome obrigatório')
    .max(45, 'Máximo 45 caracteres'),
  discipline_hour: z.coerce
    .number({ error: 'Informe um número' })
    .int('Deve ser inteiro')
    .positive('Deve ser maior que zero'),
})

type FormInput = z.input<typeof schema>
type FormValues = z.output<typeof schema>

interface DisciplineFormModalProps {
  open: boolean
  editing: Discipline | null
  onClose: () => void
}

export function DisciplineFormModal({
  open,
  editing,
  onClose,
}: DisciplineFormModalProps) {
  const { mutate: create, isPending: creating } = useCreateDiscipline()
  const { mutate: update, isPending: updating } = useUpdateDiscipline()
  const isPending = creating || updating

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) {
      reset(
        editing
          ? {
              discipline_name: editing.discipline_name,
              discipline_hour: editing.discipline_hour,
            }
          : { discipline_name: '', discipline_hour: '' as unknown as number },
      )
    }
  }, [open, editing, reset])

  function onSubmit(values: FormValues) {
    if (editing) {
      update(
        { id: editing.discipline_id, payload: values },
        { onSuccess: onClose },
      )
    } else {
      create(values, { onSuccess: onClose })
    }
  }

  return (
    <Modal
      open={open}
      title={editing ? 'Editar Disciplina' : 'Nova Disciplina'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nome da Disciplina"
          placeholder="Ex: Matemática"
          error={errors.discipline_name?.message}
          {...register('discipline_name')}
        />
        <Input
          label="Carga Horária (horas)"
          type="number"
          placeholder="Ex: 60"
          min={1}
          error={errors.discipline_hour?.message}
          {...register('discipline_hour')}
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
