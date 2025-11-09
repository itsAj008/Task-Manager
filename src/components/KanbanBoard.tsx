import { memo, useState } from 'react'
import { useFileSystemStore } from '../store/fileSystemStore'
import type { Todo, TodoStatus } from '../types'
import KanbanColumn from './KanbanColumn'
import TodoCard from './TodoCard'

interface KanbanBoardProps {
  fileId: string
}

const KanbanBoard = memo(({ fileId }: KanbanBoardProps) => {
  const { getActiveFile, updateTodoStatus, deleteTodo, updateTodo } = useFileSystemStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null)
  
  const activeFile = getActiveFile()
  
  if (!activeFile || activeFile.id !== fileId) {
    return null
  }

  // Filter todos based on search term
  const filteredTodos = activeFile.todos.filter(todo =>
    todo.text.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Group todos by status
  const todosByStatus = {
    new: filteredTodos.filter(todo => {
      // Handle legacy todos without status
      const status = todo.status || (todo.completed ? 'completed' : 'new')
      return status === 'new'
    }),
    'in-progress': filteredTodos.filter(todo => todo.status === 'in-progress'),
    completed: filteredTodos.filter(todo => {
      // Handle both new status field and legacy completed field
      return todo.status === 'completed' || (todo.completed && !todo.status)
    })
  }

  const handleDragStart = (todo: Todo) => {
    setDraggedTodo(todo)
  }

  const handleDragEnd = () => {
    setDraggedTodo(null)
  }

  const handleDrop = (status: TodoStatus) => {
    if (draggedTodo && draggedTodo.status !== status) {
      updateTodoStatus(fileId, draggedTodo.id, status)
    }
    setDraggedTodo(null)
  }

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(fileId, todoId)
  }

  const handleUpdateTodo = (todoId: number, newText: string) => {
    updateTodo(fileId, todoId, newText)
  }

  const columns = [
    { 
      id: 'new' as TodoStatus, 
      title: 'New', 
      color: 'blue',
      count: todosByStatus.new.length 
    },
    { 
      id: 'in-progress' as TodoStatus, 
      title: 'In Progress', 
      color: 'orange',
      count: todosByStatus['in-progress'].length 
    },
    { 
      id: 'completed' as TodoStatus, 
      title: 'Completed', 
      color: 'green',
      count: todosByStatus.completed.length 
    }
  ]

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 theme-border border-b">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 theme-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search work items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 theme-bg-tertiary theme-border border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="text-sm theme-text-secondary">
            {filteredTodos.length} item{filteredTodos.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-4 p-4 overflow-auto">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            status={column.id}
            color={column.color}
            count={column.count}
            onDrop={handleDrop}
            draggedTodo={draggedTodo}
            fileId={fileId}
          >
            {todosByStatus[column.id].map(todo => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDelete={handleDeleteTodo}
                onUpdate={handleUpdateTodo}
              />
            ))}
          </KanbanColumn>
        ))}
      </div>
    </div>
  )
})

export default KanbanBoard
