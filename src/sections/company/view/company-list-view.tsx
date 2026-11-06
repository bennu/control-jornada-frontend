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
import { CompanyModel } from '@/model'
import { paths } from '@/routes/paths'
import { allCompanies, deleteCompany } from '@/services/rest'
import { getComparator, includesText, Order } from '@/utils/table-filter'

import { TABLE_HEAD } from '../company'
import CompanyNewEditForm from '../company-new-edit-form'
import CompanyTableRow from '../company-table-row'
import CompanyTableToolbar from '../company-table-toolbar'

export default function CompanyListView() {
  const table = useTable()
  const { enqueueSnackbar } = useSnackbar()

  const [companyList, setCompanyList] = useState<CompanyModel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [openCreate, setOpenCreate] = useState(false)
  const [editId, setEditId] = useState<string>()

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const response = await allCompanies()
        console.log(response);
        setCompanyList(response)
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }

    getCompanies()
  }, [enqueueSnackbar])

  const dataFiltered = applyFilter({
    companyList,
    searchText,
    order: table.order,
    orderBy: table.orderBy as keyof CompanyModel
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
      await deleteCompany(id)
      enqueueSnackbar('Empresa eliminada')
      setCompanyList((prev) => prev.filter((company) => company.id !== id))
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
        heading="Lista de empresas"
        links={[
          { name: 'Empresas', href: paths.company.root },
          { name: 'Lista' }
        ]}
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
        <CompanyTableToolbar text={searchText} onChangeText={handleSearch} />

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
                  <CompanyTableRow
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
        <DialogTitle>Agregar empresa</DialogTitle>
        <CompanyNewEditForm
          onSuccess={() => {
            setOpenCreate(false)
            allCompanies().then(setCompanyList)
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
        <DialogTitle>Editar empresa</DialogTitle>
        {editId && (
          <CompanyNewEditForm
            companyId={editId}
            onSuccess={() => {
              setEditId(undefined)
              allCompanies().then(setCompanyList)
            }}
            onCancel={() => setEditId(undefined)}
          />
        )}
      </Dialog>
    </Container>
  )
}

function applyFilter({
  companyList,
  searchText,
  order,
  orderBy
}: {
  companyList: CompanyModel[]
  searchText: string
  order: Order
  orderBy: keyof CompanyModel
}) {
  return [...companyList]
    .filter(
      (company) =>
        !searchText ||
        includesText(company.code, searchText) ||
        includesText(company.name, searchText)
    )
    .sort(getComparator<CompanyModel>(order, orderBy))
}
