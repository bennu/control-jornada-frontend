export interface ContractTypeModel {
  id: number
  name: string
}

export type ContractTypeRequest = Omit<ContractTypeModel, 'id'>
