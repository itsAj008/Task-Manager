// Types for our file system
export interface Todo {
  id: number
  text: string
  completed: boolean
}

export interface TodoFile {
  id: string
  name: string
  todos: Todo[]
  createdAt: Date
  updatedAt: Date
}

export interface Folder {
  id: string
  name: string
  files: TodoFile[]
  isExpanded: boolean
  createdAt: Date
}

export interface FileSystemItem {
  type: 'folder' | 'file'
  id: string
  name: string
  parentId?: string
}

export interface AppState {
  folders: Folder[]
  openFiles: TodoFile[]
  activeFileId: string | null
  sidebarOpen: boolean
}
