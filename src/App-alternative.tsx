// Alternative approach using useMemo (if you want to keep input in App component)
// You can replace your current App.tsx with this if you prefer:

import { useState, useCallback, useMemo } from 'react'
import './App.css'
import Todos from './components/Todos'
import StopWatch from './components/StopWatch'

const data = [
  {
    id: 1,
    text: 'aaaaa',
    completed: false
  },
  {
    id: 2,
    text: 'bbbbb',
    completed: false
  },
]

function App() {
  const [input, setInput] = useState('')
  const [todos, setTodos] = useState(data)

  const handleAdd = useCallback(() => {
    if (input.trim() === '') return;
    setTodos(prev => [...prev, {id: Date.now(), text: input, completed: false}])
    setInput('')
  }, [input])

  const handleChange = useCallback((id: number) => {
    setTodos(prev => {
      return prev.map(item => (
        item.id === id ? {...item, completed: true} : item
      ))
    })
  }, [])

  const handleDelete = useCallback((id: number) => {
    setTodos(prev => prev.filter(item => item.id !== id))
  }, [])

  // Memoize expensive child components to prevent re-renders when only input changes
  const memoizedTodos = useMemo(() => (
    <Todos todos={todos} handleChange={handleChange} handleDelete={handleDelete}/>
  ), [todos, handleChange, handleDelete])

  const memoizedStopWatch = useMemo(() => <StopWatch />, [])

  console.log('App component rendered')
  return (
    <div className='w-[100%] h-[100vh] flex flex-col gap-10 justify-content items-center bg-slate-100 '>
      <h1 className='text-blue-600 text-4xl'>Basic Todo</h1>
      <div className='px-5 py-2 flex gap-5'>
        <input 
          type="text" 
          className='border rounded-sm px-2 py-1' 
          value={input} 
          onChange={e => setInput(e.target.value)} 
        />
        <button 
          className='px-5 bg-blue-400 rounded-md text-sm text-white cursor-pointer' 
          onClick={handleAdd}
        >
          add
        </button>
      </div>
      {memoizedTodos}
      {memoizedStopWatch}
    </div>
  )
}

export default App
