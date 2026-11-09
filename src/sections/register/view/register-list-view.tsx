
'use client'

import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { useEffect, useState } from 'react'

import CustomBreadcrumbs from '@/components/custom-breadcrumbs'
import { useSnackbar } from '@/components/snackbar'
import {
  TableHeadCustom,
  TableLoading,
  TableNoData,
  TablePaginationCustom,
  useTable
} from '@/components/table'

import { getErrorMessage } from '@/helpers/API'
import type { RegisterModel } from '@/model'
import type { EmployeeOption } from '@/model/employee.model'
import { getEmployeeFullName } from '@/model/employee.model'

import { RouterLink } from '@/routes/components'
import { useRouter } from '@/routes/hooks'
import { paths } from '@/routes/paths'

import {
  allRegisters,
  deleteRegister
} from '@/services/rest/register/registerService'

import { getEmployees } from '@/services/rest/employee/employeeService'

import {
  getComparator,
  includesText,
  Order
} from '@/utils/table-filter'

import { TABLE_HEAD } from '../register'
import RegisterTableRow from '../register-table-row'
import RegisterTableToolbar from '../register-table-toolbar'

export default function RegisterListView() {
  const router = useRouter()
  const table = useTable()
  const { enqueueSnackbar } = useSnackbar()

  const [registerList, setRegisterList] = useState<RegisterModel[]>([])
  const [employees, setEmployees] = useState<EmployeeOption[]>([])

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [searchText, setSearchText] = useState('')

  // Obtener registros y empleados desde el backend
  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        setLoading(true)
        setLoadError(false)

        const [registersResponse, employeesResponse] =
          await Promise.all([
            allRegisters(),
            getEmployees()
          ])

        if (!cancelled) {
          setRegisterList(registersResponse)
          setEmployees(employeesResponse)
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
          setLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [enqueueSnackbar])

  // Filtrar y ordenar registros
  const dataFiltered = applyFilter({
    registerList,
    employees,
    searchText,
    order: table.order,
    orderBy: table.orderBy as keyof RegisterModel
  })

  // Paginar resultados
  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  )

  // Buscar registros
  const handleSearch = (value: string) => {
    table.onResetPage()
    setSearchText(value)
  }

  // Eliminar registro
  const handleDeleteRow = async (id: number) => {
    try {
      await deleteRegister(id)

      enqueueSnackbar('Registro eliminado')

      setRegisterList(prev =>
        prev.filter(register => register.id !== id)
      )

      if (dataInPage.length === 1 && table.page > 0) {
        table.onChangePage(null, table.page - 1)
      }
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), {
        variant: 'error'
      })
    }
  }

  // Mensajes personalizados para la lista de registros
  const noDataMessage = loadError
    ? 'Ocurrió un problema al consultar la información. Inténtalo nuevamente.'
    : searchText.trim()
      ? 'No se encontraron registros que coincidan con tu búsqueda. Prueba con otro nombre, código o fecha.'
      : 'Aún no hay registros de asistencia. Cuando se registre una jornada, aparecerá aquí.'

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Lista de registros"
        links={[
          { name: 'Registros', href: paths.register.root },
          { name: 'Lista' }
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.register.add}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Agregar
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <RegisterTableToolbar
          text={searchText}
          onChangeText={handleSearch}
        />

        <TableContainer>
          <Table sx={{ minWidth: 1400 }}>
            <TableHeadCustom
              headLabel={TABLE_HEAD}
              order={table.order}
              orderBy={table.orderBy}
              onSort={table.onSort}
            />

            <TableBody>
              {loading && (
                <TableLoading colSpan={TABLE_HEAD.length} />
              )}

              {!loading && !loadError &&
                dataInPage.map(row => (
                  <RegisterTableRow
                    key={row.id}
                    row={row}
                    employees={employees}
                    onEditRow={() =>
                      router.push(paths.register.edit(row.id))
                    }
                    onDeleteRow={() =>
                      handleDeleteRow(row.id)
                    }
                  />
                ))}

              {!loading && (loadError || !dataFiltered.length) && (
                <TableNoData
                  colSpan={TABLE_HEAD.length}
                  message={noDataMessage}
                />
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePaginationCustom
          count={loadError ? 0 : dataFiltered.length}
          page={loadError ? 0 : table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </Container>
  )
}

// Filtrar por empleado, código, ID o fecha
function applyFilter({
  registerList,
  employees,
  searchText,
  order,
  orderBy
}: {
  registerList: RegisterModel[]
  employees: EmployeeOption[]
  searchText: string
  order: Order
  orderBy: keyof RegisterModel
}) {
  const employeeMap = new Map(
    employees.map(employee => [
      employee.id,
      `${employee.code} ${getEmployeeFullName(employee)}`
    ])
  )

  return [...registerList]
    .filter(register => {
      if (!searchText) return true

      const employeeName =
        employeeMap.get(register.employeeId) ?? ''

      return (
        includesText(String(register.employeeId), searchText) ||
        includesText(employeeName, searchText) ||
        includesText(register.day, searchText)
      )
    })
    .sort(getComparator<RegisterModel>(order, orderBy))
}
