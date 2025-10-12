import { useState } from 'react'
import type { User } from '@supabase/supabase-js'

interface AvatarProps {
  user: User | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Avatar = ({ user, size = 'md', className = '' }: AvatarProps) => {
  const [imageError, setImageError] = useState(false)

  // Size classes
  const sizeClasses = {
    sm: 'w-5 h-5 text-xs',
    md: 'w-7 h-7 text-xs',
    lg: 'w-8 h-8 text-sm'
  }

  // Get user's profile image URL
  const getAvatarUrl = () => {
    if (!user) return null
    
    // Check for avatar_url in user metadata
    if (user.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url
    }
    
    // Check for picture in user metadata (Google OAuth)
    if (user.user_metadata?.picture) {
      return user.user_metadata.picture
    }
    
    // Check for avatar_url in app metadata
    if (user.app_metadata?.avatar_url) {
      return user.app_metadata.avatar_url
    }
    
    return null
  }

  // Get user's initials for fallback
  const getInitials = () => {
    if (!user) return 'U'
    
    // Try to get name from user metadata
    if (user.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ')
      return names.map((name: string) => name.charAt(0).toUpperCase()).join('').slice(0, 2)
    }
    
    // Try to get name from user metadata (different providers use different keys)
    if (user.user_metadata?.name) {
      const names = user.user_metadata.name.split(' ')
      return names.map((name: string) => name.charAt(0).toUpperCase()).join('').slice(0, 2)
    }
    
    // Fall back to email
    if (user.email) {
      const username = user.email.split('@')[0]
      return username.charAt(0).toUpperCase() + (username.charAt(1) || '').toUpperCase()
    }
    
    return 'U'
  }

  const avatarUrl = getAvatarUrl()
  const initials = getInitials()
  
  // Generate a consistent background color based on user email
  const getBackgroundColor = () => {
    if (!user?.email) return 'bg-gray-500'
    
    const colors = [
      'bg-red-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ]
    
    // Simple hash function to get consistent color
    let hash = 0
    for (let i = 0; i < user.email.length; i++) {
      hash = user.email.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative inline-flex items-center justify-center rounded-full overflow-hidden`}>
      {avatarUrl && !imageError ? (
        <img
          src={avatarUrl}
          alt={user?.user_metadata?.full_name || user?.user_metadata?.name || 'User avatar'}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center text-white font-medium ${getBackgroundColor()}`}>
          {initials}
        </div>
      )}
    </div>
  )
}

export default Avatar
