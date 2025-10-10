import { memo } from 'react'
import { useFileSystemStore } from '../store/fileSystemStore'
import AddTodo from './AddTodo'
import TodoItem from './TodoItem'

const FileEditor = memo(() => {
  const { getActiveFile, activeFileId } = useFileSystemStore()
  const activeFile = getActiveFile()

  if (!activeFile || !activeFileId) {
    return (
      <div className="flex-1 flex items-center justify-center theme-bg-primary">
        <div className="text-center theme-text-secondary">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          <p className="text-lg">No file selected</p>
          <p className="text-sm">Open a file from the sidebar to start editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col theme-bg-primary overflow-hidden">
      {/* File header */}
      <div className="p-4 theme-border border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              {activeFile.name}
            </h1>
            <p className="text-sm theme-text-secondary mt-1">
              {activeFile.todos.length} todos • Last updated {new Date(activeFile.updatedAt).toLocaleDateString()}
            </p>
          </div>
          
          {/* File stats */}
          <div className="flex gap-4 text-sm theme-text-secondary">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {activeFile.todos.filter(todo => todo.completed).length} completed
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              {activeFile.todos.filter(todo => !todo.completed).length} pending
            </span>
          </div>
        </div>
      </div>

      {/* Add todo section */}
      <div className="p-4 theme-border border-b">
        <AddTodo fileId={activeFileId} />
      </div>

      {/* Todos list */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeFile.todos.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 mx-auto mb-4 theme-text-secondary opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <p className="theme-text-secondary">No todos yet</p>
            <p className="text-sm theme-text-secondary opacity-75 mt-1">Add your first todo above</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeFile.todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                fileId={activeFileId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

export default FileEditor
