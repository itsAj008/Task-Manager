import { useRef, useState, memo } from "react"

function StopWatch() {
    const [count , setCount] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const counterRef = useRef<number | null>(null)
    const handleStartStop = () => {
        if(counterRef.current) {
            clearInterval(counterRef.current)
            counterRef.current = null;
            setIsRunning(false);
            return;
        }
        counterRef.current = setInterval(() => {
            setCount(prev => prev + 1)
        },100)
        setIsRunning(true);
    }
    const handleReset = () => {
        setCount(0);
        if(counterRef.current){
            clearInterval(counterRef.current)
            counterRef.current = null
        }
        setIsRunning(false);
    }
  return (
    <div className="flex flex-col gap-5 justify-center items-center bg-blue-200 p-5 rounded-md w-40 ">
        <div className="text-white">{count}</div>
        <div className="flex gap-3">
            <button className={`px-3 py-1 rounded-md text-white text-sm  ${isRunning ? 'bg-red-400' : 'bg-green-400'}`} onClick={handleStartStop}>{isRunning ? 'stop' : 'start'}</button>
            <button className={`px-3 py-1 rounded-md text-white text-sm bg-gray-400`} onClick={handleReset}>reset</button>
        </div>
      
    </div>
  )
}

export default memo(StopWatch)
