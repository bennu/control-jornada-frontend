import DeleteIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/EditOutlined'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'

import { ConfirmDialog } from '@/components/custom-dialog'
import { useBoolean } from '@/hooks/use-boolean'
import { BranchModel } from '@/model'

interface Props {
  row: BranchModel
  onEditRow: VoidFunction
  onDeleteRow: VoidFunction
}

export default function BranchTableRow({ row, onEditRow, onDeleteRow }: Props) {
  const confirm = useBoolean()
  return (
    <>
      <TableRow hover>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.company?.name || 'Sin Información'}</TableCell>
        <TableCell>{row.commune?.name || 'Sin Información'}</TableCell>
        <TableCell>{row.address}</TableCell>
        <TableCell>{row.phone || 'Sin Información'}</TableCell>
        <TableCell>{row.alias || 'Sin Información'}</TableCell>
        <TableCell>
          {row.active ? (
            <CheckIcon color="success" aria-label="Sí" />
          ) : (
            <CloseIcon color="error" aria-label="No" />
          )}
        </TableCell>
        <TableCell align="right">
          <Tooltip title="Editar">
            <IconButton onClick={onEditRow}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton color="error" onClick={confirm.onTrue}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Eliminar"
        content={
          <>
            ¿Seguro que quieres eliminar la sucursal <strong>{row.name}</strong>
            ?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse()
              onDeleteRow()
            }}
          >
            Eliminar
          </Button>
        }
      />
    </>
  )
}
