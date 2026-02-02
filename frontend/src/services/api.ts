const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface ValidateCVResponse {
  success: boolean
  detail: string
  status: number
  data?: {
    is_cv: boolean
  }
}

export const validateCV = async (
  file: File,
  jobDescription?: string
): Promise<ValidateCVResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  if (jobDescription) {
    formData.append('job_description', jobDescription)
  }

  const response = await fetch(`${API_BASE_URL}/cv/validate`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || 'Error al validar el CV')
  }

  return response.json()
}
