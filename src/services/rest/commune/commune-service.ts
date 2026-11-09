import { handleResponse, JSON_HEADERS } from '@/helpers/API'
import {
  CommuneModel,
  CommuneRequestCreate,
  CommuneRequestUpdate,
  CommuneWriteResponse
} from '@/model/commune.model'

const apiUrl = `${process.env.BASE_URL_API}/v1/template/commune`

export const allCommunes = async (): Promise<
  CommuneModel[]
> => {
  const response = await fetch(apiUrl)
  return handleResponse<CommuneModel[]>(response)
}

export const communeById = async (
  id: number | string
): Promise<CommuneModel> => {
  const response = await fetch(`${apiUrl}/${id}`)
  return handleResponse<CommuneModel>(response)
}

export const createCommune = async (
  commune: CommuneRequestCreate
): Promise<CommuneWriteResponse> => {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(commune)
  })
  return handleResponse<CommuneWriteResponse>(response)
}

export const updateCommune = async (
  commune: CommuneRequestUpdate
): Promise<CommuneWriteResponse> => {
  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(commune)
  })
  return handleResponse<CommuneWriteResponse>(response)
}

export const deleteCommune = async (
  id: number | string
): Promise<void> => {
  const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
  return handleResponse<void>(response)
}
