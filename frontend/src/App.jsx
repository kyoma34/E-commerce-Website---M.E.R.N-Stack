import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import Auth from './Pages/auth'
import Test from './Pages/test'

import AdminLayout   from "./admin/Adminlayout";
import AdminOverview from "./admin/Adminoverview";
import AdminProducts from "./admin/Adminproducts";
import AdminUsers    from "./admin/Adminusers.jsx";
import AdminOrders   from "./admin/Adminorders";

const App = () => {
  return (
    <div>
      
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/test' element={<Test />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index         element={<AdminOverview />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users"    element={<AdminUsers />} />
          <Route path="orders"   element={<AdminOrders />} />
        </Route>
      </Routes>
      
    </div>
  )
}

export default App
