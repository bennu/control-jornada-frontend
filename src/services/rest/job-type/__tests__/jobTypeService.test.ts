import {
  allJobTypes,
  jobTypeById,
  createJobType,
  updateJobType,
  deleteJobType
} from '../jobTypeService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

describe('jobTypeService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  const jobType = {
    id: 1,
    name: 'Analista',
    company: {
      id: 1,
      name: 'Bennu SA'
    },
    branch: {
      id: 1,
      name: 'Sucursal Centro'
    }
  }

  it('allJobTypes devuelve la lista de tipos de trabajo', async () => {
    mockFetch.mockResolvedValue(jsonResponse([jobType]))

    const result = await allJobTypes()

    expect(result).toEqual([jobType])
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/job-type'),
      undefined
    )
  })

  it('jobTypeById busca un tipo de trabajo por ID', async () => {
    mockFetch.mockResolvedValue(jsonResponse(jobType))

    const result = await jobTypeById(1)

    expect(result).toEqual(jobType)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/job-type/1'),
      undefined
    )
  })

  it('createJobType envía un POST con objetos company y branch', async () => {
    const request = {
      name: 'Analista',
      company: { id: 1 },
      branch: { id: 1 }
    }

    mockFetch.mockResolvedValue(jsonResponse(jobType))

    await createJobType(request)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/job-type'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  })

  it('updateJobType envía un PUT con el ID en la URL', async () => {
    const request = {
      name: 'Analista senior',
      company: { id: 1 },
      branch: { id: 1 }
    }

    mockFetch.mockResolvedValue(jsonResponse(jobType))

    await updateJobType(1, request)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/job-type/1'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(request)
      })
    )
  })

  it('deleteJobType envía un DELETE', async () => {
    mockFetch.mockResolvedValue(jsonResponse(null))

    await deleteJobType(1)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/job-type/1'),
      expect.objectContaining({
        method: 'DELETE'
      })
    )
  })
})
