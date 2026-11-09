import { JustificationModel } from '@/model/justification.model'

import { allJustifications, justificationById, saveJustification, updateJustification, deleteJustification } from '../justificationService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const jsonResponse = (body: unknown, status = 200) =>
  new Response(body ? JSON.stringify(body) : undefined, { status })

describe('justificationService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('allJustifications devuelve la lista de todas las justificaciones', async () => {

    const justifications: JustificationModel[] = [
      {
        id: 1,
        comments: 'No creo que pueda ir a la oficina hoy',
        attachment: null,
        justificationType: { id: 1, name: 'Licencia médica' }
      }
    ]
    mockFetch.mockResolvedValue(jsonResponse(justifications))

    const result = await allJustifications()

    expect(result).toEqual(justifications)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/justification'))
  })

  it('justificationById devuelve una justificación', async () => {

    const justification: JustificationModel = {
      id: 1,
      comments: 'Una disculpa por no ir hoy',
      attachment: null,
      justificationType: { id: 1, name: 'Licencia médica' }
    }
    mockFetch.mockResolvedValue(jsonResponse(justification))

    const result = await justificationById(justification.id)

    expect(result).toEqual(justification)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining(`/justification/${justification.id}`))
  })

  it('saveJustification envía un POST con la justificación en el body', async () => {
    const newJustification = { comments: 'Estare mejor al dia siguiente', attachment: null, justificationType: { id: 1 } }
    mockFetch.mockResolvedValue(jsonResponse({ id: 10, ...newJustification }, 201))

    await saveJustification(newJustification)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/justification'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newJustification)
      })
    )
  })

  it('updateJustification envía un PUT con la justificación en el body', async () => {
    const justificationToUpdate = { id: 10, comments: 'Espero mejorar pronto', attachment: null, justificationType: { id: 1 } }
    mockFetch.mockResolvedValue(jsonResponse(justificationToUpdate))

    await updateJustification(justificationToUpdate.id, justificationToUpdate)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/justification/${justificationToUpdate.id}`),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(justificationToUpdate)
      })
    )
  })

  it('deleteJustification envía un DELETE', async () => {
    const justificationToDelete = { id: 10, comments: 'Pedi descanso medico', attachment: null, justificationType: { id: 1 } }
    mockFetch.mockResolvedValue(jsonResponse(undefined, 200))

    await deleteJustification(justificationToDelete.id)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/justification/${justificationToDelete.id}`),
      expect.objectContaining({
        method: 'DELETE'
      })
    )
  })
})
