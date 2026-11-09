import {
  allBranches,
  branchById,
  createBranch,
  updateBranch,
  deleteBranch
} from '../branchService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

describe('branchService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  const branch = {
    id: 1,
    company: {
      id: 1,
      name: 'Bennu SA'
    },
    commune: {
      id: 1,
      name: 'Santiago'
    },
    name: 'Sucursal Centro',
    address: 'Av. Siempre Viva 123',
    phone: '+56912345678',
    alias: 'Centro',
    active: true
  }

  it('allBranches devuelve la lista de sucursales', async () => {
    mockFetch.mockResolvedValue(jsonResponse([branch]))

    const result = await allBranches()

    expect(result).toEqual([branch])
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/branch'),
      undefined
    )
  })

  it('branchById busca una sucursal por ID', async () => {
    mockFetch.mockResolvedValue(jsonResponse(branch))

    const result = await branchById(1)

    expect(result).toEqual(branch)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/branch/1'),
      undefined
    )
  })

  it('createBranch envía los objetos company y commune', async () => {
    const request = {
      company: { id: 1 },
      commune: { id: 1 },
      name: 'Sucursal Centro',
      address: 'Av. Siempre Viva 123',
      phone: '+56912345678',
      alias: 'Centro',
      active: true
    }

    mockFetch.mockResolvedValue(jsonResponse(branch))

    await createBranch(request)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/branch'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  })

  it('updateBranch envía un PUT con el ID en la URL', async () => {
    const request = {
      company: { id: 1 },
      commune: { id: 1 },
      name: 'Sucursal actualizada',
      address: 'Av. Siempre Viva 456',
      phone: '',
      alias: '',
      active: false
    }

    mockFetch.mockResolvedValue(jsonResponse(branch))

    await updateBranch(1, request)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/branch/1'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(request)
      })
    )
  })

  it('deleteBranch envía un DELETE', async () => {
    mockFetch.mockResolvedValue(jsonResponse(null))

    await deleteBranch(1)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/branch/1'),
      expect.objectContaining({
        method: 'DELETE'
      })
    )
  })
})
