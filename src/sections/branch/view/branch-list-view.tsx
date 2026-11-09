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
import { 
  TableHeadCustom, 
  TableLoading, 
  TableNoData, 
  TablePaginationCustom, 
  useTable 
} from '@/components/table'
import { useSnackbar } from '@/components/snackbar'
import { getErrorMessage } from '@/helpers/API'
import { BranchModel } from '@/model'
import { RouterLink } from '@/routes/components'
import { paths } from '@/routes/paths'
import { allBranches, deleteBranch } from '@/services/rest'

import BranchTableRow from '../branch-table-row'
import { TABLE_HEAD } from '../branch'
import BranchNewEditForm from '../branch-new-edit-form'

export default function BranchListView() {
  const { enqueueSnackbar } = useSnackbar()
  const table = useTable({ defaultOrderBy: 'id', defaultOrder: 'asc' })
  const [branches, setBranches] = useState<BranchModel[]>([])
  const [loading, setLoading] = useState(true)
  const [openCreate, setOpenCreate] = useState(false)
  const [editId, setEditId] = useState<string>()

  useEffect(() => {
    allBranches().then(setBranches).catch((error) => 
      enqueueSnackbar(
        getErrorMessage(error), 
        { variant: 'error' }
      )).finally(() => setLoading(false))
  }, [enqueueSnackbar])

  const remove = async (id: number) => {
    try { 
      await deleteBranch(id); 
      setBranches((items) => 
        items.filter((item) => item.id !== id)
    ); enqueueSnackbar('Sucursal eliminada') }
    catch (error) { enqueueSnackbar(getErrorMessage(error), { variant: 'error' }) }
  }

  const reloadBranches = async () => {
    const result = await allBranches()
    setBranches(result)
  }

  const dataFiltered = [...branches].sort((a, b) => 
    table.order === 'asc' ? a.id - b.id : b.id - a.id)
  const dataInPage = 
    dataFiltered.slice(
      table.page * table.rowsPerPage, 
      table.page * table.rowsPerPage + table.rowsPerPage)

    return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Sucursales"
        links={[
          { name: 'Sucursales', href: paths.branch.list },
          { name: 'Lista' },
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
                  <BranchTableRow
                    key={row.id}
                    row={row}
                    onEditRow={() => setEditId(String(row.id))}
                    onDeleteRow={() => remove(row.id)}
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
        maxWidth="md"
      >
        <DialogTitle>Agregar sucursal</DialogTitle>

        <BranchNewEditForm
          onSuccess={() => {
            setOpenCreate(false)
            reloadBranches()
          }}
          onCancel={() => setOpenCreate(false)}
        />
      </Dialog>

      <Dialog
        open={Boolean(editId)}
        onClose={() => setEditId(undefined)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Editar sucursal</DialogTitle>

        {editId && (
          <BranchNewEditForm
            branchId={editId}
            onSuccess={() => {
              setEditId(undefined)
              reloadBranches()
            }}
            onCancel={() => setEditId(undefined)}
          />
        )}
      </Dialog>
    </Container>
  )
}
