import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import Auth from './Pages/auth'
import Test from './Pages/test'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/test' element={<Test />} />
      </Routes>
    </div>
  )
}

export default App
