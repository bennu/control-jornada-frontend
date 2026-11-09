import {
  allEmployees,
  employeeById,
  saveEmployee,
  updateEmployee,
  deleteEmployee
} from '../employee'

const mockFetch = jest.fn()
global.fetch = mockFetch

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

describe('employeeService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  const employee = {
    id: 1,
    code: 'EMP001',
    name: 'Pedro',
    lastName: 'Perez',
    motherLastName: 'Garcia',
    address: 'Av. Siempre Viva 123',
    email: 'pedro@example.com',
    phone: '+51987654321',
    birthDate: '1990-01-01',
    contractDate: '2020-01-01',
    contractEndDate: null,
    active: true,
    country: { id: 1, name: 'Peru', nationality: 'Peruana' },
    gender: { id: 1, name: 'Masculino' },
    maritalStatus: { id: 1, name: 'Casado' },
    contractType: { id: 1, name: 'Indefinido' },
    jobType: { id: 1, name: 'Operario' },
    branch: { id: 1, name: 'Sede Central' },
    commune: { id: 1, name: 'Lima' },
    jobScheduler: { id: 1, name: 'Turno manana' }
  }

  it('allEmployees devuelve la lista de empleados', async () => {
    mockFetch.mockResolvedValue(jsonResponse([employee]))

    const result = await allEmployees()

    expect(result).toEqual([employee])
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/employee'))
  })

  it('employeeById busca un empleado por ID', async () => {
    mockFetch.mockResolvedValue(jsonResponse(employee))

    const result = await employeeById(1)

    expect(result).toEqual(employee)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/employee/1'))
  })

  it('saveEmployee envía las relaciones como objetos { id }', async () => {
    const request = {
      code: 'EMP001',
      name: 'Pedro',
      lastName: 'Perez',
      motherLastName: 'Garcia',
      address: 'Av. Siempre Viva 123',
      email: 'pedro@example.com',
      phone: '+51987654321',
      birthDate: '1990-01-01',
      contractDate: '2020-01-01',
      contractEndDate: null,
      branch: { id: 1 },
      jobScheduler: { id: 1 },
      commune: { id: 1 },
      country: { id: 1 },
      gender: { id: 1 },
      maritalStatus: { id: 1 },
      contractType: { id: 1 },
      jobType: { id: 1 },
      active: true
    }

    mockFetch.mockResolvedValue(jsonResponse(employee))

    await saveEmployee(request)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/employee'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request)
      })
    )
  })

  it('updateEmployee envía un PUT con el ID en la URL', async () => {
    const request = {
      code: 'EMP001',
      name: 'Pedro actualizado',
      lastName: 'Perez',
      motherLastName: null,
      address: 'Av. Siempre Viva 456',
      email: null,
      phone: null,
      birthDate: null,
      contractDate: null,
      contractEndDate: null,
      branch: { id: 1 },
      jobScheduler: { id: 1 },
      commune: { id: 1 },
      country: { id: 1 },
      gender: { id: 1 },
      maritalStatus: { id: 1 },
      jobType: { id: 1 },
      active: true
    }

    mockFetch.mockResolvedValue(jsonResponse(employee))

    await updateEmployee(1, request)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/employee/1'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(request)
      })
    )
  })

  it('deleteEmployee envía un DELETE', async () => {
    mockFetch.mockResolvedValue(jsonResponse(null))

    await deleteEmployee(1)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/employee/1'),
      expect.objectContaining({
        method: 'DELETE'
      })
    )
  })
})