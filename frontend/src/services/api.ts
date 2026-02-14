const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface AdaptCVResponse {
  success: boolean
  detail: string
  status: number
  data?: {
    download_url?: string
    message?: string
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64 ?? '')
    }
    reader.onerror = () => reject(reader.error)
  })
}

export const adaptCV = async (
  file: File,
  jobDescription?: string
): Promise<AdaptCVResponse> => {
  const fileBase64 = await fileToBase64(file)

  const response = await fetch(`${API_BASE_URL}/cv/adapt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file: fileBase64,
      job_description: jobDescription?.trim() || null,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Error al adaptar el CV')
  }

  return response.json()
}
