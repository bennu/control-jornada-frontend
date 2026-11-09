import * as Yup from 'yup'

import { TableHeadItem } from '@/components/table'

export const TABLE_HEAD: TableHeadItem[] = [
  { id: 'id', label: '#', width: 80 },
  { id: 'name', label: 'Nombre' },
  { id: '', width: 110, align: 'right' }
]

export const ContractTypeSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('El nombre es obligatorio')
    .max(200, 'Máximo 200 caracteres')
})

export type ContractTypeFormValues = Yup.InferType<typeof ContractTypeSchema>

export const CONTRACT_TYPE_DEFAULT_VALUES: ContractTypeFormValues = {
  name: ''
}
