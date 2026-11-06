'use client'

import Container from '@mui/material/Container'
import CustomBreadcrumbs from '@/components/custom-breadcrumbs'
import { paths } from '@/routes/paths'
import BranchNewEditForm from '../branch-new-edit-form'

export default function BranchCreateView() {
  return (
    <Container maxWidth="md">
      <CustomBreadcrumbs
        heading="Crear sucursal"
        links={[
          { name: 'Sucursales', href: paths.branch.list },
          { name: 'Agregar' }
        ]}
        sx={{ mb: 3 }}
      />
      <BranchNewEditForm />
    </Container>
  )
}
