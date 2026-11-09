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

import FormProvider, { RHFSwitch, RHFTextField } from '@/components/hook-form'
import { useSnackbar } from '@/components/snackbar'
import { getErrorMessage } from '@/helpers/API'
import { branchById, createBranch, updateBranch } from '@/services/rest'
import { BranchRequest, CompanyModel, CommuneModel } from '@/model'
import { allCommunes } from '@/services/rest/commune/commune-service'
import { allCompanies } from '@/services/rest/company/companyService'
import { RouterLink } from '@/routes/components'
import { useRouter } from '@/routes/hooks'
import { paths } from '@/routes/paths'

import { BRANCH_DEFAULT_VALUES, BranchFormValues, BranchSchema } from './branch'

interface Props {
  branchId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function BranchNewEditForm({
  branchId,
  onSuccess,
  onCancel
}: Props) {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(Boolean(branchId))
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [companies, setCompanies] = useState<CompanyModel[]>([])
  const [communes, setCommunes] = useState<CommuneModel[]>([])

  const methods = useForm<BranchFormValues>({
    resolver: yupResolver(BranchSchema),
    defaultValues: BRANCH_DEFAULT_VALUES
  })
  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [companyList, communeList] = await Promise.all([
          allCompanies(),
          allCommunes()
        ])
        setCompanies(companyList)
        setCommunes(communeList)
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
      } finally {
        setOptionsLoading(false)
      }
    }
    loadOptions()
  }, [enqueueSnackbar])

  useEffect(() => {
    if (!branchId) return
    const loadBranch = async () => {
      try {
        const branch = await branchById(branchId)
        reset({
          companyId: branch.company.id,
          communeId: branch.commune.id,
          name: branch.name,
          address: branch.address,
          phone: branch.phone ?? '',
          alias: branch.alias ?? '',
          active: branch.active ?? true
        })
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
        router.push(paths.branch.list)
      } finally {
        setLoading(false)
      }
    }
    loadBranch()
  }, [branchId, reset, enqueueSnackbar, router])

  const onSubmit = handleSubmit(async (data) => {
    try {
      const request: BranchRequest = {
        company: { id: data.companyId },
        commune: { id: data.communeId },
        name: data.name,
        address: data.address,
        phone: data.phone,
        alias: data.alias,
        active: data.active
      }
      if (branchId) {
        await updateBranch(branchId, request)
      } else {
        await createBranch(request)
      }
      enqueueSnackbar(branchId ? 'Sucursal actualizada' : 'Sucursal creada')
      if (onSuccess) onSuccess()
      else router.push(paths.branch.list)
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

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
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
            name="communeId"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Comuna"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                <MenuItem value={0}>Seleccione una comuna</MenuItem>
                {communes.map((commune) => (
                  <MenuItem key={commune.id} value={commune.id}>
                    {commune.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <RHFTextField
            name="name"
            label="Nombre"
            required
            inputProps={{ maxLength: 200 }}
          />
          <RHFTextField
            name="address"
            label="Dirección"
            required
            inputProps={{ maxLength: 500 }}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Teléfono"
                type="tel"
                inputProps={{ maxLength: 20, inputMode: 'tel' }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={(event) => {
                  const value = event.target.value.replace(/[^0-9+()\-\s]/g, '')
                  field.onChange(value)
                }}
              />
            )}
          />
          <RHFTextField
            name="alias"
            label="Alias"
            inputProps={{ maxLength: 200 }}
          />
          <RHFSwitch name="active" label="Activa" />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {onCancel ? (
              <Button onClick={onCancel} variant="outlined" color="inherit">
                Cancelar
              </Button>
            ) : (
              <Button
                component={RouterLink}
                href={paths.branch.list}
                variant="outlined"
                color="inherit"
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {branchId ? 'Guardar cambios' : 'Crear sucursal'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </FormProvider>
  )
}
