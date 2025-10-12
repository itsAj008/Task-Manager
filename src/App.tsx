import { useEffect } from 'react'
import './App.css'
import Layout from './components/Layout'
import AuthComponent from './components/AuthComponent'
import { useAuth } from './contexts/AuthContext'
import { useFileSystemStore } from './store/fileSystemStore'

function App() {
  const { user, session, loading } = useAuth()
  const { setAuth } = useFileSystemStore()

  useEffect(() => {
    setAuth(user, session)
  }, [user, session, setAuth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center theme-bg-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C63FF] mx-auto mb-4"></div>
          <p className="theme-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthComponent />
  }

  return <Layout />
}

export default App
