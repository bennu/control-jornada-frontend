import { yupResolver } from '@hookform/resolvers/yup'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import FormProvider, { RHFTextField } from '@/components/hook-form'
import { useSnackbar } from '@/components/snackbar'
import { getErrorMessage } from '@/helpers/API'
import { CityRequest } from '@/model'
import { RegionModel } from '@/model/region.model'
import { cityById, saveCity, updateCity } from '@/services/rest'
import { allRegions } from '@/services/rest/indexRegion'

import { CITY_DEFAULT_VALUES, CityFormValues, CitySchema } from './city'

interface Props {
  cityId?: string
  // el formulario vive dentro de un modal de la lista
  onSuccess: VoidFunction
  onCancel: VoidFunction
}

export default function CityNewEditForm({
  cityId,
  onSuccess,
  onCancel
}: Props) {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(!!cityId)
  const [regions, setRegions] = useState<RegionModel[]>([])
  const [regionsLoading, setRegionsLoading] = useState(true)

  const methods = useForm<CityFormValues>({
    resolver: yupResolver(CitySchema),
    defaultValues: CITY_DEFAULT_VALUES
  })

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  useEffect(() => {
    const getRegions = async () => {
      try {
        setRegions(await allRegions())
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
      } finally {
        setRegionsLoading(false)
      }
    }

    getRegions()
  }, [enqueueSnackbar])

  useEffect(() => {
    if (!cityId) return

    const getCity = async () => {
      try {
        const city = await cityById(cityId)
        reset({ name: city.name, regionId: city.region.id })
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
        onCancel()
      } finally {
        setLoading(false)
      }
    }

    getCity()
  }, [cityId, reset, enqueueSnackbar, onCancel])

  const onSubmit = handleSubmit(async (data) => {
    // el back espera la región como objeto
    const city: CityRequest = {
      name: data.name,
      region: { id: data.regionId }
    }

    try {
      if (cityId) {
        await updateCity(cityId, city)
        enqueueSnackbar('Ciudad actualizada')
      } else {
        await saveCity(city)
        enqueueSnackbar('Ciudad creada')
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
          <RHFTextField name="name" label="Nombre" required />
          <Controller
            name="regionId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                options={regions}
                value={
                  regions.find((region) => region.id === field.value) ?? null
                }
                getOptionLabel={(region) => region.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, region) => field.onChange(region?.id)}
                onBlur={field.onBlur}
                noOptionsText="Sin coincidencias"
                loading={regionsLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Región *"
                    placeholder="Selecciona una región"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            )}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {cityId ? 'Guardar cambios' : 'Crear ciudad'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </FormProvider>
  )
}
