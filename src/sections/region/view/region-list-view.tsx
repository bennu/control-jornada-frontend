'use client'

import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { useCallback, useEffect, useState } from 'react'

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
import { RegionModel } from '@/model/region.model'
import { paths } from '@/routes/paths'
import { allRegions, deleteRegion } from '@/services/rest/indexRegion'
import { getComparator, includesText, Order } from '@/utils/table-filter'

import { TABLE_HEAD } from '../region'
import RegionNewEditForm from '../region-new-edit-form'
import RegionTableRow from '../region-table-row'
import RegionTableToolbar from '../region-table-toolbar'

export default function RegionListView() {
  const table = useTable()
  const { enqueueSnackbar } = useSnackbar()

  const [regionList, setRegionList] = useState<RegionModel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [regionId, setRegionId] = useState<string>()

  const getRegions = useCallback(() => {
    allRegions()
      .then(setRegionList)
      .catch((error) => {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
      })
      .finally(() => setLoading(false))
  }, [enqueueSnackbar])

  useEffect(() => {
    getRegions()
  }, [getRegions])

  const dataFiltered = applyFilter({
    regionList,
    searchText,
    order: table.order,
    orderBy: table.orderBy as keyof RegionModel
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
      await deleteRegion(id)
      enqueueSnackbar('Región eliminada')
      setRegionList((prev) =>prev.filter((region) => region.id !== id))
      if (dataInPage.length === 1 && table.page > 0) {
        table.onChangePage(null, table.page - 1)
      }
    } catch (error) {
      enqueueSnackbar("Primero elimina todas las ciudades de la región", { variant: 'error' })
    }
  }

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Lista de regiones"
        links={[{ name: 'Regiones', href: paths.region.root },{ name: 'Lista' }]}
        action={
          <Button
            onClick={() => {
              setRegionId(undefined)
              setFormOpen(true)
            }}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Nueva región
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <RegionTableToolbar text={searchText} onChangeText={handleSearch} />

        <TableContainer>
          <Table sx={{ minWidth: 720, tableLayout: 'fixed', '& th': { fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase' } }}>
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
                  <RegionTableRow
                    key={row.id}
                    row={row}
                    countryName={row.country.name}
                    onEditRow={() => {
                      setRegionId(String(row.id))
                      setFormOpen(true)
                    }}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                  />
                ))}

              {!loading && !dataFiltered.length && (
                <TableNoData colSpan={TABLE_HEAD.length} message="Tenemos problemas para mostrar las regiones" />
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
        open={formOpen}
        onClose={() => setFormOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="region-form-title"
      >
        <DialogTitle id="region-form-title">
          {regionId ? 'Editar región' : 'Nueva región'}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {formOpen && (
            <RegionNewEditForm
              regionId={regionId}
              onCancel={() => setFormOpen(false)}
              onSuccess={() => {
                setFormOpen(false)
                if (!regionId) table.onResetPage()
                setLoading(true)
                getRegions()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  )
}

function applyFilter({
  regionList,
  searchText,
  order,
  orderBy
}: {
  regionList: RegionModel[]
  searchText: string
  order: Order
  orderBy: keyof RegionModel
}) {
  return [...regionList]
    .filter(
      (region) =>
        !searchText || 
        includesText(region.name, searchText)
    )
    .sort(getComparator<RegionModel>(order, orderBy))
}