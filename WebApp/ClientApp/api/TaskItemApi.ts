import axios from "axios"

export type TaskItem = {
  id: string
  name: string
  description: string
  completed: boolean
  owner: string
  created: Date
  modified: Date
}

const baseUrl = "/TaskItemApi"

const fixDates = (taskItem: TaskItem): TaskItem => {
  return {
    ...taskItem,
    created: new Date(taskItem.created),
    modified: new Date(taskItem.modified)
  }
}

export async function getAll(): Promise<TaskItem[]> {
  try {
    const taskItems = await axios.get<TaskItem[]>(baseUrl)
    return taskItems.data.map(item => fixDates(item))
  } catch
    (err) {
    throw err
  }
}

export async function saveTaskItem(taskItem: TaskItem): Promise<TaskItem> {
  try {
    const returnedTaskItem = await axios.post<TaskItem>(baseUrl, taskItem)
    return fixDates(returnedTaskItem.data)
  } catch (err) {
    throw err
  }
}

export async function updateTaskItem(taskItem: TaskItem): Promise<TaskItem> {
  try {
    const returnedTaskItem = await axios.put<TaskItem>(`${baseUrl}/${taskItem.id}`, taskItem)
    return fixDates(returnedTaskItem.data)
  } catch (err) {
    throw err
  }
}

export async function deleteTaskItem(itemId: string): Promise<void> {
  try {
    await axios.delete(`${baseUrl}/${itemId}`)
  } catch (err) {
    throw err
  }
}
