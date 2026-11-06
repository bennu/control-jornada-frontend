import { BranchEditView } from '@/sections/branch/view'

export const metadata = { title: 'Editar sucursal' }

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <BranchEditView id={id} />
}
