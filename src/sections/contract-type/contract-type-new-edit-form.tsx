'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import FormProvider, { RHFTextField } from '@/components/hook-form'
import { useSnackbar } from '@/components/snackbar'
import { getErrorMessage } from '@/helpers/API'
import { RouterLink } from '@/routes/components'
import { useRouter } from '@/routes/hooks'
import { paths } from '@/routes/paths'
import {
  contractTypeById,
  createContractType,
  updateContractType
} from '@/services/rest'

import {
  ContractTypeFormValues,
  ContractTypeSchema,
  CONTRACT_TYPE_DEFAULT_VALUES
} from './contract-type'

interface Props {
  contractTypeId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ContractTypeNewEditForm({
  contractTypeId,
  onSuccess,
  onCancel
}: Props) {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(Boolean(contractTypeId))

  const methods = useForm<ContractTypeFormValues>({
    resolver: yupResolver(ContractTypeSchema),
    defaultValues: CONTRACT_TYPE_DEFAULT_VALUES
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  useEffect(() => {
    if (!contractTypeId) return

    const getContractType = async () => {
      try {
        const contractType = await contractTypeById(contractTypeId)

        reset({
          name: contractType.name
        })
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), {
          variant: 'error'
        })

        router.push(paths.contractType.list)
      } finally {
        setLoading(false)
      }
    }

    getContractType()
  }, [contractTypeId, reset, enqueueSnackbar, router])

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (contractTypeId) {
        await updateContractType(contractTypeId, data)

        enqueueSnackbar('Tipo de contrato actualizado')
      } else {
        await createContractType(data)

        enqueueSnackbar('Tipo de contrato creado')
      }

      if (onSuccess) onSuccess()
      else router.push(paths.contractType.list)
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), {
        variant: 'error'
      })
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

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {onCancel ? (
              <Button onClick={onCancel} variant="outlined" color="inherit">
                Cancelar
              </Button>
            ) : (
              <Button
                component={RouterLink}
                href={paths.contractType.list}
                variant="outlined"
                color="inherit"
              >
                Cancelar
              </Button>
            )}

            <Button type="submit" variant="contained" loading={isSubmitting}>
              {contractTypeId ? 'Guardar cambios' : 'Crear'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </FormProvider>
  )
}
