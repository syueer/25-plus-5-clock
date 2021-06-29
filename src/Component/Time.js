import React, { useRef, useState, useEffect } from 'react'

const Time = () => {
  const audio = useRef(null)
  const [displayTime, setDisplayTime] = useState(25 * 60)
  const [sessionTime, setSessionTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)

  const playBreakSound = (src) => {
    audio.current.currentTime = 0
    audio.current.play()
  }

  useEffect(() => {
    if (!isRunning) {
      return
    }
    const interval = setInterval(() => {
      setDisplayTime((prev) => {
        if (prev <= 0 && !isBreak) {
          playBreakSound()
          setIsBreak(true)
          return breakTime * 60
        } else if (prev <= 0 && isBreak) {
          playBreakSound()
          setIsBreak(false)
          return sessionTime * 60
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [isRunning, isBreak])

  const display = (value) => {
    let minutes = Math.floor(value / 60)
    let seconds = value % 60
    return (
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds)
    )
  }

  const increment = () => {
    if (breakTime < 60 && !isRunning) {
      setBreakTime((prevState) => prevState + 1)
    }
  }

  const decrement = () => {
    if (breakTime > 1 && !isRunning) {
      setBreakTime((prevState) => prevState - 1)
    }
  }

  const decrementMinutes = () => {
    if (sessionTime > 1 && !isRunning) {
      setSessionTime((prevState) => prevState - 1)
      setDisplayTime((prevState) => prevState - 60)
    }
  }

  const incrementMinutes = () => {
    if (sessionTime < 60 && !isRunning) {
      setSessionTime((prevState) => prevState + 1)
      setDisplayTime((prevState) => prevState + 60)
    }
  }

  const handleReset = () => {
    audio.current.currentTime = 0
    audio.current.pause()
    setIsRunning(false)
    setIsBreak(false)
    setBreakTime(5)
    setSessionTime(25)
    setDisplayTime(25 * 60)
  }

  const handleStartPause = () => {
    setIsRunning(!isRunning)
  }

  return (
    <div>
      {console.log(isBreak)}
      <div id='break-label'>Break Length</div>
      <button id='break-decrement' onClick={decrement}>
        Down
      </button>
      <div id='break-length'>{breakTime}</div>
      <button id='break-increment' onClick={increment}>
        Up
      </button>
      <div id='session-label'>Session Length</div>
      <button id='session-decrement' onClick={decrementMinutes}>
        Down
      </button>
      <div id='session-length'>{sessionTime} </div>
      <button id='session-increment' onClick={incrementMinutes}>
        Up
      </button>
      <h1 id='timer-label'>{isBreak ? 'Break' : 'Session'}</h1>
      <h1 id='time-left'>{display(displayTime)}</h1>
      <audio
        id='beep'
        ref={audio}
        src='https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'
        type='audio'
      />
      <button id='start_stop' onClick={handleStartPause}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button id='reset' onClick={handleReset}>
        Reset
      </button>
    </div>
  )
}

export default Time
