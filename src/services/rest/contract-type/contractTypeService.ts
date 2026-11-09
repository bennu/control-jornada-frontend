import { JSON_HEADERS, request } from '@/helpers/API'
import { ContractTypeModel, ContractTypeRequest } from '@/model'

const apiUrl = `${process.env.BASE_URL_API}/v1/template/contract-type`

export const allContractTypes = async (): Promise<ContractTypeModel[]> => {
  return request<ContractTypeModel[]>(apiUrl)
}

export const contractTypeById = async (
  id: string | number
): Promise<ContractTypeModel> => {
  return request<ContractTypeModel>(`${apiUrl}/${id}`)
}

export const createContractType = async (
  contractType: ContractTypeRequest
): Promise<ContractTypeModel> => {
  return request<ContractTypeModel>(apiUrl, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(contractType)
  })
}

export const updateContractType = async (
  id: string | number,
  contractType: ContractTypeRequest
): Promise<ContractTypeModel> => {
  return request<ContractTypeModel>(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(contractType)
  })
}

export const deleteContractType = async (
  id: string | number
): Promise<void> => {
  return request<void>(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
}
