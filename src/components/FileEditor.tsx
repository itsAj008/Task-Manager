import { memo } from 'react'
import { useFileSystemStore } from '../store/fileSystemStore'
import KanbanBoard from './KanbanBoard'

const FileEditor = memo(() => {
  const { getActiveFile, activeFileId } = useFileSystemStore()
  const activeFile = getActiveFile()

  if (!activeFile || !activeFileId) {
    return (
      <div className="flex-1 flex items-center justify-center theme-bg-primary p-4">
        <div className="text-center theme-text-secondary max-w-sm">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          <p className="text-base sm:text-lg">No file selected</p>
          <p className="text-xs sm:text-sm">Open a file from the sidebar to start editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col theme-bg-primary overflow-hidden">
      {/* File header */}
      <div className="p-3 sm:p-4 theme-border border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-semibold truncate">
              {activeFile.name}
            </h1>
            <p className="text-xs sm:text-sm theme-text-secondary mt-1">
              {activeFile.todos.length} todos • Last updated {new Date(activeFile.updatedAt).toLocaleDateString()}
            </p>
          </div>
          
          {/* File stats */}
          <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm theme-text-secondary">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {activeFile.todos.filter(todo => (todo.status || 'new') === 'new').length} new
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              {activeFile.todos.filter(todo => todo.status === 'in-progress').length} in progress
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {activeFile.todos.filter(todo => todo.status === 'completed' || todo.completed).length} completed
            </span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard fileId={activeFileId!} />
    </div>
  )
})

export default FileEditor
