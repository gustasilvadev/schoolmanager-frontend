import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import type { NoticeFormValues } from './NoticeFormModal'

interface NoticeFormFieldsProps {
  register: UseFormRegister<NoticeFormValues>
  errors: FieldErrors<NoticeFormValues>
}

export function NoticeFormFields({ register, errors }: NoticeFormFieldsProps) {
  return (
    <>
      <Input
        label="Título"
        placeholder="Digite o título do aviso"
        error={errors.notice_title?.message}
        {...register('notice_title')}
      />

      <div>
        <label
          htmlFor="notice_content"
          className="mb-1.5 block text-sm font-medium text-slate-300"
        >
          Conteúdo
        </label>
        <textarea
          id="notice_content"
          placeholder="Digite o conteúdo do aviso"
          rows={6}
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          {...register('notice_content')}
        />
        {errors.notice_content && (
          <p className="mt-1 text-xs text-red-400">
            {errors.notice_content.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="notice_priority"
          className="mb-1.5 block text-sm font-medium text-slate-300"
        >
          Prioridade
        </label>
        <select
          id="notice_priority"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          {...register('notice_priority', { valueAsNumber: true })}
        >
          <option value={1}>Baixa</option>
          <option value={2}>Média</option>
          <option value={3}>Alta</option>
          <option value={4}>Urgente</option>
        </select>
      </div>
    </>
  )
}