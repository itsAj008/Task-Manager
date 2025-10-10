import { memo } from 'react'
import { useFileSystemStore } from '../store/fileSystemStore'
import Sidebar from './Sidebar'
import TabBar from './TabBar'
import FileEditor from './FileEditor'
import ThemeToggle from './ThemeToggle'

const Layout = memo(() => {
  const { toggleSidebar } = useFileSystemStore()

  return (
    <div className="w-full h-screen flex theme-bg-primary theme-text-primary">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 h-12 theme-bg-secondary theme-border border-b flex items-center px-4 z-10">
        {/* Menu button */}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:theme-bg-tertiary rounded transition-colors"
          title="Toggle Sidebar"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Title */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-lg font-semibold">Todo Manager</h1>
        </div>

        {/* Theme toggle */}
        <div className="relative">
          <ThemeToggle />
        </div>
      </div>

      {/* Main content */}
      <div className="flex w-full pt-12">
        {/* Sidebar */}
        <Sidebar />

        {/* Main editor area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TabBar />
          <FileEditor />
        </div>
      </div>
    </div>
  )
})

export default Layout
