import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Folder, TodoFile, Todo, AppState } from '../types'

interface FileSystemStore extends AppState {
  // Folder actions
  createFolder: (name: string) => void
  deleteFolder: (folderId: string) => void
  renameFolder: (folderId: string, newName: string) => void
  toggleFolder: (folderId: string) => void
  
  // File actions
  createFile: (folderId: string, name: string) => void
  deleteFile: (folderId: string, fileId: string) => void
  renameFile: (folderId: string, fileId: string, newName: string) => void
  openFile: (file: TodoFile) => void
  closeFile: (fileId: string) => void
  setActiveFile: (fileId: string) => void
  
  // Todo actions
  addTodo: (fileId: string, text: string) => void
  toggleTodo: (fileId: string, todoId: number) => void
  deleteTodo: (fileId: string, todoId: number) => void
  updateTodo: (fileId: string, todoId: number, text: string) => void
  
  // UI actions
  toggleSidebar: () => void
  
  // Helper functions
  getActiveFile: () => TodoFile | null
  getFileById: (fileId: string) => TodoFile | null
  getFolderById: (folderId: string) => Folder | null
}

export const useFileSystemStore = create<FileSystemStore>()(
  persist(
    (set, get) => ({
      // Initial state
      folders: [
        {
          id: 'default',
          name: 'My Todos',
          files: [
            {
              id: 'default-file',
              name: 'Personal Tasks',
              todos: [
                { id: 1, text: 'Learn React', completed: false },
                { id: 2, text: 'Build Todo App', completed: true },
              ],
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          ],
          isExpanded: true,
          createdAt: new Date(),
        }
      ],
      openFiles: [],
      activeFileId: null,
      sidebarOpen: true,

      // Folder actions
      createFolder: (name: string) => {
        const newFolder: Folder = {
          id: crypto.randomUUID(),
          name,
          files: [],
          isExpanded: true,
          createdAt: new Date(),
        }
        set(state => ({
          folders: [...state.folders, newFolder]
        }))
      },

      deleteFolder: (folderId: string) => {
        set(state => ({
          folders: state.folders.filter(folder => folder.id !== folderId),
          openFiles: state.openFiles.filter(file => {
            const folder = state.folders.find(f => f.id === folderId)
            return !folder?.files.some(f => f.id === file.id)
          }),
          activeFileId: state.openFiles.find(file => {
            const folder = state.folders.find(f => f.id === folderId)
            return !folder?.files.some(f => f.id === file.id)
          }) ? null : state.activeFileId
        }))
      },

      renameFolder: (folderId: string, newName: string) => {
        set(state => ({
          folders: state.folders.map(folder =>
            folder.id === folderId ? { ...folder, name: newName } : folder
          )
        }))
      },

      toggleFolder: (folderId: string) => {
        set(state => ({
          folders: state.folders.map(folder =>
            folder.id === folderId 
              ? { ...folder, isExpanded: !folder.isExpanded }
              : folder
          )
        }))
      },

      // File actions
      createFile: (folderId: string, name: string) => {
        const newFile: TodoFile = {
          id: crypto.randomUUID(),
          name,
          todos: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set(state => ({
          folders: state.folders.map(folder =>
            folder.id === folderId
              ? { ...folder, files: [...folder.files, newFile] }
              : folder
          )
        }))
      },

      deleteFile: (folderId: string, fileId: string) => {
        set(state => ({
          folders: state.folders.map(folder =>
            folder.id === folderId
              ? { ...folder, files: folder.files.filter(file => file.id !== fileId) }
              : folder
          ),
          openFiles: state.openFiles.filter(file => file.id !== fileId),
          activeFileId: state.activeFileId === fileId ? null : state.activeFileId
        }))
      },

      renameFile: (folderId: string, fileId: string, newName: string) => {
        set(state => ({
          folders: state.folders.map(folder =>
            folder.id === folderId
              ? {
                  ...folder,
                  files: folder.files.map(file =>
                    file.id === fileId ? { ...file, name: newName } : file
                  )
                }
              : folder
          ),
          openFiles: state.openFiles.map(file =>
            file.id === fileId ? { ...file, name: newName } : file
          )
        }))
      },

      openFile: (file: TodoFile) => {
        set(state => {
          const isAlreadyOpen = state.openFiles.some(f => f.id === file.id)
          return {
            openFiles: isAlreadyOpen ? state.openFiles : [...state.openFiles, file],
            activeFileId: file.id
          }
        })
      },

      closeFile: (fileId: string) => {
        set(state => {
          const newOpenFiles = state.openFiles.filter(file => file.id !== fileId)
          const newActiveFileId = state.activeFileId === fileId 
            ? (newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1].id : null)
            : state.activeFileId
          
          return {
            openFiles: newOpenFiles,
            activeFileId: newActiveFileId
          }
        })
      },

      setActiveFile: (fileId: string) => {
        set({ activeFileId: fileId })
      },

      // Todo actions
      addTodo: (fileId: string, text: string) => {
        const newTodo: Todo = {
          id: Date.now(),
          text,
          completed: false
        }
        
        set(state => ({
          folders: state.folders.map(folder => ({
            ...folder,
            files: folder.files.map(file =>
              file.id === fileId
                ? { 
                    ...file, 
                    todos: [...file.todos, newTodo],
                    updatedAt: new Date()
                  }
                : file
            )
          })),
          openFiles: state.openFiles.map(file =>
            file.id === fileId
              ? { 
                  ...file, 
                  todos: [...file.todos, newTodo],
                  updatedAt: new Date()
                }
              : file
          )
        }))
      },

      toggleTodo: (fileId: string, todoId: number) => {
        set(state => ({
          folders: state.folders.map(folder => ({
            ...folder,
            files: folder.files.map(file =>
              file.id === fileId
                ? {
                    ...file,
                    todos: file.todos.map(todo =>
                      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
                    ),
                    updatedAt: new Date()
                  }
                : file
            )
          })),
          openFiles: state.openFiles.map(file =>
            file.id === fileId
              ? {
                  ...file,
                  todos: file.todos.map(todo =>
                    todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
                  ),
                  updatedAt: new Date()
                }
              : file
          )
        }))
      },

      deleteTodo: (fileId: string, todoId: number) => {
        set(state => ({
          folders: state.folders.map(folder => ({
            ...folder,
            files: folder.files.map(file =>
              file.id === fileId
                ? {
                    ...file,
                    todos: file.todos.filter(todo => todo.id !== todoId),
                    updatedAt: new Date()
                  }
                : file
            )
          })),
          openFiles: state.openFiles.map(file =>
            file.id === fileId
              ? {
                  ...file,
                  todos: file.todos.filter(todo => todo.id !== todoId),
                  updatedAt: new Date()
                }
              : file
          )
        }))
      },

      updateTodo: (fileId: string, todoId: number, text: string) => {
        set(state => ({
          folders: state.folders.map(folder => ({
            ...folder,
            files: folder.files.map(file =>
              file.id === fileId
                ? {
                    ...file,
                    todos: file.todos.map(todo =>
                      todo.id === todoId ? { ...todo, text } : todo
                    ),
                    updatedAt: new Date()
                  }
                : file
            )
          })),
          openFiles: state.openFiles.map(file =>
            file.id === fileId
              ? {
                  ...file,
                  todos: file.todos.map(todo =>
                    todo.id === todoId ? { ...todo, text } : todo
                  ),
                  updatedAt: new Date()
                }
              : file
          )
        }))
      },

      // UI actions
      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }))
      },

      // Helper functions
      getActiveFile: () => {
        const state = get()
        return state.openFiles.find(file => file.id === state.activeFileId) || null
      },

      getFileById: (fileId: string) => {
        const state = get()
        for (const folder of state.folders) {
          const file = folder.files.find(f => f.id === fileId)
          if (file) return file
        }
        return null
      },

      getFolderById: (folderId: string) => {
        const state = get()
        return state.folders.find(folder => folder.id === folderId) || null
      }
    }),
    {
      name: 'file-system-store',
    }
  )
)
