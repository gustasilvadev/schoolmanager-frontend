import { useEffect, useState } from 'react'

export function usePhotoPreview() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Cria o object URL quando o arquivo muda; o cleanup revoga (evita memory leak)
  // tanto ao trocar de arquivo quanto ao desmontar o componente.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  return { file, previewUrl, setFile, reset: () => setFile(null) }
}
