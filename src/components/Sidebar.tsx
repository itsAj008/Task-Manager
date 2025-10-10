import { memo, useState, useRef, useEffect } from 'react'
import { useFileSystemStore } from '../store/fileSystemStore'
import { DropdownMenu, DropdownItem } from './DropdownMenu'
import ConfirmDialog from './ConfirmDialog'
import type { Folder, TodoFile } from '../types'

interface FolderItemProps {
  folder: Folder
}

const FolderItem = memo(({ folder }: FolderItemProps) => {
  const { toggleFolder, createFile, deleteFolder, renameFolder } = useFileSystemStore()
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(folder.name)
  const [showNewFileInput, setShowNewFileInput] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleRename = () => {
    if (newName.trim() && newName !== folder.name) {
      renameFolder(folder.id, newName.trim())
    }
    setIsRenaming(false)
  }

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      createFile(folder.id, newFileName.trim())
      setNewFileName('')
      setShowNewFileInput(false)
    }
  }

  const handleDeleteConfirm = () => {
    deleteFolder(folder.id)
    setShowDeleteDialog(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action()
    } else if (e.key === 'Escape') {
      setIsRenaming(false)
      setShowNewFileInput(false)
      setNewName(folder.name)
      setNewFileName('')
    }
  }

  return (
    <>
      <div className="select-none">
        {/* Folder Header */}
        <div className="flex items-center gap-1 py-1 px-2 hover:theme-bg-secondary group">
          <button
            onClick={() => toggleFolder(folder.id)}
            className="p-1 hover:theme-bg-tertiary rounded"
          >
            <svg 
              className={`w-3 h-3 transition-transform ${folder.isExpanded ? 'rotate-90' : ''}`}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <svg className="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => handleKeyPress(e, handleRename)}
              className="flex-1 px-1 py-0 text-sm bg-transparent border-b border-blue-500 focus:outline-none"
              autoFocus
            />
          ) : (
            <span 
              className="flex-1 text-sm cursor-pointer"
              onDoubleClick={() => setIsRenaming(true)}
            >
              {folder.name}
            </span>
          )}
          
          {/* Action buttons */}
          <div className="opacity-0 group-hover:opacity-100 flex gap-1">
            <DropdownMenu
              trigger={
                <button
                  className="p-1 hover:theme-bg-tertiary rounded"
                  title="More options"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              }
            >
              <DropdownItem
                onClick={() => setIsRenaming(true)}
                icon={
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                }
              >
                Rename
              </DropdownItem>
              <DropdownItem
                onClick={() => setShowNewFileInput(true)}
                icon={
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                }
              >
                Add File
              </DropdownItem>
              <DropdownItem
                onClick={() => setShowDeleteDialog(true)}
                variant="danger"
                icon={
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                }
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </div>
        </div>

        {/* Files */}
        {folder.isExpanded && (
          <div className="ml-10">
            {folder.files.map((file) => (
              <FileItem key={file.id} file={file} folderId={folder.id} />
            ))}
            
            {/* New file input */}
            {showNewFileInput && (
              <div className="flex items-center gap-1 py-1 px-2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onBlur={() => setShowNewFileInput(false)}
                  onKeyDown={(e) => handleKeyPress(e, handleCreateFile)}
                  placeholder="New file name"
                  className="flex-1 px-1 py-0 text-sm bg-transparent border-b border-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Folder"
        message={`Are you sure you want to delete "${folder.name}" and all its contents? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  )
})

interface FileItemProps {
  file: TodoFile
  folderId: string
}

const FileItem = memo(({ file, folderId }: FileItemProps) => {
  const { openFile, deleteFile, renameFile } = useFileSystemStore()
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(file.name)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleRename = () => {
    if (newName.trim() && newName !== file.name) {
      renameFile(folderId, file.id, newName.trim())
    }
    setIsRenaming(false)
  }

  const handleDeleteConfirm = () => {
    deleteFile(folderId, file.id)
    setShowDeleteDialog(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      setIsRenaming(false)
      setNewName(file.name)
    }
  }

  return (
    <>
      <div className="flex items-center gap-1 py-1 px-2 hover:theme-bg-secondary group">
        <svg className="w-4 h-4 theme-text-secondary" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
        
        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyPress}
            className="flex-1 px-1 py-0 text-sm bg-transparent border-b border-blue-500 focus:outline-none"
            autoFocus
          />
        ) : (
          <span 
            className="flex-1 text-sm cursor-pointer hover:text-blue-500"
            onClick={() => openFile(file)}
            onDoubleClick={() => setIsRenaming(true)}
          >
            {file.name}
          </span>
        )}
        
        <div className="opacity-0 group-hover:opacity-100">
          <DropdownMenu
            trigger={
              <button
                className="p-1 hover:theme-bg-tertiary rounded"
                title="More options"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            }
          >
            <DropdownItem
              onClick={() => setIsRenaming(true)}
              icon={
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              }
            >
              Rename
            </DropdownItem>
            <DropdownItem
              onClick={() => setShowDeleteDialog(true)}
              variant="danger"
              icon={
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              }
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete File"
        message={`Are you sure you want to delete "${file.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  )
})

const Sidebar = memo(() => {
  const { folders, createFolder, sidebarOpen, toggleSidebar } = useFileSystemStore()
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Auto-open sidebar when screen size exceeds 767px and auto-close when below 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767 && !sidebarOpen) {
        toggleSidebar()
      } else if (window.innerWidth < 768 && sidebarOpen) {
        toggleSidebar()
      }
    }

    window.addEventListener('resize', handleResize)
    // Check initial screen size
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [sidebarOpen, toggleSidebar])

  // Close sidebar when clicking outside on mobile and tablet
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // Close on mobile and tablet screens (when sidebar is absolute or smaller)
        if (window.innerWidth <= 767) {
          toggleSidebar()
        }
      }
    }

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sidebarOpen, toggleSidebar])

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim())
      setNewFolderName('')
      setShowNewFolderInput(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateFolder()
    } else if (e.key === 'Escape') {
      setShowNewFolderInput(false)
      setNewFolderName('')
    }
  }

  if (!sidebarOpen) return null

  return (
    <>
      {/* Sidebar */}
      {sidebarOpen && (
        <div 
          ref={sidebarRef}
          className="fixed md:relative left-0 top-0 md:top-auto h-full md:h-auto w-64 theme-bg-secondary theme-border border-r flex flex-col z-50 md:z-auto pt-12 md:pt-0"
        >
          {/* Header */}
          <div className="p-3 theme-border border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold theme-text-secondary uppercase tracking-wide">
                Explorer
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowNewFolderInput(true)}
                  className="p-1 hover:theme-bg-tertiary rounded"
                  title="New Folder"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    <circle cx="15" cy="15" r="3.5" fill="#10b981"/>
                    <path d="M15 12.5v5m-2.5-2.5h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                {/* Close button - only show on smaller screens */}
                <button
                  onClick={toggleSidebar}
                  className="p-1 hover:theme-bg-tertiary rounded md:hidden"
                  title="Close Sidebar"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* File Tree */}
          <div className="flex-1 overflow-y-auto">
            {folders.map((folder) => (
              <FolderItem key={folder.id} folder={folder} />
            ))}
            
            {/* New folder input */}
            {showNewFolderInput && (
              <div className="flex items-center gap-1 py-1 px-2 mx-2 mt-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={() => setShowNewFolderInput(false)}
                  onKeyDown={handleKeyPress}
                  placeholder="Folder name"
                  className="flex-1 px-1 py-0 text-sm bg-transparent border-b border-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
})

export default Sidebar
