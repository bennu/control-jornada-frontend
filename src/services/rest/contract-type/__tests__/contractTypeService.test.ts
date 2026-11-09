import {
  allContractTypes,
  contractTypeById,
  createContractType,
  updateContractType,
  deleteContractType
} from '../contractTypeService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

describe('contractTypeService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('allContractTypes devuelve la lista de tipos de contrato', async () => {
    const contractTypes = [{ id: 1, name: 'Indefinido' }]

    mockFetch.mockResolvedValue(jsonResponse(contractTypes))

    const result = await allContractTypes()

    expect(result).toEqual(contractTypes)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/contract-type'),
      undefined
    )
  })

  it('contractTypeById busca un tipo de contrato por ID', async () => {
    const contractType = {
      id: 1,
      name: 'Indefinido'
    }

    mockFetch.mockResolvedValue(jsonResponse(contractType))

    const result = await contractTypeById(1)

    expect(result).toEqual(contractType)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/contract-type/1'),
      undefined
    )
  })

  it('createContractType envía un POST', async () => {
    const request = {
      name: 'Plazo fijo'
    }

    mockFetch.mockResolvedValue(jsonResponse({ id: 2, ...request }, 200))

    await createContractType(request)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/contract-type'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  })

  it('updateContractType envía un PUT con el ID en la URL', async () => {
    const request = {
      name: 'Contrato actualizado'
    }

    mockFetch.mockResolvedValue(jsonResponse({ id: 1, ...request }))

    await updateContractType(1, request)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/contract-type/1'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(request)
      })
    )
  })

  it('deleteContractType envía un DELETE', async () => {
    mockFetch.mockResolvedValue(jsonResponse(null))

    await deleteContractType(1)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/contract-type/1'),
      expect.objectContaining({
        method: 'DELETE'
      })
    )
  })
})
