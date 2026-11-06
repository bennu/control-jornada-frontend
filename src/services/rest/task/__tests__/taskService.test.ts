import { TaskModel } from '@/model'

import { allTasks, saveTask } from '../taskService'

const mockFetch = jest.fn()
global.fetch = mockFetch

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

describe('taskService', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('allTasks devuelve la lista de tareas', async () => {
    const tasks: TaskModel[] = [
      { id: 1, title: 'Tarea 1', description: '', completed: false }
    ]
    mockFetch.mockResolvedValue(jsonResponse(tasks))

    const result = await allTasks()

    expect(result).toEqual(tasks)
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/tasks'))
  })

  it('saveTask envía un POST con la tarea en el body', async () => {
    const newTask = { title: 'Nueva', description: '', completed: false }
    mockFetch.mockResolvedValue(jsonResponse({ id: 10, ...newTask }, 201))

    await saveTask(newTask)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/tasks'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newTask)
      })
    )
  })
})
