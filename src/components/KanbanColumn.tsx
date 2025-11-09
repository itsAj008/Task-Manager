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
          border: 'border-blue-200 dark:border-blue-700',
          indicator: 'bg-blue-500'
        }
      case 'orange':
        return {
          header: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700',
          count: 'bg-orange-500 text-white',
          border: 'border-orange-200 dark:border-orange-700',
          indicator: 'bg-orange-500'
        }
      case 'green':
        return {
          header: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700',
          count: 'bg-green-500 text-white',
          border: 'border-green-200 dark:border-green-700',
          indicator: 'bg-green-500'
        }
      default:
        return {
          header: 'theme-bg-secondary theme-border',
          count: 'bg-gray-500 text-white',
          border: 'theme-border',
          indicator: 'bg-gray-500'
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
      <div className={`p-4 rounded-t-lg border-b ${colorClasses.header} relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, currentColor 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}></div>
        </div>
        
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${colorClasses.indicator}`}></div>
            <div>
              <h3 className="font-semibold theme-text-primary text-sm">{title}</h3>
              <p className="text-xs theme-text-secondary mt-0.5">Work Items</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${colorClasses.count} shadow-sm`}>
              {count}
            </span>
            <button className="p-1 hover:theme-bg-tertiary rounded transition-colors duration-200" title="Column Options">
              <svg className="w-4 h-4 theme-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
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
