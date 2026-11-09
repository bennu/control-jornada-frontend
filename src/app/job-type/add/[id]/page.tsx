import { JobTypeEditView } from '@/sections/job-type/view'

export const metadata = { title: 'Editar tipo de trabajo' }

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <JobTypeEditView id={id} />
}
