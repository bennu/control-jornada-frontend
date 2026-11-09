import { CommuneModel, CommuneRequestCreate, CommuneRequestUpdate, CommuneWriteResponse } from '@/model'
import { allCommunes, createCommune, deleteCommune, updateCommune } from '../commune-service'

const mockFetch = jest.fn()
global.fetch = mockFetch

const jsonResponse = (body: unknown, status = 200) => 
    new Response(body ? JSON.stringify(body) : undefined, { status })

describe('communeService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('allCommunes devuelve la lista de todas las comunas', async () => {

    const communes: CommuneModel[] = [
      { id: 1, name: "Santiago", cityId: 1, siiCode: "13062", tgrCode: "302",
        city: { id: 1, name: "Santiago" },
        region: { id: 1, name: "RM" },
        country: { id: 1, name: "Chile" }
      }
    ]
    mockFetch.mockResolvedValue(jsonResponse(communes))

    const result = await allCommunes()

    expect(result).toEqual(communes)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/commune'))
  })

  it('communeById devuelve una comuna', async () => {

    const commune: CommuneModel = { id: 1, name: "Santiago", cityId: 1, siiCode: "13062", tgrCode: "302",
        city: { id: 1, name: "Santiago" },
        region: { id: 1, name: "RM" },
        country: { id: 1, name: "Chile" }
    }
    mockFetch.mockResolvedValue(jsonResponse(commune))

    const result = await allCommunes()

    expect(result).toEqual(commune)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/commune'))
  })

  it('createCommune envía un POST con la comuna en el body', async () => {
    const newCommune: CommuneRequestCreate = { name: "Santiago", cityId: 1, siiCode: "13062", tgrCode: "302" }
    mockFetch.mockResolvedValue(jsonResponse({ id: 10, ...newCommune } as CommuneWriteResponse, 201))

    await createCommune(newCommune)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/commune'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newCommune)
      })
    )
  })

  it('updateCommune envía un PUT con el tipo en el body', async () => {
    const communeToUpdate: CommuneRequestUpdate = { id: 10, name: "Santiago", cityId: 1, siiCode: "13062", tgrCode: "302" }
    mockFetch.mockResolvedValue(jsonResponse(communeToUpdate as CommuneWriteResponse))

    await updateCommune(communeToUpdate)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/commune'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(communeToUpdate)
      })
    )
  })

  it('deleteCommune envía un DELETE', async () => {
    const communeToDelete = { id: 10, name: "Santiago", cityId: 1, siiCode: "13062", tgrCode: "302" }
    mockFetch.mockResolvedValue(jsonResponse(undefined, 200)) // body vacío

    await deleteCommune(communeToDelete.id)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/commune/${communeToDelete.id}`),
      expect.objectContaining({
        method: 'DELETE'
      })
    )
  })
})
