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
        <div className="flex items-center gap-2 py-2 px-3 hover:theme-bg-secondary rounded-lg mx-1 group transition-colors duration-200">
          <button
            onClick={() => toggleFolder(folder.id)}
            className="p-1 hover:theme-bg-tertiary rounded-md transition-colors duration-200"
          >
            <svg 
              className={`w-3 h-3 transition-transform duration-200 theme-text-secondary ${folder.isExpanded ? 'rotate-90' : ''}`}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2 flex-1">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
            
            {isRenaming ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => handleKeyPress(e, handleRename)}
                className="flex-1 px-2 py-1 text-sm theme-bg-primary theme-border border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            ) : (
              <span 
                className="flex-1 text-sm theme-text-primary font-medium cursor-pointer"
                onDoubleClick={() => setIsRenaming(true)}
                title="Double-click to rename"
              >
                {folder.name}
              </span>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity duration-200">
            <DropdownMenu
              trigger={
                <button
                  className="p-1.5 hover:theme-bg-tertiary rounded-md transition-colors duration-200"
                  title="More options"
                >
                  <svg className="w-3 h-3 theme-text-secondary" fill="currentColor" viewBox="0 0 20 20">
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
          <div className="ml-6">
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
      <div className="flex items-center gap-2 py-1.5 px-3 ml-6 mr-2 hover:theme-bg-secondary rounded-md group transition-colors duration-200">
        <div className="w-4 h-4 text-gray-500 flex-shrink-0">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
        
        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyPress}
            className="flex-1 px-2 py-1 text-sm theme-bg-primary theme-border border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        ) : (
          <span 
            className="flex-1 text-sm theme-text-primary cursor-pointer hover:text-blue-500 transition-colors duration-200"
            onClick={() => openFile(file)}
            onDoubleClick={() => setIsRenaming(true)}
            title={`Open ${file.name} - Double-click to rename`}
          >
            {file.name}
          </span>
        )}
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <DropdownMenu
            trigger={
              <button
                className="p-1.5 hover:theme-bg-tertiary rounded-md transition-colors duration-200"
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

  // Auto-open sidebar when screen size exceeds 767px (but don't auto-close on mobile)
  useEffect(() => {
    const handleResize = () => {
      // Only auto-open on larger screens, never auto-close
      if (window.innerWidth > 767 && !sidebarOpen) {
        toggleSidebar()
      }
    }

    // Debounce resize events
    let timeoutId: number
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 100)
    }

    window.addEventListener('resize', debouncedResize)
    // Check initial screen size
    handleResize()

    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(timeoutId)
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
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      {sidebarOpen && (
        <div 
          ref={sidebarRef}
          className="fixed md:relative left-0 top-0 md:top-auto h-full md:h-auto w-64 sm:w-72 md:w-64 theme-bg-secondary theme-border border-r flex flex-col z-50 md:z-auto pt-12 sm:pt-14 md:pt-0 shadow-lg md:shadow-none"
        >
          {/* Header */}
          <div className="p-4 theme-border border-b bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-semibold theme-text-primary">Project Explorer</h2>
                  <p className="text-xs theme-text-secondary">Azure DevOps Style</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowNewFolderInput(true)}
                  className="p-2 hover:theme-bg-tertiary rounded-lg transition-colors duration-200"
                  title="New Folder"
                >
                  <svg className="w-4 h-4 theme-text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
                {/* Close button - only show on smaller screens */}
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:theme-bg-tertiary rounded-lg md:hidden transition-colors duration-200"
                  title="Close Sidebar"
                >
                  <svg className="w-4 h-4 theme-text-secondary" fill="currentColor" viewBox="0 0 20 20">
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
