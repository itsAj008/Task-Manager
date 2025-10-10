import { memo, useState, useRef, useEffect } from 'react'

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const DropdownMenu = memo(({ trigger, children, className = '' }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 theme-bg-primary theme-border border rounded-lg shadow-lg z-10 min-w-[120px]">
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  )
})

interface DropdownItemProps {
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
  variant?: 'default' | 'danger'
}

export const DropdownItem = memo(({ onClick, icon, children, variant = 'default' }: DropdownItemProps) => {
  const handleClick = () => {
    onClick()
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:theme-bg-secondary transition-colors ${
        variant === 'danger' ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'theme-text-primary'
      }`}
    >
      <span className="w-4 h-4 flex-shrink-0">{icon}</span>
      {children}
    </button>
  )
})
