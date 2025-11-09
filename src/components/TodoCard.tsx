import React, { memo, useState, useEffect } from 'react'
import type { Todo, TodoStatus } from '../types'

interface TodoCardProps {
  todo: Todo
  onDragStart: (todo: Todo) => void
  onDragEnd: () => void
  onDelete: (todoId: number) => void
  onUpdate: (todoId: number, newText: string) => void
  onStatusChange: (todoId: number, status: TodoStatus) => void
}

const TodoCard = memo(({ todo, onDragStart, onDragEnd, onDelete, onUpdate, onStatusChange }: TodoCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [showActions, setShowActions] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    onDragStart(todo)
  }

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText.trim())
      setEditText(editText.trim())
    }
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setEditText(todo.text)
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    onDelete(todo.id)
  }

  const handleStatusChange = (newStatus: TodoStatus) => {
    onStatusChange(todo.id, newStatus)
    setIsDropdownOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const target = event.target as HTMLElement
        if (!target.closest('[data-dropdown-container]')) {
          setIsDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen])

  const statusOptions = [
    { value: 'new' as TodoStatus, label: 'New', color: 'bg-blue-500' },
    { value: 'in-progress' as TodoStatus, label: 'In Progress', color: 'bg-orange-500' },
    { value: 'completed' as TodoStatus, label: 'Completed', color: 'bg-green-500' }
  ]

  const getStatusIcon = () => {
    switch (todo.status) {
      case 'new':
        return (
          <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        )
      case 'in-progress':
        return (
          <div className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        )
      case 'completed':
        return (
          <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className="theme-bg-secondary hover:theme-bg-tertiary border theme-border rounded-lg p-3 cursor-move transition-colors shadow-sm hover:shadow-md"
    >
      <div className="flex items-start gap-2">
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className="w-full px-2 py-1 text-sm theme-bg-primary theme-border border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              autoFocus
              rows={2}
            />
          ) : (
            <p 
              className="text-sm theme-text-primary break-words cursor-text"
              onClick={() => setIsEditing(true)}
              title="Click to edit"
            >
              {todo.text}
            </p>
          )}
        </div>
      </div>

      {showActions && !isEditing && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t theme-border">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:theme-bg-tertiary rounded transition-colors"
              title="Edit"
            >
              <svg className="w-3 h-3 theme-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
              title="Delete"
            >
              <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="relative" data-dropdown-container>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1 text-xs theme-text-secondary hover:theme-bg-tertiary rounded transition-colors"
              title="Change Status"
            >
              <span className="capitalize">{todo.status.replace('-', ' ')}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-8 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 min-w-32">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 ${
                      todo.status === option.value ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                    }`}
                  >
                    <div className={`w-3 h-3 ${option.color} rounded-full flex items-center justify-center`}>
                      {option.value === 'completed' ? (
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="capitalize">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
})

TodoCard.displayName = 'TodoCard'

export default TodoCard
