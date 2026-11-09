import { handleResponse, JSON_HEADERS } from '@/helpers/API'
import {
  EmployeeModel,
  EmployeeRequest,
} from '@/model'

const apiUrl = 'http://localhost:8080/v1/template/employee'

// ============================================================
// CRUD de empleados (backend real)
// ============================================================

export const allEmployees = async (): Promise<EmployeeModel[]> => {
  const response = await fetch(apiUrl)
  return handleResponse<EmployeeModel[]>(response)
}

export const employeeById = async (id: string | number): Promise<EmployeeModel> => {
  const response = await fetch(`${apiUrl}/${id}`)
  return handleResponse<EmployeeModel>(response)
}

export const saveEmployee = async (employee: EmployeeRequest): Promise<EmployeeModel> => {
  console.log("Enviando para guardar el empleado..");
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(employee)
  })
  return handleResponse<EmployeeModel>(response)
}

export const updateEmployee = async (
  id: string | number,
  employee: EmployeeRequest
): Promise<EmployeeModel> => {
  console.log("Enviando para actualizar el empleado..");
  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(employee)
  })
  return handleResponse<EmployeeModel>(response)
}

export const deleteEmployee = async (id: string | number): Promise<void> => {
  const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
  return handleResponse<void>(response)
}
