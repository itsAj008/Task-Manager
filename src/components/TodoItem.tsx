import { memo, useState } from 'react'
import { useFileSystemStore } from '../store/fileSystemStore'
import type { Todo } from '../types'

interface TodoItemProps {
    todo: Todo
    fileId: string
}

const TodoItem = memo(({ todo, fileId }: TodoItemProps) => {
    const { toggleTodo, deleteTodo, updateTodo } = useFileSystemStore()
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(todo.text)

    const handleSave = () => {
        if (editText.trim() && editText !== todo.text) {
            updateTodo(fileId, todo.id, editText.trim())
        }
        setIsEditing(false)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave()
        } else if (e.key === 'Escape') {
            setIsEditing(false)
            setEditText(todo.text)
        }
    }

    return (
        <div className="flex items-center gap-3 p-3 theme-bg-tertiary rounded-lg theme-border border hover:opacity-80 transition-colors group max-w-2xl">
            {/* Checkbox */}
            <button
                onClick={() => toggleTodo(fileId, todo.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${todo.completed
                        ? 'bg-[#6C63FF] border-[#6C63FF] text-white'
                        : 'theme-border hover:border-[#6C63FF]'
                    }`}
            >
                {todo.completed && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
            </button>

            {/* Todo text */}
            <div className="flex-1">
                {isEditing ? (
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyPress}
                        className="w-full px-2 py-1 text-sm theme-bg-primary theme-border border border-[#6C63FF] rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-opacity-50"
                        autoFocus
                    />
                ) : (
                    <span
                        onClick={() => toggleTodo(fileId, todo.id)}
                        className={`text-sm cursor-pointer ${todo.completed
                                ? 'theme-text-secondary line-through opacity-60'
                                : 'theme-text-primary'
                            }`}
                    >
                        {todo.text}
                    </span>
                )}
            </div>

            {/* Actions */}
            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 hover:theme-bg-secondary rounded theme-text-secondary hover:theme-text-primary transition-colors"
                    title="Edit"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>

                <button
                    onClick={() => deleteTodo(fileId, todo.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="Delete"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    )
})

export default TodoItem
