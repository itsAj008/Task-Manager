import { memo } from "react"

interface todoType {
    id: number,
    text: string,
    completed: boolean
}

interface todosProps {
    todos: todoType[],
    handleChange: (id: number) => void,
    handleDelete: (id: number) => void,
}


interface todoProps {
    todo: todoType,
    handleChange: (id: number) => void,
    handleDelete: (id: number) => void,
}

const TodoItems = memo(({ todo, handleChange, handleDelete }: todoProps) => {
    return (
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm transition-colors duration-200">
            <div className="flex items-center gap-3">
                <input 
                    type="checkbox" 
                    checked={todo.completed} 
                    onChange={() => handleChange(todo.id)} 
                    className="w-4 h-4 text-[#6C63FF] bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-[#6C63FF] dark:focus:ring-[#6C63FF] focus:ring-2"
                />
                <span className={`text-gray-900 dark:text-white ${todo.completed ? 'line-through opacity-60' : ''}`}>
                    {todo.text}
                </span>
            </div>
            <button 
                className="bg-red-500 hover:bg-red-600 px-3 py-1 text-sm text-white rounded-md cursor-pointer transition-colors duration-200" 
                onClick={() => handleDelete(todo.id)}
            >
                delete
            </button>
        </div>
    )
})

console.log('todos page')

function Todos({ todos, handleChange, handleDelete }: todosProps) {
    return (
        <div className="bg-gray-50 dark:bg-gray-800 w-96 p-4 flex flex-col gap-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Your Todos</h2>
            {todos.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No todos yet. Add one above!</p>
            ) : (
                todos.map((todo) => (
                    <TodoItems key={todo.id} todo={todo} handleChange={handleChange} handleDelete={handleDelete} />
                ))
            )}
        </div>
    )
}

export default memo(Todos)
