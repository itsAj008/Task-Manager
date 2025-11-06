import { useState, memo } from 'react'
import { useFileSystemStore } from '../store/fileSystemStore'

interface AddTodoProps {
  fileId?: string  // Optional for backward compatibility
  onAdd?: (text: string) => void  // Optional for backward compatibility
}

const AddTodo = memo(({ fileId, onAdd }: AddTodoProps) => {
  const [input, setInput] = useState('')
  const { addTodo } = useFileSystemStore()

  const handleAdd = () => {
    if (input.trim() === '') return;
    
    if (fileId) {
      // New file-based approach
      addTodo(fileId, input.trim())
    } else if (onAdd) {
      // Legacy approach for backward compatibility
      onAdd(input)
    }
    
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className='flex gap-2 sm:gap-3'>
      <input 
        type="text" 
        className='border border-[#6C63FF] flex-1 rounded-sm px-2 sm:px-3 py-2 theme-bg-primary theme-text-primary transition-colors duration-200 text-sm sm:text-base' 
        value={input} 
        onChange={e => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter a todo..."
      />
      <button 
        className='px-3 sm:px-5 bg-[#6C63FF] hover:bg-[#5A52E0] rounded-md text-xs sm:text-sm text-white cursor-pointer transition-colors duration-200 whitespace-nowrap' 
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  )
})

export default AddTodo
