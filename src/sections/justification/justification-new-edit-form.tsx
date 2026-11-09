import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import MenuItem from '@mui/material/MenuItem'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import FormProvider, { RHFTextField } from '@/components/hook-form'
import { JustificationTypeOption } from '@/model/justification.model'
import { useSnackbar } from '@/components/snackbar'
import { getErrorMessage } from '@/helpers/API'
import { useRouter } from '@/routes/hooks'
import { getAttachmentDownload } from '@/utils/attachment-download'
import { paths } from '@/routes/paths'
import { saveJustification, justificationById, updateJustification, allJustificationTypes } from '@/services/rest/indexJustification'

import { JUSTIFICATION_DEFAULT_VALUES, JustificationFormValues, JustificationSchema } from './justification'

interface Props {
  justificationId?: string
  onCancel?: VoidFunction
  onSuccess?: VoidFunction
}

export default function JustificationNewEditForm({ justificationId, onCancel, onSuccess }: Props) {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(!!justificationId)
  const [types, setTypes] = useState<JustificationTypeOption[]>([])
  const [loadingTypes, setLoadingTypes] = useState(true)

  const methods = useForm<JustificationFormValues>({
    resolver: yupResolver(JustificationSchema),
    defaultValues: JUSTIFICATION_DEFAULT_VALUES
  })

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  const attachment = useWatch({ control: methods.control, name: 'attachment' })
  const [readingAttachment, setReadingAttachment] = useState(false)

  useEffect(() => {
    if (!justificationId) return

    const getJustification = async () => {
      try {
        const justification = await justificationById(justificationId)

        reset({
          justificationType: { id: justification.justificationType.id },
          comments: justification.comments ?? '',
          attachment: justification.attachment
        })
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
        router.push(paths.justification.list)
      } finally {
        setLoading(false)
      }
    }

    getJustification()
  }, [justificationId, reset, enqueueSnackbar, router])
  useEffect(() => {
    allJustificationTypes()
      .then(setTypes)
      .catch((error) => {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
      })
      .finally(() => setLoadingTypes(false))
  }, [enqueueSnackbar])

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (justificationId) {
        await updateJustification(justificationId, data)
        enqueueSnackbar('Justificación actualizada')
      } else {
        await saveJustification(data)
        enqueueSnackbar('Justificación creada')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(paths.justification.list)
      }
    } catch (error) {
      enqueueSnackbar('Error al guardar la justificación', { variant: 'error' })
    }
  })

  if (loading || loadingTypes) {
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
          <RHFTextField name="comments" label="Comentarios" multiline rows={3} />
          <RHFTextField name="justificationType.id" label="Tipo de justificación" select required>
            <MenuItem value={0}>Selecciona un tipo</MenuItem>
            {types.map((type) => (
              <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
            ))}
          </RHFTextField>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button component="label" variant="outlined" disabled={readingAttachment || isSubmitting}>
              {readingAttachment ? 'Cargando archivo...' : attachment ? 'Cambiar archivo' : 'Adjuntar archivo (opcional)'}
              <input type="file" hidden onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                setReadingAttachment(true)
                const reader = new FileReader()
                reader.onload = () => setValue('attachment', String(reader.result).split(',')[1], { shouldDirty: true })
                reader.onerror = () => enqueueSnackbar('Hubo problemas con el archivo', { variant: 'error' })
                reader.onloadend = () => setReadingAttachment(false)
                reader.readAsDataURL(file)
                event.target.value = ''
              }} />
            </Button>
            {attachment !== null && (
              <>
                <Button component="a" {...getAttachmentDownload(attachment, 'adjunto')}>
                  Descargar adjunto
                </Button>
                <Button color="error" disabled={readingAttachment || isSubmitting} onClick={() => setValue('attachment', null, { shouldDirty: true })}>
                  Quitar adjunto
                </Button>
              </>
            )}
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={() => onCancel ? onCancel() : router.push(paths.justification.list)}
              disabled={isSubmitting || readingAttachment}
              variant="outlined"
              color="inherit"
            >
              Cancelar
            </Button>

            <Button type="submit" variant="contained" loading={isSubmitting} disabled={readingAttachment || !types.length}>
              {justificationId ? 'Guardar cambios' : 'Crear justificación'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </FormProvider>
  )
}
