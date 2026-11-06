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
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'

import CustomBreadcrumbs from '@/components/custom-breadcrumbs'
import {
  TableHeadCustom,
  TableLoading,
  TableNoData,
  TablePaginationCustom,
  useTable
} from '@/components/table'
import { getErrorMessage } from '@/helpers/API'
import { ContractTypeModel } from '@/model'
import { paths } from '@/routes/paths'
import { allContractTypes, deleteContractType } from '@/services/rest'
import { useSnackbar } from '@/components/snackbar'
import { getComparator, includesText, Order } from '@/utils/table-filter'

import ContractTypeTableRow from '../contract-type-table-row'
import { TABLE_HEAD } from '../contract-type'
import ContractTypeNewEditForm from '../contract-type-new-edit-form'

export default function ContractTypeListView() {
  const { enqueueSnackbar } = useSnackbar()
  const table = useTable({ defaultOrderBy: 'id', defaultOrder: 'asc' })

  const [contractTypes, setContractTypes] = useState<ContractTypeModel[]>([])

  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [openCreate, setOpenCreate] = useState(false)
  const [editId, setEditId] = useState<string>()

  useEffect(() => {
    const getContractTypes = async () => {
      try {
        const response = await allContractTypes()
        setContractTypes(response)
      } catch (error) {
        enqueueSnackbar(getErrorMessage(error), {
          variant: 'error'
        })
      } finally {
        setLoading(false)
      }
    }

    getContractTypes()
  }, [enqueueSnackbar])

  const filteredContractTypes = contractTypes.filter((contractType) =>
    contractType.name.toLowerCase().includes(searchText.toLowerCase())
  )
  const dataFiltered = [...filteredContractTypes].sort(
    getComparator<ContractTypeModel>(
      table.order,
      table.orderBy as keyof ContractTypeModel
    )
  )
  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  )

  const handleDeleteRow = async (id: number) => {
    try {
      await deleteContractType(id)

      enqueueSnackbar('Tipo de contrato eliminado')

      setContractTypes((currentContractTypes) =>
        currentContractTypes.filter((contractType) => contractType.id !== id)
      )
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), {
        variant: 'error'
      })
    }
  }

  return (
    <Container maxWidth="md">
      <CustomBreadcrumbs
        heading="Tipos de contrato"
        links={[
          {
            name: 'Tipos de contrato',
            href: paths.contractType.list
          },
          {
            name: 'Lista'
          }
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
        sx={{ mb: 3 }}
      />

      <TextField
        label="Buscar por nombre"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Card>
        <TableContainer>
          <Table>
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
                  <ContractTypeTableRow
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
        <DialogTitle>Agregar tipo de contrato</DialogTitle>
        <ContractTypeNewEditForm
          onSuccess={() => {
            setOpenCreate(false)
            allContractTypes().then(setContractTypes)
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
        <DialogTitle>Editar tipo de contrato</DialogTitle>
        {editId && (
          <ContractTypeNewEditForm
            contractTypeId={editId}
            onSuccess={() => {
              setEditId(undefined)
              allContractTypes().then(setContractTypes)
            }}
            onCancel={() => setEditId(undefined)}
          />
        )}
      </Dialog>
    </Container>
  )
}
