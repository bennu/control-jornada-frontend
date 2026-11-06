import { JSON_HEADERS, request } from '@/helpers/API'
import { JobTypeModel, JobTypeRequest } from '@/model'

const apiUrl = `${process.env.BASE_URL_API}/v1/template/job-type`

export const allJobTypes = async (): Promise<JobTypeModel[]> => {
  return request<JobTypeModel[]>(apiUrl)
}

export const jobTypeById = async (
  id: string | number
): Promise<JobTypeModel> => {
  return request<JobTypeModel>(`${apiUrl}/${id}`)
}

export const createJobType = async (
  jobType: JobTypeRequest
): Promise<JobTypeModel> => {
  return request<JobTypeModel>(apiUrl, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(jobType)
  })
}

export const updateJobType = async (
  id: string | number,
  jobType: JobTypeRequest
): Promise<JobTypeModel> => {
  return request<JobTypeModel>(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(jobType)
  })
}

export const deleteJobType = async (id: string | number): Promise<void> => {
  return request<void>(`${apiUrl}/${id}`, { method: 'DELETE' })
}
