import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import Auth from './Pages/auth'
import Test from './Pages/test'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/test' element={<Test />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
