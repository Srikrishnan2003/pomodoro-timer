'use client';

import { useState, useEffect } from 'react';

const WORK_DURATION = 0.5 * 60;
const BREAK_DURATION = 0.3 * 60;

export default function Home() {
  const [secondsLeft, setSecondsLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const totalDuration = isWorkSession ? WORK_DURATION : BREAK_DURATION;
  const progressPercent = ((totalDuration - secondsLeft) / totalDuration) * 100;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs/60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  useEffect(() => {
    if(!isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if(prev === 0) {
          const nextIsWork = !isWorkSession;
          setIsWorkSession(nextIsWork);
          return nextIsWork ? WORK_DURATION : BREAK_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, isWorkSession]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(isWorkSession ? WORK_DURATION : BREAK_DURATION);
  };

  return(
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white"> 
      <h1 className='text-4xl font-bold mb-4'>Pomodoro Timer</h1>

      <div className='text-center mb-8'>
        <p className='text-lg text-gray-400'>Current Session:</p>
        <p className={`text-2xl font-semibold ${isWorkSession ? 'text-green-400' : 'text-blue-400'}`}>
          { isWorkSession ? 'Work' : 'Break' }
        </p>
      </div>

      <div className='w-80 h-4 bg-gray-700 rounded mb-4 overflow-hidden'>
        <div 
          className={`h-full ${isWorkSession ? 'bg-green-500' : 'bg-blue-500'} transition-all duration-1000 ease-linear`}
          style={{ width: `${progressPercent}%` }}  
        />
      </div>

      <div className='text-6xl font-mono mb-8'>{formatTime(secondsLeft)}</div>

      <div className='flex space-x-4'>
        <button onClick={handleStart} className='bg-green-500 px-4 py-2 rounded hover:bg-green-600'>
          Start
        </button>
        <button onClick={handlePause} className='bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600'>
          Pause
        </button>
        <button onClick={handleReset} className='bg-red-500 px-4 py-2 rounded hover:bg-red-600'>
          Reset
        </button>
      </div>
    </main>
  );
}