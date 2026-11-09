'use client'

import Container from '@mui/material/Container'
import CustomBreadcrumbs from '@/components/custom-breadcrumbs'
import { paths } from '@/routes/paths'
import BranchNewEditForm from '../branch-new-edit-form'

export default function BranchEditView({ id }: { id: string }) {
  return (
    <Container maxWidth="md">
      <CustomBreadcrumbs
        heading="Editar sucursal"
        links={[
          { name: 'Sucursales', href: paths.branch.list },
          { name: `Sucursal #${id}` }
        ]}
        sx={{ mb: 3 }}
      />
      <BranchNewEditForm branchId={id} />
    </Container>
  )
}
