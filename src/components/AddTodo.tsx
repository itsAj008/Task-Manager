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
    <div className='px-5 py-2 flex gap-5'>
      <input 
        type="text" 
        className='border border-[#6C63FF] w-[60vh] rounded-sm px-2 py-1 theme-bg-primary theme-text-primary transition-colors duration-200' 
        value={input} 
        onChange={e => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter a todo..."
      />
      <button 
        className='px-5 bg-[#6C63FF] hover:bg-[#5A52E0] rounded-md text-sm text-white cursor-pointer transition-colors duration-200' 
        onClick={handleAdd}
      >
        add
      </button>
    </div>
  )
})

export default AddTodo
