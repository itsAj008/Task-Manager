import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Folder, TodoFile, AppState } from '../types'
import { DatabaseService } from '../services/database'
// import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface FileSystemStore extends AppState {
  // Auth state
  user: User | null
  session: Session | null
  loading: boolean
  
  // Auth actions
  setAuth: (user: User | null, session: Session | null) => void
  signOut: () => Promise<void>
  
  // Folder actions
  createFolder: (name: string) => Promise<void>
  deleteFolder: (folderId: string) => Promise<void>
  renameFolder: (folderId: string, newName: string) => Promise<void>
  toggleFolder: (folderId: string) => Promise<void>
  
  // File actions
  createFile: (folderId: string, name: string) => Promise<void>
  deleteFile: (folderId: string, fileId: string) => Promise<void>
  renameFile: (folderId: string, fileId: string, newName: string) => Promise<void>
  openFile: (file: TodoFile) => void
  closeFile: (fileId: string) => void
  setActiveFile: (fileId: string) => void
  
  // Todo actions
  addTodo: (fileId: string, text: string) => Promise<void>
  toggleTodo: (fileId: string, todoId: number) => Promise<void>
  deleteTodo: (fileId: string, todoId: number) => Promise<void>
  updateTodo: (fileId: string, todoId: number, text: string) => Promise<void>
  
  // UI actions
  toggleSidebar: () => void
  
  // Data loading
  loadUserData: () => Promise<void>
  setLoading: (loading: boolean) => void
  
  // Helper functions
  getActiveFile: () => TodoFile | null
  getFileById: (fileId: string) => TodoFile | null
  getFolderById: (folderId: string) => Folder | null
}

