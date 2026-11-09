'use client'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SearchIcon from '@mui/icons-material/Search'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import InputAdornment from '@mui/material/InputAdornment'
import ListItemButton from '@mui/material/ListItemButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'

interface Props<T extends { id: number; name?: string }> {
  open: boolean
  title: string
  options: T[]
  selectedId?: number
  // funcion opcional para el subtitulo de cada item (ej: codigo, uuid)
  getSubtitle?: (option: T) => string
  onClose: VoidFunction
  onSelect: (option: T) => void
}

// Modal de seleccion reutilizable con busqueda.
// Sirve para cualquier catalogo (nacionalidad, sede, comuna, etc.).
export default function EntitySelectModal<T extends { id: number; name?: string }>({
  open,
  title,
  options,
  selectedId,
  getSubtitle,
  onClose,
  onSelect
}: Props<T>) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => {
      const sub = getSubtitle ? getSubtitle(o).toLowerCase() : ''
      return (o.name ?? '').toLowerCase().includes(q) || sub.includes(q)
    })
  }, [options, search, getSubtitle])

  const handleSelect = (option: T) => {
    onSelect(option)
    setSearch('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre..."
          sx={{ mb: 2 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              )
            }
          }}
        />

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          {filtered.length} resultado(s)
        </Typography>

        <Stack spacing={1}>
          {filtered.map((option) => {
            const isSelected = option.id === selectedId
            return (
              <ListItemButton
                key={option.id}
                selected={isSelected}
                onClick={() => handleSelect(option)}
                sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
              >
                <Avatar sx={{ width: 34, height: 34, mr: 1.5 }}>
                  {(option.name ?? '?').charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {option.name}
                  </Typography>
                  {getSubtitle && (
                    <Typography variant="caption" color="text.secondary">
                      {getSubtitle(option)}
                    </Typography>
                  )}
                </Box>
                {isSelected && <CheckCircleIcon color="primary" fontSize="small" />}
              </ListItemButton>
            )
          })}

          {!filtered.length && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No se encontraron resultados
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  )
}