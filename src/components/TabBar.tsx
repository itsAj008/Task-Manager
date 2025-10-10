import { memo } from 'react'
import { useFileSystemStore } from '../store/fileSystemStore'

const TabBar = memo(() => {
  const { openFiles, activeFileId, setActiveFile, closeFile } = useFileSystemStore()

  if (openFiles.length === 0) {
    return null
  }

  return (
    <div className="flex theme-bg-tertiary theme-border border-b overflow-x-auto">
      {openFiles.map((file) => (
        <div
          key={file.id}
          className={`flex items-center px-3 py-2 text-sm theme-border border-r cursor-pointer group min-w-0 transition-colors ${
            activeFileId === file.id
              ? 'theme-bg-primary theme-text-primary'
              : 'theme-bg-tertiary theme-text-secondary hover:theme-bg-secondary'
          }`}
          onClick={() => setActiveFile(file.id)}
        >
          {/* File icon */}
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          
          {/* File name */}
          <span className="truncate mr-2" title={file.name}>
            {file.name}
          </span>
          
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeFile(file.id)
            }}
            className="opacity-0 group-hover:opacity-100 hover:bg-gray-300 dark:hover:bg-gray-500 rounded p-1 transition-opacity"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
})

export default TabBar
