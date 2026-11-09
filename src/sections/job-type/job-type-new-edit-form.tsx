'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import FormProvider, { RHFTextField } from '@/components/hook-form'
import { useSnackbar } from '@/components/snackbar'
import { getErrorMessage } from '@/helpers/API'
import {
  allBranches,
  createJobType,
  jobTypeById,
  updateJobType
} from '@/services/rest'
import { BranchOption, CompanyModel, JobTypeRequest } from '@/model'
import { allCompanies } from '@/services/rest/company/companyService'
import { RouterLink } from '@/routes/components'
import { useRouter } from '@/routes/hooks'
import { paths } from '@/routes/paths'

import {
  JOB_TYPE_DEFAULT_VALUES,
  JobTypeFormValues,
  JobTypeSchema
} from './job-type'

interface Props {
  jobTypeId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function JobTypeNewEditForm({
  jobTypeId,
  onSuccess,
  onCancel
}: Props) {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(Boolean(jobTypeId))
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [companies, setCompanies] = useState<CompanyModel[]>([])
  const [branches, setBranches] = useState<BranchOption[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState(0)

  const methods = useForm<JobTypeFormValues>({
    resolver: yupResolver(JobTypeSchema),
    defaultValues: JOB_TYPE_DEFAULT_VALUES
  })
  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  useEffect(() => {
    Promise.all([allCompanies(), allBranches()])
      .then(([companyList, branchList]) => {
        setCompanies(companyList)
        setBranches(branchList)
      })
      .catch((error) =>
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
      )
      .finally(() => setOptionsLoading(false))
  }, [enqueueSnackbar])

  useEffect(() => {
    if (!jobTypeId) return
    jobTypeById(jobTypeId)
      .then((jobType) => {
        setSelectedCompanyId(jobType.company.id)
        reset({
          name: jobType.name,
          companyId: jobType.company.id,
          branchId: jobType.branch.id
        })
      })
      .catch((error) => {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
        router.push(paths.jobType.list)
      })
      .finally(() => setLoading(false))
  }, [jobTypeId, reset, enqueueSnackbar, router])

  const onSubmit = handleSubmit(async (data) => {
    try {
      const request: JobTypeRequest = {
        name: data.name,
        company: { id: data.companyId },
        branch: { id: data.branchId }
      }
      if (jobTypeId) {
        await updateJobType(jobTypeId, request)
      } else {
        await createJobType(request)
      }
      enqueueSnackbar(
        jobTypeId ? 'Tipo de trabajo actualizado' : 'Tipo de trabajo creado'
      )
      if (onSuccess) onSuccess()
      else router.push(paths.jobType.list)
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
    }
  })

  if (loading || optionsLoading)
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    )

  const availableBranches = branches.filter(
    (branch) => branch.company?.id === selectedCompanyId
  )

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <RHFTextField
            name="name"
            label="Nombre"
            required
            inputProps={{ maxLength: 100 }}
          />
          <Controller
            name="companyId"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Empresa"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={(event) => {
                  const id = Number(event.target.value)
                  setSelectedCompanyId(id)
                  field.onChange(id)
                  methods.setValue('branchId', 0)
                }}
              >
                <MenuItem value={0}>Seleccione una empresa</MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="branchId"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Sucursal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                disabled={!selectedCompanyId}
              >
                <MenuItem value={0}>Seleccione una sucursal</MenuItem>
                {availableBranches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {onCancel ? (
              <Button onClick={onCancel} variant="outlined" color="inherit">
                Cancelar
              </Button>
            ) : (
              <Button
                component={RouterLink}
                href={paths.jobType.list}
                variant="outlined"
                color="inherit"
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {jobTypeId ? 'Guardar cambios' : 'Crear tipo de trabajo'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </FormProvider>
  )
}
