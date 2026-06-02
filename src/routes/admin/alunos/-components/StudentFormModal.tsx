import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCreateStudent, useUpdateStudent } from '@/hooks/useStudents'
import { ResponsibleSubForm } from './ResponsibleSubForm'
import type { Student } from '@/types/student'

const responsibleSchema = z.object({
  responsible_name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  responsible_email: z.string().email('E-mail inválido'),
})

const schema = z.object({
  student_name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  student_cpf: z.string().min(11, 'CPF inválido').max(14),
  student_email: z.string().email('E-mail inválido'),
  student_birthday: z.string().min(1, 'Data obrigatória'),
  responsibles: z.array(responsibleSchema).max(2),
})

export type StudentFormValues = z.infer<typeof schema>

const defaultValues: StudentFormValues = {
  student_name: '',
  student_cpf: '',
  student_email: '',
  student_birthday: '',
  responsibles: [],
}

interface StudentFormModalProps {
  student: Student | null
  open: boolean
  onClose: () => void
}

export function StudentFormModal({
  student,
  open,
  onClose,
}: StudentFormModalProps) {
  const isEditing = student !== null

  const { mutateAsync: createStudent, isPending: isCreating } = useCreateStudent()
  const { mutateAsync: updateStudent, isPending: isUpdating } = useUpdateStudent()
  const isPending = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'responsibles',
  })

  useEffect(() => {
    if (student) {
      reset({
        student_name: student.student_name,
        student_cpf: student.student_cpf ?? '',
        student_email: student.student_email,
        student_birthday: student.student_birthday?.split('T')[0] ?? '',
        responsibles:
          student.student_responsibles?.map((sr) => ({
            responsible_name: sr.responsibles.responsible_name,
            responsible_email: sr.responsibles.responsible_email,
          })) ?? [],
      })
    } else {
      reset(defaultValues)
    }
  }, [student, reset])

  async function onSubmit(values: StudentFormValues) {
    try {
      if (isEditing) {
        await updateStudent({ id: student.student_id, payload: values })
        toast.success('Aluno atualizado com sucesso')
      } else {
        await createStudent({ ...values, student_status: 1 })
        toast.success('Aluno criado com sucesso')
        reset(defaultValues)
      }
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar aluno')
    }
  }

  function handleClose() {
    reset(defaultValues)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={isEditing ? 'Editar Aluno' : 'Novo Aluno'}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Dados pessoais
          </p>
          <Input
            label="Nome"
            placeholder="Nome completo"
            error={errors.student_name?.message}
            {...register('student_name')}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="CPF"
              placeholder="000.000.000-00"
              error={errors.student_cpf?.message}
              {...register('student_cpf')}
            />
            <Input
              label="Data de nascimento"
              type="date"
              error={errors.student_birthday?.message}
              {...register('student_birthday')}
            />
          </div>
          <Input
            label="E-mail"
            type="email"
            placeholder="aluno@email.com"
            error={errors.student_email?.message}
            {...register('student_email')}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Responsáveis
            </p>
            {fields.length < 2 && (
              <button
                type="button"
                onClick={() =>
                  append({ responsible_name: '', responsible_email: '' })
                }
                className="flex items-center gap-1 text-xs text-blue-400 transition hover:text-blue-300"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Adicionar responsável
              </button>
            )}
          </div>

          {fields.length === 0 && (
            <p className="text-xs text-slate-500">Nenhum responsável adicionado.</p>
          )}

          {fields.map((field, index) => (
            <ResponsibleSubForm
              key={field.id}
              index={index}
              register={register}
              errors={errors}
              onRemove={() => remove(index)}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? isEditing
                ? 'Salvando...'
                : 'Criando...'
              : isEditing
                ? 'Salvar'
                : 'Criar Aluno'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
