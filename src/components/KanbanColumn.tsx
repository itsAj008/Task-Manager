import { memo } from 'react'
import type { ReactNode } from 'react'
import type { TodoStatus, Todo } from '../types'
import AddWorkItem from './AddWorkItem'

interface KanbanColumnProps {
  title: string
  status: TodoStatus
  color: string
  count: number
  children: ReactNode
  onDrop: (status: TodoStatus) => void
  draggedTodo: Todo | null
  fileId: string
}

const KanbanColumn = memo(({ title, status, color, count, children, onDrop, draggedTodo, fileId }: KanbanColumnProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onDrop(status)
  }

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          header: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700',
          count: 'bg-blue-500 text-white',
          border: 'border-blue-200 dark:border-blue-700'
        }
      case 'orange':
        return {
          header: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700',
          count: 'bg-orange-500 text-white',
          border: 'border-orange-200 dark:border-orange-700'
        }
      case 'green':
        return {
          header: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700',
          count: 'bg-green-500 text-white',
          border: 'border-green-200 dark:border-green-700'
        }
      default:
        return {
          header: 'theme-bg-secondary theme-border',
          count: 'bg-gray-500 text-white',
          border: 'theme-border'
        }
    }
  }

  const colorClasses = getColorClasses()
  const isDraggedOver = draggedTodo !== null

  return (
    <div 
      className={`flex-1 min-h-0 flex flex-col rounded-lg border-2 ${
        isDraggedOver ? colorClasses.border : 'theme-border'
      } transition-colors`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className={`p-3 rounded-t-lg border-b ${colorClasses.header}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold theme-text-primary">{title}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${colorClasses.count}`}>
            {count}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto theme-bg-primary">
        {children}
        {/* Add Work Item - only show in 'new' column */}
        {status === 'new' && (
          <AddWorkItem fileId={fileId} status={status} />
        )}
      </div>
    </div>
  )
})

export default KanbanColumn
