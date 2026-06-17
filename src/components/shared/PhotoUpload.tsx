import { useRef } from 'react'
import type { ChangeEvent } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar } from '@/components/ui/Avatar'
import { usePhotoPreview } from '@/hooks/usePhotoPreview'
import { validatePhotoFile, ACCEPTED_PHOTO_ACCEPT } from '@/lib/photo'
import { cn } from '@/lib/utils'

interface PhotoUploadProps {
  currentPhoto?: string | null
  name?: string | null
  isUploading?: boolean
  disabled?: boolean
  onFileSelected: (file: File) => void
  size?: 'lg' | 'xl'
  className?: string
  fallbackClassName?: string
}

/**
 * Avatar editável: mostra a foto atual (ou preview do arquivo escolhido) com um
 * botão de câmera que abre o seletor. Valida no client e dispara o upload na hora.
 */
export function PhotoUpload({
  currentPhoto,
  name,
  isUploading = false,
  disabled = false,
  onFileSelected,
  size = 'lg',
  className,
  fallbackClassName,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { previewUrl, setFile } = usePhotoPreview()
  const shown = previewUrl ?? currentPhoto ?? null
  const locked = disabled || isUploading

  function handleSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // permite re-selecionar o mesmo arquivo
    if (!file) return
    const error = validatePhotoFile(file)
    if (error) {
      toast.error(error)
      return
    }
    setFile(file) // preview imediato
    onFileSelected(file) // dispara o upload
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <Avatar
        src={shown}
        name={name}
        size={size}
        className="rounded-2xl"
        fallbackClassName={fallbackClassName}
      />

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_PHOTO_ACCEPT}
        className="hidden"
        onChange={handleSelect}
        disabled={locked}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={locked}
        title="Alterar foto"
        className="absolute -right-1.5 -bottom-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Camera className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  )
}
