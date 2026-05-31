import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTeachers } from '@/hooks/useTeachers'
import {
  useCreateNotice,
  useNotice,
  useUpdateNotice,
} from '@/hooks/useNotices'
import type { NoticeItem, NoticePriority } from '@/types/notice'

interface NoticeFormModalProps {
  open: boolean
  editing: NoticeItem | null
  onClose: () => void
}

type VisibilityType = 'public' | 'restricted'

interface NoticeFormState {
  notice_title: string
  notice_content: string
  notice_priority: NoticePriority
  visibility: VisibilityType
  teacher_ids: number[]
}

const initialState: NoticeFormState = {
  notice_title: '',
  notice_content: '',
  notice_priority: 2,
  visibility: 'public',
  teacher_ids: [],
}

export function NoticeFormModal({
  open,
  editing,
  onClose,
}: NoticeFormModalProps) {
  const [form, setForm] = useState<NoticeFormState>(initialState)
  const [teacherSearch, setTeacherSearch] = useState('')

  const isEditing = Boolean(editing)
  const isRestricted = form.visibility === 'restricted'

  const { data: noticeDetails, isLoading: isLoadingDetails } = useNotice(
    editing?.notice_id,
    {
      enabled: open && Boolean(editing?.notice_id),
    },
  )

  const { data: teachersData, isLoading: isLoadingTeachers } = useTeachers(
    {
      page: 1,
      limit: 100,
      name: teacherSearch || undefined,
      includeDeleted: false,
    },
    {
      enabled: open && isRestricted,
    },
  )

  const { mutate: createNotice, isPending: isCreating } = useCreateNotice()
  const { mutate: updateNotice, isPending: isUpdating } = useUpdateNotice()

  const isSubmitting = isCreating || isUpdating
  const teachers = teachersData?.teachers ?? []

  useEffect(() => {
    if (!open) return

    if (!editing) {
      setForm(initialState)
      setTeacherSearch('')
      return
    }

    const source = noticeDetails ?? editing
    const visibilities = source.notice_visibilities ?? []
    const teacherIds = visibilities.map((visibility) => visibility.teacher_id)

    setForm({
      notice_title: source.notice_title,
      notice_content: source.notice_content,
      notice_priority: source.notice_priority,
      visibility: teacherIds.length > 0 ? 'restricted' : 'public',
      teacher_ids: teacherIds,
    })
  }, [open, editing, noticeDetails])

  if (!open) return null

  function handleToggleTeacher(teacherId: number) {
    setForm((current) => {
      const alreadySelected = current.teacher_ids.includes(teacherId)

      return {
        ...current,
        teacher_ids: alreadySelected
          ? current.teacher_ids.filter((id) => id !== teacherId)
          : [...current.teacher_ids, teacherId],
      }
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  
    if (isRestricted && form.teacher_ids.length === 0) {
      alert('Selecione pelo menos um professor para aviso restrito.')
      return
    }
  
    const basePayload = {
      notice_title: form.notice_title.trim(),
      notice_content: form.notice_content.trim(),
      notice_priority: form.notice_priority,
      notice_status: 1 as const,
    }
  
    const payload = {
      ...basePayload,
      ...(isRestricted ? { teacher_ids: form.teacher_ids } : {}),
    }
  
    if (isEditing && editing) {
      updateNotice(
        {
          id: editing.notice_id,
          payload,
        },
        {
          onSuccess: onClose,
        },
      )
      return
    }
  
    createNotice(payload, {
      onSuccess: onClose,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isEditing ? 'Editar aviso' : 'Novo aviso'}
            </h2>
            <p className="text-xs text-slate-400">
              Preencha os dados do comunicado.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isLoadingDetails ? (
          <div className="px-6 py-8 text-sm text-slate-400">
            Carregando aviso...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-h-[calc(90vh-73px)] space-y-5 overflow-y-auto px-6 py-5"
          >
            <Input
              label="Título"
              value={form.notice_title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  notice_title: event.target.value,
                }))
              }
              placeholder="Digite o título do aviso"
              required
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
                value={form.notice_content}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    notice_content: event.target.value,
                  }))
                }
                placeholder="Digite o conteúdo do aviso"
                required
                rows={6}
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
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
                value={form.notice_priority}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    notice_priority: Number(
                      event.target.value,
                    ) as NoticePriority,
                  }))
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value={1}>Baixa</option>
                <option value={2}>Média</option>
                <option value={3}>Alta</option>
                <option value={4}>Urgente</option>
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-300">
                Visibilidade
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300 transition hover:border-blue-500/50">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={form.visibility === 'public'}
                    onChange={() =>
                      setForm((current) => ({
                        ...current,
                        visibility: 'public',
                        teacher_ids: [],
                      }))
                    }
                  />
                  <div>
                    <p className="font-medium text-white">Pública</p>
                    <p className="text-xs text-slate-500">
                      Todos os professores poderão visualizar.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300 transition hover:border-blue-500/50">
                  <input
                    type="radio"
                    name="visibility"
                    value="restricted"
                    checked={form.visibility === 'restricted'}
                    onChange={() =>
                      setForm((current) => ({
                        ...current,
                        visibility: 'restricted',
                      }))
                    }
                  />
                  <div>
                    <p className="font-medium text-white">Restrita</p>
                    <p className="text-xs text-slate-500">
                      Selecione quais professores poderão visualizar.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {isRestricted && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Professores
                    </p>
                    <p className="text-xs text-slate-500">
                      {form.teacher_ids.length > 0
                        ? `${form.teacher_ids.length} professor${
                            form.teacher_ids.length !== 1 ? 'es' : ''
                          } selecionado${
                            form.teacher_ids.length !== 1 ? 's' : ''
                          }`
                        : 'Nenhum professor selecionado'}
                    </p>
                  </div>
                </div>

                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={teacherSearch}
                    onChange={(event) => setTeacherSearch(event.target.value)}
                    placeholder="Buscar professor..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {isLoadingTeachers ? (
                  <div className="rounded-lg border border-slate-800 px-4 py-6 text-center text-sm text-slate-500">
                    Carregando professores...
                  </div>
                ) : teachers.length === 0 ? (
                  <div className="rounded-lg border border-slate-800 px-4 py-6 text-center text-sm text-slate-500">
                    Nenhum professor encontrado.
                  </div>
                ) : (
                  <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                    {teachers.map((teacher) => {
                      const selected = form.teacher_ids.includes(
                        teacher.teacher_id,
                      )

                      return (
                        <label
                          key={teacher.teacher_id}
                          className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 transition hover:border-blue-500/50"
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              handleToggleTeacher(teacher.teacher_id)
                            }
                          />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {teacher.teacher_name}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {teacher.teacher_email}
                            </p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Salvando...'
                  : isEditing
                    ? 'Salvar alterações'
                    : 'Criar aviso'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}