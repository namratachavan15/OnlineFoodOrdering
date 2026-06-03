import React from 'react'
import { Routes,Route } from 'react-router-dom';
import AdminRoute from './AdminRoute';
import CustomerRouter from './CustomerRouter';
import Navbar from '../Navbar/Navbar';
const Routers = () => {
  return (
   <div>
    <Navbar/>
      <Routes>
      <Route path='/admin/restaurant/*' element={<AdminRoute/>}></Route>
      <Route path='/*' element={<CustomerRouter/>}></Route>
    </Routes>
    </div>
  )
}

export default Routers
