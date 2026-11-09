import { JustificationTypeModel } from '@/model'
import { allJustificationTypes, createJustificationType, deleteJustificationType, updateJustificationType } from '../justification-type-service'

const mockFetch = jest.fn()
global.fetch = mockFetch

const jsonResponse = (body: unknown, status = 200) => 
    new Response(body ? JSON.stringify(body) : undefined, { status })

describe('justTypeService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('allJustificationTypes devuelve la lista de todos los tipos de just.', async () => {

    const justTypes: JustificationTypeModel[] = [
      { id: 1, name: "Descanso médico" }
    ]
    mockFetch.mockResolvedValue(jsonResponse(justTypes))

    const result = await allJustificationTypes()

    expect(result).toEqual(justTypes)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/justification-type'))
  })

  it('justificationTypeById devuelve un tipo de justificación', async () => {

    const justType: JustificationTypeModel = { id: 1, name: "Descanso médico" }
    mockFetch.mockResolvedValue(jsonResponse(justType))

    const result = await allJustificationTypes()

    expect(result).toEqual(justType)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/justification-type'))
  })

  it('createJustificationType envía un POST con el tipo en el body', async () => {
    const newJustificationType = { name: "Licencia Personal" }
    mockFetch.mockResolvedValue(jsonResponse({ id: 10, ...newJustificationType }, 201))

    await createJustificationType(newJustificationType)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/justification-type'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newJustificationType)
      })
    )
  })

  it('updateJustificationType envía un PUT con el tipo en el body', async () => {
    const justificationTypeToUpdate = { id: 10,  name: "Licencia Personal" }
    mockFetch.mockResolvedValue(jsonResponse(justificationTypeToUpdate))

    await updateJustificationType(justificationTypeToUpdate)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/justification-type'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(justificationTypeToUpdate)
      })
    )
  })

  it('deleteJustificationType envía un DELETE', async () => {
    const justificationTypeToDelete = { id: 10,  name: "Licencia Personal" }
    mockFetch.mockResolvedValue(jsonResponse(undefined, 200)) // body vacío

    await deleteJustificationType(justificationTypeToDelete.id)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/justification-type/${justificationTypeToDelete.id}`),
      expect.objectContaining({
        method: 'DELETE'
      })
    )
  })
})
