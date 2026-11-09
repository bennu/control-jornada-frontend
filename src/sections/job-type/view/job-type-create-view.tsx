'use client'

import Container from '@mui/material/Container'
import CustomBreadcrumbs from '@/components/custom-breadcrumbs'
import { paths } from '@/routes/paths'
import JobTypeNewEditForm from '../job-type-new-edit-form'

export default function JobTypeCreateView() {
  return (
    <Container maxWidth="md">
      <CustomBreadcrumbs
        heading="Crear tipo de trabajo"
        links={[
          { name: 'Tipos de trabajo', href: paths.jobType.list },
          { name: 'Agregar' }
        ]}
        sx={{ mb: 3 }}
      />
      <JobTypeNewEditForm />
    </Container>
  )
}
