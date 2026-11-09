import { BranchModel } from './branch.model'
import { CommuneModel } from './commune.model'
import { ContractTypeModel } from './contract-type.model'
import { CountryModel } from './country.model'
import { GenderModel } from './gender.model'
import { JobSchedulerModel } from './job-scheduler.model'
import { JobTypeModel } from './job-type.model'
import { MaritalStatusModel } from './marital-status.model'

export interface EmployeeModel {
  id: number
  uuid?: string | null
  code: string
  name: string
  lastName: string
  motherLastName?: string | null
  address: string // NOT NULL
  email?: string | null
  phone?: string | null
  birthDate?: string | null
  contractDate?: string | null
  contractEndDate?: string | null
  active?: boolean
  inUse?: boolean

  branch?: BranchModel
  jobScheduler?: JobSchedulerModel
  commune?: CommuneModel
  country?: CountryModel
  gender?: GenderModel
  maritalStatus?: MaritalStatusModel
  contractType?: ContractTypeModel
  jobType?: JobTypeModel
}

export interface EmployeeRequest {
  code: string
  name: string
  lastName: string
  address: string
  motherLastName?: string | null
  birthDate?: string | null
  email?: string | null
  phone?: string | null
  contractDate?: string | null
  contractEndDate?: string | null
  branch: { id: number }
  jobScheduler: { id: number }
  commune: { id: number }
  country: { id: number }
  gender: { id: number }
  maritalStatus: { id: number }
  jobType: { id: number }
  contractType?: { id: number }
  active?: boolean
}

// Modelo reducido para tu selector de empleados
export type EmployeeOption = Pick<
  EmployeeModel,
  'id' | 'code' | 'name' | 'lastName' | 'motherLastName'
>

// Función para obtener el nombre completo
export const getEmployeeFullName = (
  employee: EmployeeOption
): string =>
  [
    employee.name,
    employee.lastName,
    employee.motherLastName
  ]
    .filter(Boolean)
    .join(' ')
