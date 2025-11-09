import { memo, useState } from 'react'
import { useFileSystemStore } from '../store/fileSystemStore'
import type { TodoStatus } from '../types'

interface AddWorkItemProps {
  fileId: string
  status?: TodoStatus
  onAdd?: () => void
}

const AddWorkItem = memo(({ fileId, status = 'new', onAdd }: AddWorkItemProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [text, setText] = useState('')
  const { addTodo } = useFileSystemStore()

  const handleAdd = async () => {
    if (!text.trim()) return

    try {
      // Add the todo first
      await addTodo(fileId, text.trim())
      
      // If status is not 'new', we need to update it
      if (status !== 'new') {
        // We need to get the latest todo ID - this is a limitation of the current system
        // For now, we'll just add it as 'new' and let users drag it
      }
      
      setText('')
      setIsAdding(false)
      onAdd?.()
    } catch (error) {
      console.error('Error adding work item:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAdd()
    } else if (e.key === 'Escape') {
      setText('')
      setIsAdding(false)
    }
  }

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full p-3 border-2 border-dashed theme-border hover:border-blue-400 dark:hover:border-blue-600 rounded-lg theme-text-secondary hover:theme-text-primary transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add work item
      </button>
    )
  }

  return (
    <div className="theme-bg-secondary border theme-border rounded-lg p-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Enter work item title..."
        className="w-full px-2 py-1 text-sm theme-bg-primary theme-border border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={2}
        autoFocus
      />
      <div className="flex items-center justify-end gap-2 mt-2">
        <button
          onClick={() => {
            setText('')
            setIsAdding(false)
          }}
          className="px-3 py-1 text-xs theme-text-secondary hover:theme-text-primary rounded transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleAdd}
          disabled={!text.trim()}
          className="px-3 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  )
})

export default AddWorkItem
