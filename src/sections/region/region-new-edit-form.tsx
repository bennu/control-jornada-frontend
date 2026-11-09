import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import MenuItem from '@mui/material/MenuItem'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import FormProvider, { RHFTextField } from '@/components/hook-form'
import { CountryModel } from '@/model/country.model'
import { useSnackbar } from '@/components/snackbar'
import { getErrorMessage } from '@/helpers/API'
import { useRouter } from '@/routes/hooks'
import { paths } from '@/routes/paths'
import { saveRegion, regionById, updateRegion } from '@/services/rest/indexRegion'
import { allCountries } from '@/services/rest'

import { REGION_DEFAULT_VALUES, RegionFormValues, RegionSchema } from './region'

interface Props {
  regionId?: string
  onCancel?: VoidFunction
  onSuccess?: VoidFunction
}

export default function RegionNewEditForm({ regionId, onCancel, onSuccess }: Props) {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(!!regionId)
  const [countries, setCountries] = useState<CountryModel[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)

  const methods = useForm<RegionFormValues>({
    resolver: yupResolver(RegionSchema),
    defaultValues: REGION_DEFAULT_VALUES
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  useEffect(() => {
    if (!regionId) return

    const getRegion = async () => {
      try {
        const region = await regionById(regionId)

        reset({
          country: { id: region.country.id },
          name: region.name
        })
      } catch (error) {
        enqueueSnackbar("No existe este registro", { variant: 'error' })
        router.push(paths.region.list)
      } finally {
        setLoading(false)
      }
    }

    getRegion()
  }, [regionId, reset, enqueueSnackbar, router])
  useEffect(() => {
    allCountries()
      .then(setCountries)
      .catch((error) => {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
      })
      .finally(() => setLoadingCountries(false))
  }, [enqueueSnackbar])

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (regionId) {
        await updateRegion(regionId, data)
        enqueueSnackbar('Región actualizada')
      } else {
        await saveRegion(data)
        enqueueSnackbar('Región creada')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(paths.region.list)
      }
    } catch (error) {
      enqueueSnackbar("Esta región ya existe", { variant: 'error' })
    }
  })

  if (loading || loadingCountries) {
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
          <RHFTextField name="name" label="Nombre" required />
          <RHFTextField name="country.id" label="País" select required>
            <MenuItem value={0}>Selecciona un país</MenuItem>
            {countries.map((country) => (
              <MenuItem key={country.id} value={country.id}>{country.name}</MenuItem>
            ))}
          </RHFTextField>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={() => onCancel ? onCancel() : router.push(paths.region.list)}
              disabled={isSubmitting}
              variant="outlined"
              color="inherit"
            >
              Cancelar
            </Button>

            <Button type="submit" variant="contained" loading={isSubmitting}>
              {regionId ? 'Guardar cambios' : 'Crear región'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </FormProvider>
  )
}