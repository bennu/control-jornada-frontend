'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import EmployeeSelector from '@/components/employee/employee-selector'

import FormProvider, { RHFTextField } from '@/components/hook-form'
import { useSnackbar } from '@/components/snackbar'
import { getErrorMessage } from '@/helpers/API'
import type { RegisterRequest } from '@/model'
import { RouterLink } from '@/routes/components'
import { useRouter } from '@/routes/hooks'
import { paths } from '@/routes/paths'

import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import type {
  JustificationTypeOption
} from '@/model/justification.model'

import {
  allJustificationTypes as getJustificationTypes,
  justificationById as getJustificationById,
  saveJustification as createJustification,
  updateJustification
} from '@/services/rest/justification/justificationService'


import {
  registerById,
  saveRegister,
  updateRegister
} from '@/services/rest/register/registerService'

import {
  REGISTER_DEFAULT_VALUES,
  RegisterFormValues,
  RegisterSchema
} from './register'

interface Props {
  registerId?: string
}

export default function RegisterNewEditForm({ registerId }: Props) {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(!!registerId)

  const [justificationTypes, setJustificationTypes] =
  useState<JustificationTypeOption[]>([])

  const [existingAttachment, setExistingAttachment] =
  useState<string | null>(null)

  const [existingJustificationId, setExistingJustificationId] =
  useState<number | null>(null)

  const methods = useForm<RegisterFormValues>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: REGISTER_DEFAULT_VALUES
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods


  //Verificar si ek usuario activo el switch o no
  const hasJustification = methods.watch('hasJustification')

  useEffect(() => {
    if (!registerId) return

    const getRegister = async () => {
      try {
        const register = await registerById(registerId)
        const justificationId =
        register.justificationId == null
            ? null
            : Number(register.justificationId)

        let justificationTypeId: number | null = null
        let justificationComments = ''

        if (justificationId !== null) {
        const justification = await getJustificationById(justificationId)

        justificationTypeId =
          justification.justificationTypeId ??
          justification.justificationType?.id ??
          null
        justificationComments = justification.comments ?? ''

        setExistingAttachment(justification.attachment)
        }

        setExistingJustificationId(justificationId)

        reset({
        employeeId: register.employeeId,
        startOfTheDay: register.startOfTheDay?.slice(0, 5) ?? '',
        entry: register.entry?.slice(0, 5) ?? '',
        exit: register.exit?.slice(0, 5) ?? '',
        breakTime: register.breakTime?.slice(0, 5) ?? '',
        backToWork: register.backToWork?.slice(0, 5) ?? '',
        day: register.day,
        hasJustification: justificationId !== null,
        justificationTypeId,
        justificationComments
        })
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
        router.push(paths.register.list)
      } finally {
        setLoading(false)
      }
    }

    getRegister()
  }, [registerId, reset, enqueueSnackbar, router])

  const onSubmit = handleSubmit(async (data) => {
    try {
      let justificationId: number | null = null

      if (data.hasJustification) {
        if (data.justificationTypeId == null) {
          throw new Error('Selecciona un tipo de justificación')
        }

        const justificationRequest = {
          comments: data.justificationComments?.trim() || null,
          attachment: existingAttachment,
          justificationTypeId: Number(data.justificationTypeId)
        }

        if (registerId && existingJustificationId !== null) {
          await updateJustification(existingJustificationId, justificationRequest)
          justificationId = existingJustificationId
        } else {
          const created = await createJustification(justificationRequest)
          if (created.id == null) {
            throw new Error('El backend no devolvió el ID de la justificación')
          }
          justificationId = created.id
        }
      }

      const request: RegisterRequest = {
        employeeId: data.employeeId,
        startOfTheDay: data.startOfTheDay,
        entry: data.entry || null,
        exit: data.exit || null,
        breakTime: data.breakTime || null,
        backToWork: data.backToWork || null,
        day: data.day,
        justificationId
      }

      if (registerId) {
        await updateRegister(registerId, request)
        enqueueSnackbar('Registro actualizado')
      } else {
        await saveRegister(request)
        enqueueSnackbar('Registro creado')
      }

      router.push(paths.register.list)
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
    }
  })


  //Modificación del useEffect para controlar el cargar los tipos de justificación
  useEffect(() => {
  // No consultar si el Switch está desactivado
  if (!hasJustification) return

  // Evitar consultar nuevamente si ya tenemos los tipos cargados
  if (justificationTypes.length > 0) return

  let cancelled = false

  const loadTypes = async () => {
    try {
      const types = await getJustificationTypes()

      if (!cancelled) {
        setJustificationTypes(types)
      }
    } catch (error) {
      if (!cancelled) {
        enqueueSnackbar(getErrorMessage(error), {
          variant: 'error'
        })
      }
    }
  }

  void loadTypes()

  return () => {
    cancelled = true
  }
}, [hasJustification, justificationTypes.length, enqueueSnackbar])


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


          <Controller
            name="employeeId"
            control={methods.control}
            render={({ field, fieldState }) => (
                <EmployeeSelector
                value={field.value == null ? null : Number(field.value)}
                onChange={field.onChange}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                />
            )}
            />




          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Datos de la jornada
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 2.5
              }}
            >
              <RHFTextField
                name="day"
                label="Fecha"
                type="date"
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <RHFTextField
                name="startOfTheDay"
                label="Inicio de jornada"
                type="time"
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 600 }}>
              Control de asistencia
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Registra los horarios de entrada, salida y descanso.
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 2.5
              }}
            >
              <RHFTextField
                name="entry"
                label="Hora de entrada"
                type="time"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <RHFTextField
                name="exit"
                label="Hora de salida"
                type="time"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <RHFTextField
                name="breakTime"
                label="Inicio del descanso"
                type="time"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <RHFTextField
                name="backToWork"
                label="Regreso del descanso"
                type="time"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Justificación de la jornada
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Opcional. Actívala solo si necesitas registrar una justificación.
            </Typography>
          </Box>

          <Controller
            name="hasJustification"
            control={methods.control}
            render={({ field }) => (
                <FormControlLabel
                control={
                    <Switch
                      checked={Boolean(field.value)}
                      onChange={(_, checked) => {
                        field.onChange(checked)

                        if (!checked) {
                          methods.setValue('justificationTypeId', null)
                          methods.setValue('justificationComments', '')
                        }
                      }}
                    />
                }
                label="Agregar justificación"
                />
            )}
            />

            {hasJustification && (
            <>
                <Controller
                name="justificationTypeId"
                control={methods.control}
                render={({ field, fieldState }) => (
                    <TextField
                    id="justification-type"
                    select
                    fullWidth
                    label="Tipo de justificación"
                    value={field.value ?? ''}
                    onChange={(event) =>
                        field.onChange(
                        event.target.value === ''
                            ? null
                            : Number(event.target.value)
                        )
                    }
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    >
                    {justificationTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                        {type.name}
                        </MenuItem>
                    ))}
                    </TextField>
                )}
                />

                <Controller
                name="justificationComments"
                control={methods.control}
                render={({ field, fieldState }) => (
                    <TextField
                    {...field}
                    value={field.value ?? ''}
                    fullWidth
                    multiline
                    rows={3}
                    label="Comentarios"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    slotProps={{
                        htmlInput: { maxLength: 200 }
                    }}
                    />
                )}
                />

            </>
            )}

          
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
            >
              <Button
                component={RouterLink}
                href={paths.register.list}
                variant="outlined"
                color="error"
                disabled={isSubmitting}
                sx={{
                  borderRadius: 1.5,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  textTransform: 'none',
                  backgroundColor: 'rgba(211, 47, 47, 0.04)',
                  borderColor: 'rgba(211, 47, 47, 0.45)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.10)',
                    borderColor: 'error.main'
                  },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'error.main',
                    outlineOffset: 2
                  }
                }}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {registerId ? 'Guardar cambios' : 'Crear registro'}
              </Button>
            </Stack>

        </Stack>
      </Card>
    </FormProvider>
  )
}