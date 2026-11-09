'use client'

import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
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
import { CityModel } from '@/model'
import { paths } from '@/routes/paths'
import { allCities, deleteCity } from '@/services/rest'
import { getComparator, includesText, Order } from '@/utils/table-filter'

import { TABLE_HEAD } from '../city'
import CityNewEditForm from '../city-new-edit-form'
import CityTableRow from '../city-table-row'
import CityTableToolbar from '../city-table-toolbar'

export default function CityListView() {
  const table = useTable()
  const { enqueueSnackbar } = useSnackbar()

  const [cityList, setCityList] = useState<CityModel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [openCreate, setOpenCreate] = useState(false)
  const [editId, setEditId] = useState<string>()

  useEffect(() => {
    const getCities = async () => {
      try {
        const response = await allCities()
        setCityList(response)
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }

    getCities()
  }, [enqueueSnackbar])

  const dataFiltered = applyFilter({
    cityList,
    searchText,
    order: table.order,
    orderBy: table.orderBy as keyof CityModel
  })

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  )

  const handleSearch = (value: string) => {
    table.onResetPage()
    setSearchText(value)
  }

  const handleDeleteRow = async (id: number) => {
    try {
      await deleteCity(id)
      enqueueSnackbar('Ciudad eliminada')
      setCityList((prev) => prev.filter((city) => city.id !== id))
      if (dataInPage.length === 1 && table.page > 0) {
        table.onChangePage(null, table.page - 1)
      }
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
    }
  }

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Lista de ciudades"
        links={[{ name: 'Ciudades', href: paths.city.root }, { name: 'Lista' }]}
        action={
          <Button
            onClick={() => setOpenCreate(true)}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Agregar
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <CityTableToolbar text={searchText} onChangeText={handleSearch} />

        <TableContainer>
          <Table sx={{ minWidth: 720 }}>
            <TableHeadCustom
              headLabel={TABLE_HEAD}
              order={table.order}
              orderBy={table.orderBy}
              onSort={table.onSort}
            />

            <TableBody>
              {loading && <TableLoading colSpan={TABLE_HEAD.length} />}

              {!loading &&
                dataInPage.map((row) => (
                  <CityTableRow
                    key={row.id}
                    row={row}
                    onEditRow={() => setEditId(String(row.id))}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                  />
                ))}

              {!loading && !dataFiltered.length && (
                <TableNoData colSpan={TABLE_HEAD.length} />
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Agregar ciudad</DialogTitle>
        <CityNewEditForm
          onSuccess={() => {
            setOpenCreate(false)
            allCities().then(setCityList)
          }}
          onCancel={() => setOpenCreate(false)}
        />
      </Dialog>

      <Dialog
        open={Boolean(editId)}
        onClose={() => setEditId(undefined)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar ciudad</DialogTitle>
        {editId && (
          <CityNewEditForm
            cityId={editId}
            onSuccess={() => {
              setEditId(undefined)
              allCities().then(setCityList)
            }}
            onCancel={() => setEditId(undefined)}
          />
        )}
      </Dialog>
    </Container>
  )
}

function applyFilter({
  cityList,
  searchText,
  order,
  orderBy
}: {
  cityList: CityModel[]
  searchText: string
  order: Order
  orderBy: keyof CityModel
}) {
  return [...cityList]
    .filter((city) => !searchText || includesText(city.name, searchText))
    .sort(getComparator<CityModel>(order, orderBy))
}