export const useFileSystemStore = create<FileSystemStore>()(
  persist(
    (set, get) => ({
      // Initial state
      folders: [],
      openFiles: [],
      activeFileId: null,
      sidebarOpen: true,
      user: null,
      session: null,
      loading: false,

      // Auth actions
      setAuth: (user: User | null, session: Session | null) => {
        console.log('setAuth called with user:', user?.email)
        set({ user, session })
        if (user) {
          // Delay loading to allow store hydration
          setTimeout(() => {
            const currentState = get()
            console.log('Before loadUserData - openFiles:', currentState.openFiles.length, 'activeFileId:', currentState.activeFileId)
            get().loadUserData()
          }, 100)
        } else {
          set({ folders: [], openFiles: [], activeFileId: null })
        }
      },

      signOut: async () => {
        try {
          await DatabaseService.signOut()
          set({ 
            user: null, 
            session: null, 
            folders: [], 
            openFiles: [], 
            activeFileId: null 
          })
        } catch (error) {
          console.error('Error signing out:', error)
        }
      },

      // Data loading
      loadUserData: async () => {
        try {
          set({ loading: true })
          const folders = await DatabaseService.getFolders()
          
          // Get current persisted state
          const currentState = get()
          const persistedOpenFiles = currentState.openFiles
          const persistedActiveFileId = currentState.activeFileId
          
          console.log('loadUserData - Found persisted state:', {
            openFiles: persistedOpenFiles.length,
            activeFileId: persistedActiveFileId,
            fileNames: persistedOpenFiles.map(f => f.name)
          })
          
          // Validate persisted open files against loaded data
          const validOpenFiles: TodoFile[] = []
          let validActiveFileId: string | null = null
          
          // Check each persisted open file to see if it still exists
          for (const openFile of persistedOpenFiles) {
            // Search through all folders to find the file
            for (const folder of folders) {
              const foundFile = folder.files.find(f => f.id === openFile.id)
              if (foundFile) {
                validOpenFiles.push(foundFile)
                
                // If this was the active file and it still exists, keep it active
                if (persistedActiveFileId === openFile.id) {
                  validActiveFileId = openFile.id
                }
                break
              }
            }
          }
          
          // If no valid active file, use the first valid open file
          if (!validActiveFileId && validOpenFiles.length > 0) {
            validActiveFileId = validOpenFiles[0].id
          }
          
          console.log('loadUserData - Setting state:', {
            validOpenFiles: validOpenFiles.length,
            validActiveFileId,
            validFileNames: validOpenFiles.map(f => f.name)
          })
          
          set({ 
            folders, 
            openFiles: validOpenFiles,
            activeFileId: validActiveFileId,
            loading: false 
          })
        } catch (error) {
          console.error('Error loading user data:', error)
          set({ loading: false })
        }
      },

      setLoading: (loading: boolean) => set({ loading }),

      // Folder actions
      createFolder: async (name: string) => {
        try {
          const newFolder = await DatabaseService.createFolder(name)
          set(state => ({
            folders: [...state.folders, newFolder]
          }))
        } catch (error) {
          console.error('Error creating folder:', error)
        }
      },

      deleteFolder: async (folderId: string) => {
        try {
          await DatabaseService.deleteFolder(folderId)
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
        } catch (error) {
          console.error('Error deleting folder:', error)
        }
      },

      renameFolder: async (folderId: string, newName: string) => {
        try {
          await DatabaseService.updateFolder(folderId, { name: newName })
          set(state => ({
            folders: state.folders.map(folder =>
              folder.id === folderId ? { ...folder, name: newName } : folder
            )
          }))
        } catch (error) {
          console.error('Error renaming folder:', error)
        }
      },

      toggleFolder: async (folderId: string) => {
        try {
          const folder = get().getFolderById(folderId)
          if (folder) {
            const newExpanded = !folder.isExpanded
            await DatabaseService.updateFolder(folderId, { is_expanded: newExpanded })
            set(state => ({
              folders: state.folders.map(folder =>
                folder.id === folderId 
                  ? { ...folder, isExpanded: newExpanded }
                  : folder
              )
            }))
          }
        } catch (error) {
          console.error('Error toggling folder:', error)
        }
      },

      // File actions
      createFile: async (folderId: string, name: string) => {
        try {
          const newFile = await DatabaseService.createFile(folderId, name)
          set(state => ({
            folders: state.folders.map(folder =>
              folder.id === folderId
                ? { ...folder, files: [...folder.files, newFile] }
                : folder
            )
          }))
        } catch (error) {
          console.error('Error creating file:', error)
        }
      },

      deleteFile: async (folderId: string, fileId: string) => {
        try {
          await DatabaseService.deleteFile(fileId)
          set(state => ({
            folders: state.folders.map(folder =>
              folder.id === folderId
                ? { ...folder, files: folder.files.filter(file => file.id !== fileId) }
                : folder
            ),
            openFiles: state.openFiles.filter(file => file.id !== fileId),
            activeFileId: state.activeFileId === fileId ? null : state.activeFileId
          }))
        } catch (error) {
          console.error('Error deleting file:', error)
        }
      },

      renameFile: async (folderId: string, fileId: string, newName: string) => {
        try {
          await DatabaseService.updateFile(fileId, { name: newName })
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
        } catch (error) {
          console.error('Error renaming file:', error)
        }
      },

      openFile: (file: TodoFile) => {
        set(state => {
          const isAlreadyOpen = state.openFiles.some(f => f.id === file.id)
          return {
            openFiles: isAlreadyOpen ? state.openFiles : [...state.openFiles, file],
            activeFileId: file.id
          }
        })
        
        // Auto-close sidebar on mobile when opening a file
        if (typeof window !== 'undefined' && window.innerWidth <= 767) {
          const state = get()
          if (state.sidebarOpen) {
            setTimeout(() => get().toggleSidebar(), 100)
          }
        }
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
      addTodo: async (fileId: string, text: string) => {
        try {
          const newTodo = await DatabaseService.createTodo(fileId, text)
          
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
        } catch (error) {
          console.error('Error adding todo:', error)
        }
      },

      toggleTodo: async (fileId: string, todoId: number) => {
        try {
          const file = get().getFileById(fileId)
          const todo = file?.todos.find(t => t.id === todoId)
          if (todo) {
            await DatabaseService.updateTodo(todoId, { completed: !todo.completed })
            
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
          }
        } catch (error) {
          console.error('Error toggling todo:', error)
        }
      },

      deleteTodo: async (fileId: string, todoId: number) => {
        try {
          await DatabaseService.deleteTodo(todoId)
          
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
        } catch (error) {
          console.error('Error deleting todo:', error)
        }
      },

      updateTodo: async (fileId: string, todoId: number, text: string) => {
        try {
          await DatabaseService.updateTodo(todoId, { text })
          
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
        } catch (error) {
          console.error('Error updating todo:', error)
        }
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
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        activeFileId: state.activeFileId,
        openFiles: state.openFiles,
      }),
      onRehydrateStorage: () => {
        console.log('Starting hydration...')
        return (state, error) => {
          if (error) {
            console.log('Hydration error:', error)
          } else {
            console.log('Hydration complete:', {
              openFiles: state?.openFiles?.length || 0,
              activeFileId: state?.activeFileId,
              fileNames: state?.openFiles?.map(f => f.name) || []
            })
          }
        }
      }
    }
  )
)
