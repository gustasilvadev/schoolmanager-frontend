import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useUpdateTeacher } from '@/hooks/useTeachers'
import { getTeacherByCpf, getTeacherByEmail } from '@/integrations/teachers/teachersApi'
import type { Teacher } from '@/types/teacher'

const schema = z.object({
  teacher_name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  teacher_cpf: z.string().min(1, 'Campo obrigatório'),
  teacher_email: z.string().email('E-mail inválido'),
})

type FormValues = z.infer<typeof schema>

interface TeacherEditModalProps {
  teacher: Teacher | null
  open: boolean
  onClose: () => void
}

export function TeacherEditModal({ teacher, open, onClose }: TeacherEditModalProps) {
  const { mutate: updateTeacher, isPending } = useUpdateTeacher()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (teacher) {
      reset({
        teacher_name: teacher.teacher_name,
        teacher_cpf: teacher.teacher_cpf,
        teacher_email: teacher.teacher_email,
      })
    }
  }, [teacher, reset])

  async function onSubmit(values: FormValues) {
    if (!teacher) return

    const cpfChanged = values.teacher_cpf !== teacher.teacher_cpf
    const emailChanged = values.teacher_email !== teacher.teacher_email

    let hasConflict = false

    if (cpfChanged) {
      const existing = await getTeacherByCpf(values.teacher_cpf)
      if (existing && existing.teacher_id !== teacher.teacher_id) {
        setError('teacher_cpf', { message: 'CPF já cadastrado' })
        hasConflict = true
      }
    }

    if (emailChanged) {
      const existing = await getTeacherByEmail(values.teacher_email)
      if (existing && existing.teacher_id !== teacher.teacher_id) {
        setError('teacher_email', { message: 'E-mail já cadastrado' })
        hasConflict = true
      }
    }

    if (hasConflict) return

    updateTeacher(
      { id: teacher.teacher_id, payload: values },
      { onSuccess: onClose },
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title="Editar Professor">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nome"
          placeholder="Nome completo"
          error={errors.teacher_name?.message}
          {...register('teacher_name')}
        />
        <Input
          label="CPF"
          placeholder="00000000000"
          error={errors.teacher_cpf?.message}
          {...register('teacher_cpf')}
        />
        <Input
          label="E-mail"
          type="email"
          placeholder="professor@escola.com"
          error={errors.teacher_email?.message}
          {...register('teacher_email')}
        />

        <div className="mt-2 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
