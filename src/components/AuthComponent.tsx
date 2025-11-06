import { supabase } from '../lib/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useTheme } from '../contexts/ThemeContext'

const AuthComponent = () => {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen flex items-center justify-center theme-bg-primary px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold theme-text-primary">
            Welcome to Task Manager
          </h2>
          <p className="mt-2 text-sm theme-text-secondary">
            Sign in to your account or create a new one
          </p>
        </div>
        
        <div className="theme-bg-secondary rounded-lg shadow-lg p-8">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#6C63FF',
                    brandAccent: '#5A52E0',
                    inputBackground: theme === 'dark' ? '#374151' : '#ffffff',
                    inputText: theme === 'dark' ? '#f9fafb' : '#111827',
                    inputBorder: theme === 'dark' ? '#4b5563' : '#d1d5db',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            providers={['google']}
            redirectTo={import.meta.env.PROD ? 'https://itsaj008.github.io/Task-Manager/' : window.location.origin}
            showLinks={true}
          />
          
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              <strong>✅ Google Sign-in Available!</strong> You can now sign in with Google or email/password. 
              GitHub OAuth can be configured following the same process.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthComponent
