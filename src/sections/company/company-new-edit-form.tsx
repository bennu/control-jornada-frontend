import { yupResolver } from '@hookform/resolvers/yup'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import FormProvider, { RHFSwitch, RHFTextField } from '@/components/hook-form'
import { useSnackbar } from '@/components/snackbar'
import { getErrorMessage } from '@/helpers/API'
import { CommuneModel, CompanyRequest } from '@/model'
import {
  allCommunes,
  companyById,
  saveCompany,
  updateCompany
} from '@/services/rest'

import {
  COMPANY_DEFAULT_VALUES,
  CompanyFormValues,
  CompanySchema
} from './company'

interface Props {
  companyId?: string
  // el formulario vive dentro de un modal de la lista
  onSuccess: VoidFunction
  onCancel: VoidFunction
}

export default function CompanyNewEditForm({
  companyId,
  onSuccess,
  onCancel
}: Props) {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(!!companyId)
  const [communes, setCommunes] = useState<CommuneModel[]>([])
  const [communesLoading, setCommunesLoading] = useState(true)

  const methods = useForm<CompanyFormValues>({
    resolver: yupResolver(CompanySchema),
    defaultValues: COMPANY_DEFAULT_VALUES
  })

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  useEffect(() => {
    const getCommunes = async () => {
      try {
        setCommunes(await allCommunes())
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
      } finally {
        setCommunesLoading(false)
      }
    }

    getCommunes()
  }, [enqueueSnackbar])

  useEffect(() => {
    if (!companyId) return

    const getCompany = async () => {
      try {
        const company = await companyById(companyId)
        reset({
          communeId: company.commune.id,
          code: company.code,
          name: company.name,
          address: company.address,
          phone: company.phone ?? '',
          alias: company.alias ?? '',
          giro: company.giro ?? '',
          email: company.email ?? '',
          geolocation: company.geolocation,
          selfie: company.selfie,
          lag: company.lag
        })
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
        onCancel()
      } finally {
        setLoading(false)
      }
    }

    getCompany()
  }, [companyId, reset, enqueueSnackbar, onCancel])

  const onSubmit = handleSubmit(async (data) => {
    // el back espera la comuna como objeto
    const { communeId, phone, alias, giro, email, ...rest } = data
    const company: CompanyRequest = {
      ...rest,
      // los opcionales vacíos se envían como null
      phone: phone.trim() || null,
      alias: alias.trim() || null,
      giro: giro.trim() || null,
      email: email.trim() || null,
      commune: { id: communeId }
    }

    try {
      if (companyId) {
        await updateCompany(companyId, company)
        enqueueSnackbar('Empresa actualizada')
      } else {
        await saveCompany(company)
        enqueueSnackbar('Empresa creada')
      }
      onSuccess()
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
    }
  })

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <RHFTextField name="code" label="Código" required />
          <RHFTextField name="name" label="Nombre" required />
          <RHFTextField name="address" label="Dirección" required />
          <Controller
            name="communeId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                options={communes}
                value={
                  communes.find((commune) => commune.id === field.value) ?? null
                }
                getOptionLabel={(commune) => commune.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, commune) => field.onChange(commune?.id)}
                onBlur={field.onBlur}
                noOptionsText="Sin coincidencias"
                loading={communesLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Comuna *"
                    placeholder="Selecciona una comuna"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            )}
          />
          <RHFTextField name="phone" label="Teléfono" />
          <RHFTextField name="alias" label="Alias" />
          <RHFTextField name="giro" label="Giro" />
          <RHFTextField name="email" label="Correo" type="email" />

          <Stack direction="row" spacing={3} flexWrap="wrap">
            <RHFSwitch name="geolocation" label="Geolocalización" />
            <RHFSwitch name="selfie" label="Selfie" />
            <RHFSwitch name="lag" label="Lag" />
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {companyId ? 'Guardar cambios' : 'Crear empresa'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </FormProvider>
  )
}
