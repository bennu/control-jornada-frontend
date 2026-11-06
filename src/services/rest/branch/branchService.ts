import { JSON_HEADERS, request } from '@/helpers/API'
import { BranchModel, BranchRequest } from '@/model'

const apiUrl = `${process.env.BASE_URL_API}/v1/template/branch`
export const allBranches = async (): Promise<BranchModel[]> => {
  return request<BranchModel[]>(apiUrl)
}

export const branchById = async (id: string | number): Promise<BranchModel> => {
  return request<BranchModel>(`${apiUrl}/${id}`)
}

export const createBranch = async (
  branch: BranchRequest
): Promise<BranchModel> => {
  return request<BranchModel>(apiUrl, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(branch)
  })
}

export const updateBranch = async (
  id: string | number,
  branch: BranchRequest
): Promise<BranchModel> => {
  return request<BranchModel>(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(branch)
  })
}

export const deleteBranch = async (id: string | number): Promise<void> => {
  return request<void>(`${apiUrl}/${id}`, { method: 'DELETE' })
}
