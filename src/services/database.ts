import { supabase } from '../lib/supabase'
import type { Database, Folder, TodoFile, Todo, TodoStatus } from '../types'

// type FolderRow = Database['public']['Tables']['folders']['Row']
// type FileRow = Database['public']['Tables']['files']['Row']
type TodoRow = Database['public']['Tables']['todos']['Row']

export class DatabaseService {
  // Auth methods
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Folder methods
  static async getFolders(): Promise<Folder[]> {
    const { data, error } = await supabase
      .from('folders')
      .select(`
        *,
        files (
          *,
          todos (*)
        )
      `)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data.map(DatabaseService.transformFolderFromDB)
  }

  static async createFolder(name: string): Promise<Folder> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('folders')
      .insert({
        name,
        user_id: user.id,
      })
      .select(`
        *,
        files (
          *,
          todos (*)
        )
      `)
      .single()

    if (error) throw error
    return DatabaseService.transformFolderFromDB(data)
  }

  static async updateFolder(id: string, updates: { name?: string; is_expanded?: boolean }) {
    const { error } = await supabase
      .from('folders')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  }

  static async deleteFolder(id: string) {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // File methods
  static async createFile(folderId: string, name: string): Promise<TodoFile> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('files')
      .insert({
        folder_id: folderId,
        name,
        user_id: user.id,
      })
      .select(`
        *,
        todos (*)
      `)
      .single()

    if (error) throw error
    return DatabaseService.transformFileFromDB(data)
  }

  static async updateFile(id: string, updates: { name?: string }) {
    const { error } = await supabase
      .from('files')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  }

  static async deleteFile(id: string) {
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Todo methods
  static async createTodo(fileId: string, text: string): Promise<Todo> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('todos')
      .insert({
        file_id: fileId,
        text,
        user_id: user.id,
        // Note: status column doesn't exist yet, using completed field
      })
      .select()
      .single()

    if (error) throw error
    return DatabaseService.transformTodoFromDB(data)
  }

  static async updateTodo(id: number, updates: { text?: string; completed?: boolean }) {
    const { error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  }

  static async updateTodoStatus(id: number, status: string) {
    // For now, just update the completed field based on status
    // TODO: Add status column to database schema
    const completed = status === 'completed'
    const { error } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id)

    if (error) throw error
  }

  static async deleteTodo(id: number) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Transform methods
  private static transformFolderFromDB(folderData: any): Folder {
    return {
      id: folderData.id,
      name: folderData.name,
      isExpanded: folderData.is_expanded,
      createdAt: new Date(folderData.created_at),
      user_id: folderData.user_id,
      updated_at: folderData.updated_at,
      files: folderData.files?.map(DatabaseService.transformFileFromDB) || [],
    }
  }

  private static transformFileFromDB(fileData: any): TodoFile {
    return {
      id: fileData.id,
      name: fileData.name,
      createdAt: new Date(fileData.created_at),
      updatedAt: new Date(fileData.updated_at),
      folder_id: fileData.folder_id,
      user_id: fileData.user_id,
      todos: fileData.todos?.map(DatabaseService.transformTodoFromDB) || [],
    }
  }

  private static transformTodoFromDB(todoData: TodoRow): Todo {
    // Determine status based on completed field since status column doesn't exist yet
    let status: TodoStatus = 'new'
    if (todoData.completed) {
      status = 'completed'
    } else {
      status = 'new' // Default for non-completed items
    }

    return {
      id: todoData.id,
      text: todoData.text,
      completed: todoData.completed,
      file_id: todoData.file_id,
      user_id: todoData.user_id,
      created_at: todoData.created_at,
      updated_at: todoData.updated_at,
      status: status,
    }
  }
}
