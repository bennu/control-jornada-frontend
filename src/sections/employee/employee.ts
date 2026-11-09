import * as Yup from 'yup'

import { TableHeadItem } from '@/components/table'

export const TABLE_HEAD: TableHeadItem[] = [
  { id: 'code', label: 'Código', width: 120 },
  { id: 'name', label: 'Nombre' },
  { id: 'lastName', label: 'Apellido', sortable: false },
  { id: 'country', label: 'Nacionalidad', sortable: false },
  { id: 'maritalStatus', label: 'Estado civil', sortable: false },
  { id: '', width: 110, align: 'right' }
]

const refSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string()
})

// FK obligatoria: debe venir un objeto con id (null no es válido)
const requiredRef = (message: string) =>
  refSchema
    .nullable()
    .test('required-ref', message, (value) => !!value && value.id != null)

export const EmployeeSchema = Yup.object({
  code: Yup.string().trim().required('El código es obligatorio').max(20, 'Máximo 20 caracteres'),
  name: Yup.string().trim().required('El nombre es obligatorio').max(200, 'Máximo 200 caracteres'),
  lastName: Yup.string()
    .trim()
    .required('El apellido paterno es obligatorio')
    .max(200, 'Máximo 200 caracteres'),
  address: Yup.string()
    .trim()
    .required('La dirección es obligatoria')
    .max(500, 'Máximo 500 caracteres'),

  motherLastName: Yup.string().max(200, 'Máximo 200 caracteres').default(''),
  birthDate: Yup.string().default(''),
  email: Yup.string().email('Correo inválido').default(''),
  phone: Yup.string().max(20, 'Máximo 20 caracteres').default(''),
  contractDate: Yup.string().default(''),
  contractEndDate: Yup.string().default(''),

  // FK obligatorias (NOT NULL): null dispara error
  gender: requiredRef('El género es obligatorio'),
  maritalStatus: requiredRef('El estado civil es obligatorio'),
  jobType: requiredRef('El tipo de puesto es obligatorio'),
  country: requiredRef('La nacionalidad es obligatoria'),
  branch: requiredRef('La sede es obligatoria'),
  commune: requiredRef('La comuna es obligatoria'),
  jobScheduler: requiredRef('El horario es obligatorio'),

  // FK opcional (NULL en BD)
  contractType: refSchema.nullable().default(null)
})

export type EmployeeFormValues = Yup.InferType<typeof EmployeeSchema>

export const EMPLOYEE_DEFAULT_VALUES: EmployeeFormValues = {
  code: '',
  name: '',
  lastName: '',
  address: '',
  motherLastName: '',
  birthDate: '',
  email: '',
  phone: '',
  contractDate: '',
  contractEndDate: '',
  gender: null,
  maritalStatus: null,
  jobType: null,
  contractType: null,
  country: null,
  branch: null,
  commune: null,
  jobScheduler: null
}