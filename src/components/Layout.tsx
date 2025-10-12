import { memo, useState } from 'react'
import { useFileSystemStore } from '../store/fileSystemStore'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from './Sidebar'
import TabBar from './TabBar'
import FileEditor from './FileEditor'
import ThemeToggle from './ThemeToggle'
import Avatar from './Avatar'

const Layout = memo(() => {
  const { toggleSidebar, signOut } = useFileSystemStore()
  const { user } = useAuth()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleSignOutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleConfirmSignOut = async () => {
    setShowLogoutDialog(false)
    await signOut()
  }

  const handleCancelSignOut = () => {
    setShowLogoutDialog(false)
  }

  return (
    <div className="w-full h-screen flex theme-bg-primary theme-text-primary">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 h-12 theme-bg-secondary theme-border border-b flex items-center px-4 z-10">
        {/* Menu button */}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:theme-bg-tertiary rounded transition-colors flex items-center justify-center"
          title="Toggle Sidebar"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Title */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-lg font-semibold">Todo Manager</h1>
        </div>

        {/* Theme toggle and user menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* User menu */}
          <div className="flex items-center gap-2">
            <div className="relative group mt-2">
              <Avatar user={user} size="md" className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all" />
              
              {/* Tooltip */}
              <div className="absolute right-0 top-full mt-2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'User'}
              </div>
            </div>
            
            <button
              onClick={handleSignOutClick}
              className="p-2 cursor-pointer border border-transparent hover:border-blue-500 theme-bg-tertiary rounded transition-colors flex items-center justify-center"
              title="Sign Out"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleCancelSignOut}
        >
          <div 
            className="theme-bg-secondary rounded-lg shadow-xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar user={user} size="lg" />
              <div>
                <h3 className="text-lg font-semibold theme-text-primary">
                  Sign Out
                </h3>
                <p className="text-sm theme-text-secondary">
                  {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                </p>
              </div>
            </div>
            <p className="theme-text-secondary mb-6">
              Are you sure you want to sign out?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelSignOut}
                className="px-4 py-2 text-sm theme-text-secondary hover:theme-bg-tertiary rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSignOut}
                className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

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
