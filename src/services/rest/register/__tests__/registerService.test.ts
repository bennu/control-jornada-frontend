
import type { RegisterModel, RegisterRequest } from '@/model'

import {
  allRegisters,
  registerById,
  saveRegister,
  updateRegister,
  deleteRegister
} from '../registerService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

describe('registerService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('allRegisters devuelve la lista de registros', async () => {
    const registers: RegisterModel[] = [
      {
        id: 1,
        employeeId: 10,
        startOfTheDay: '08:00',
        entry: '08:05',
        exit: '17:00',
        breakTime: '13:00',
        backToWork: '14:00',
        day: '2026-11-08',
        justificationId: null,
        justification: null
      }
    ]

    mockFetch.mockResolvedValue(jsonResponse(registers))

    const result = await allRegisters()

    expect(result).toEqual(registers)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/registers')
    )
  })

  it('registerById devuelve un registro por su ID', async () => {
    const register: RegisterModel = {
      id: 1,
      employeeId: 10,
      startOfTheDay: '08:00',
      entry: '08:05',
      exit: '17:00',
      breakTime: '13:00',
      backToWork: '14:00',
      day: '2026-11-08',
      justificationId: null,
      justification: null
    }

    mockFetch.mockResolvedValue(jsonResponse(register))

    const result = await registerById(1)

    expect(result).toEqual(register)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/registers/1')
    )
  })

  it('saveRegister envía un POST con el registro en el body', async () => {
    const newRegister: RegisterRequest = {
      employeeId: 10,
      startOfTheDay: '08:00',
      entry: '08:05',
      exit: null,
      breakTime: null,
      backToWork: null,
      day: '2026-11-08',
      justificationId: null
    }

    const savedRegister: RegisterModel = {
      id: 10,
      ...newRegister,
      justification: null
    }

    mockFetch.mockResolvedValue(jsonResponse(savedRegister, 201))

    const result = await saveRegister(newRegister)

    expect(result).toEqual(savedRegister)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/registers'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          employeeId: 10,
          startOfTheDay: '08:00',
          entry: '08:05',
          exit: null,
          breakTime: null,
          backToWork: null,
          day: '2026-11-08',
          justificationId: null
        })
      })
    )
  })

  it('updateRegister envía un PUT con los datos actualizados', async () => {
    const updatedRequest: RegisterRequest = {
      employeeId: 10,
      startOfTheDay: '08:00',
      entry: '08:05',
      exit: '18:00',
      breakTime: '13:00',
      backToWork: '14:00',
      day: '2026-11-08',
      justificationId: null
    }

    const updatedRegister: RegisterModel = {
      id: 1,
      ...updatedRequest,
      justification: null
    }

    mockFetch.mockResolvedValue(jsonResponse(updatedRegister))

    const result = await updateRegister(1, updatedRequest)

    expect(result).toEqual(updatedRegister)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/registers/1'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({
          employeeId: 10,
          startOfTheDay: '08:00',
          entry: '08:05',
          exit: '18:00',
          breakTime: '13:00',
          backToWork: '14:00',
          day: '2026-11-08',
          justificationId: null
        })
      })
    )
  })

  it('deleteRegister envía un DELETE con el ID del registro', async () => {
    mockFetch.mockResolvedValue(
      new Response(null, { status: 204 })
    )

    await deleteRegister(1)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/registers/1'),
      expect.objectContaining({
        method: 'DELETE'
      })
    )
  })
})
