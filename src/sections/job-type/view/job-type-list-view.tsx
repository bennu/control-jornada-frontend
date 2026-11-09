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
import { JobTypeModel } from '@/model'
import { paths } from '@/routes/paths'
import { allJobTypes, deleteJobType } from '@/services/rest'

import JobTypeTableRow from '../job-type-table-row'
import JobTypeNewEditForm from '../job-type-new-edit-form'
import { TABLE_HEAD } from '../job-type'

export default function JobTypeListView() {
  const { enqueueSnackbar } = useSnackbar()
  const table = useTable({ defaultOrderBy: 'id', defaultOrder: 'asc' })
  const [jobTypes, setJobTypes] = useState<JobTypeModel[]>([])
  const [loading, setLoading] = useState(true)
  const [openCreate, setOpenCreate] = useState(false)
  const [editId, setEditId] = useState<string>()

  useEffect(() => {
    allJobTypes()
      .then((jobTypeList) => {
        setJobTypes(jobTypeList)
      })
      .catch((error) =>
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
      )
      .finally(() => setLoading(false))
  }, [enqueueSnackbar])

  const remove = async (id: number) => {
    try {
      await deleteJobType(id)
      setJobTypes((items) => items.filter((item) => item.id !== id))
      enqueueSnackbar('Tipo de trabajo eliminado')
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' })
    }
  }

  const dataFiltered = [...jobTypes].sort((a, b) =>
    table.order === 'asc' ? a.id - b.id : b.id - a.id
  )
  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  )

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Tipos de trabajo"
        links={[
          { name: 'Tipos de trabajo', href: paths.jobType.list },
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
                  <JobTypeTableRow
                    key={row.id}
                    row={row}
                    companyName={row.company?.name ?? 'Empresa no disponible'}
                    branchName={row.branch?.name ?? 'Sucursal no disponible'}
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
        <DialogTitle>Agregar tipo de trabajo</DialogTitle>
        <JobTypeNewEditForm
          onSuccess={() => {
            setOpenCreate(false)
            allJobTypes().then(setJobTypes)
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
        <DialogTitle>Editar tipo de trabajo</DialogTitle>
        {editId && (
          <JobTypeNewEditForm
            jobTypeId={editId}
            onSuccess={() => {
              setEditId(undefined)
              allJobTypes().then(setJobTypes)
            }}
            onCancel={() => setEditId(undefined)}
          />
        )}
      </Dialog>
    </Container>
  )
}
