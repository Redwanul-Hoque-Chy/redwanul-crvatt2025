import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AttendanceDownloader from './download.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AttendanceDownloader />
    </>
  )
}

export default App
