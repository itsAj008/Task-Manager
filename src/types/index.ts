// Types for our file system
export interface Todo {
  id: number
  text: string
  completed: boolean
  file_id?: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface TodoFile {
  id: string
  name: string
  todos: Todo[]
  createdAt: Date
  updatedAt: Date
  folder_id?: string
  user_id?: string
}

export interface Folder {
  id: string
  name: string
  files: TodoFile[]
  isExpanded: boolean
  createdAt: Date
  user_id?: string
  updated_at?: string
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
  user: any | null
  session: any | null
  loading: boolean
}

// Database types (matching Supabase schema)
export interface Database {
  public: {
    Tables: {
      folders: {
        Row: {
          id: string
          user_id: string
          name: string
          is_expanded: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          is_expanded?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          is_expanded?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          folder_id: string
          user_id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          folder_id: string
          user_id: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          folder_id?: string
          user_id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      todos: {
        Row: {
          id: number
          file_id: string
          user_id: string
          text: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          file_id: string
          user_id: string
          text: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          file_id?: string
          user_id?: string
          text?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
