import { RegionModel } from '@/model/region.model'

import { allRegions, regionById, saveRegion, updateRegion, deleteRegion } from '../regionService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const jsonResponse = (body: unknown, status = 200) =>
  new Response(body ? JSON.stringify(body) : undefined, { status })

describe('regionService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('allRegions devuelve la lista de todas las regiones', async () => {

    const regions: RegionModel[] = [
      { id: 1, name: 'Lima', country: { id: 1, name: 'Chile', nationality: 'Chilena' } }
    ]
    mockFetch.mockResolvedValue(jsonResponse(regions))

    const result = await allRegions()

    expect(result).toEqual(regions)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/region'))
  })

  it('regionById devuelve una región', async () => {

    const region: RegionModel = { id: 1, name: 'Lima', country: { id: 1, name: 'Peru', nationality: 'peruana' } }
    mockFetch.mockResolvedValue(jsonResponse(region))

    const result = await regionById(region.id)

    expect(result).toEqual(region)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining(`/region/${region.id}`))
  })

  it('saveRegion envía un POST con la región en el body', async () => {
    const newRegion = { name: 'Indiana', country: { id: 1 } }
    mockFetch.mockResolvedValue(jsonResponse({ id: 10, ...newRegion }, 201))

    await saveRegion(newRegion)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/region'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newRegion)
      })
    )
  })

  it('updateRegion envía un PUT con la región en el body', async () => {
    const regionToUpdate = { id: 10, name: 'Illinosis', country: { id: 1 } }
    mockFetch.mockResolvedValue(jsonResponse(regionToUpdate))

    await updateRegion(regionToUpdate.id, regionToUpdate)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/region/${regionToUpdate.id}`),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(regionToUpdate)
      })
    )
  })

  it('deleteRegion envía un DELETE', async () => {
    const regionToDelete = { id: 10, name: 'Nueva York', country: { id: 1 } }
    mockFetch.mockResolvedValue(jsonResponse(undefined, 200))

    await deleteRegion(regionToDelete.id)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/region/${regionToDelete.id}`),
      expect.objectContaining({
        method: 'DELETE'
      })
    )
  })
})
