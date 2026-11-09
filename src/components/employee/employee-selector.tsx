
'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import type { EmployeeOption } from '@/model/employee.model'
import { getEmployeeFullName } from '@/model/employee.model'
import { getEmployees } from '@/services/rest/employee/employeeService'
import { getErrorMessage } from '@/helpers/API'
import { useSnackbar } from '@/components/snackbar'

interface EmployeeSelectorProps {
  value: number | null
  onChange: (id: number) => void
  error?: boolean
  helperText?: string
}

export default function EmployeeSelector({
  value,
  onChange,
  error,
  helperText
}: EmployeeSelectorProps) {
  const { enqueueSnackbar } = useSnackbar()

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const [employees, setEmployees] = useState<EmployeeOption[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [loadError, setLoadError] = useState(false)

  // Obtener empleados reales desde el backend
  useEffect(() => {
    let cancelled = false

    const loadEmployees = async () => {
      try {
        setLoadingEmployees(true)
        setLoadError(false)

        const data = await getEmployees()

        if (!cancelled) {
          setEmployees(data)
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(true)

          enqueueSnackbar(getErrorMessage(error), {
            variant: 'error'
          })
        }
      } finally {
        if (!cancelled) {
          setLoadingEmployees(false)
        }
      }
    }

    void loadEmployees()

    return () => {
      cancelled = true
    }
  }, [enqueueSnackbar])

  // Empleado seleccionado
  const selectedEmployee = useMemo(() => {
    return employees.find(employee => employee.id === value)
  }, [employees, value])

  // Filtrar empleados por nombre, código o ID
  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase()

    return employees.filter(employee => {
      const fullName = getEmployeeFullName(employee)

      return [
        fullName,
        employee.code,
        String(employee.id)
      ].some(field =>
        String(field ?? '').toLowerCase().includes(term)
      )
    })
  }, [employees, search])

  // Seleccionar empleado
  const handleSelect = (employee: EmployeeOption) => {
    onChange(employee.id)
    setOpen(false)
    setSearch('')
  }

  // Cerrar modal
  const handleClose = () => {
    setOpen(false)
    setSearch('')
  }

  return (
    <>
      <Stack spacing={1}>
        <Typography variant="subtitle2">
          Empleado *
        </Typography>

        <Box
          sx={{
            border: '1px solid',
            borderColor: error ? 'error.main' : 'divider',
            borderRadius: 1,
            p: 2
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            {selectedEmployee ? (
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
              >
                <Avatar>
                  <PersonIcon />
                </Avatar>

                <Box>
                  <Typography fontWeight={600}>
                    {selectedEmployee.code} - {getEmployeeFullName(selectedEmployee)}
                  </Typography>
                </Box>
              </Stack>
            ) : (
              <Typography color="text.secondary">
                {loadingEmployees && value != null && value > 0
                  ? 'Cargando empleado...'
                  : value != null && value > 0
                    ? 'No se pudo encontrar el empleado seleccionado'
                    : 'Selecciona un empleado para registrar su asistencia'}
              </Typography>
            )}

            <Button
              variant="outlined"
              onClick={() => setOpen(true)}
            >
              {selectedEmployee ? 'Cambiar' : 'Buscar'}
            </Button>
          </Stack>
        </Box>

        {helperText && (
          <Typography
            variant="caption"
            color={error ? 'error.main' : 'text.secondary'}
          >
            {helperText}
          </Typography>
        )}
      </Stack>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Seleccionar empleado
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              fullWidth
              placeholder="Buscar por nombre o código"
              value={search}
              onChange={event => setSearch(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }
              }}
            />

            {loadingEmployees ? (
              <Box
                sx={{
                  py: 5,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <CircularProgress size={24} />

                <Typography color="text.secondary">
                  Cargando empleados...
                </Typography>
              </Box>
            ) : loadError ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="error">
                  No se pudieron cargar los empleados.
                </Typography>
              </Box>
            ) : (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {filteredEmployees.length} empleado(s) encontrado(s)
                </Typography>

                {filteredEmployees.length === 0 ? (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      No se encontraron empleados.
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {filteredEmployees.map(employee => (
                      <ListItemButton
                        key={employee.id}
                        selected={value === employee.id}
                        onClick={() => handleSelect(employee)}
                        sx={{ borderRadius: 1, mb: 1 }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={`${employee.code} - ${getEmployeeFullName(employee)}`}
                        />

                        {value === employee.id ? (
                          <CheckCircleIcon color="primary" />
                        ) : (
                          <Chip
                            label="Seleccionar"
                            size="small"
                          />
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </>
            )}
          </Stack>
        </DialogContent>

        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
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
        </DialogActions>

      </Dialog>
    </>
  )
}
