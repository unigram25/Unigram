import { useState } from 'react'

import './App.css'
import Navbar from './components/Navbar'
import { Login } from '@mui/icons-material'
import Login_main from './pages/Login_main'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Login_main/>
    </>
  )
}

export default App
