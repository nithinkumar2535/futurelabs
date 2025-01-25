import { useState } from 'react'
import './App.css'
import { Button } from "@/components/ui/button"
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './pages/admin/Test'
import BottomBanner from './pages/admin/BottomBanner'
import ForgotPassword from './pages/admin/ForgotPassword'
import MainBanner from './pages/admin/MainBanner'
import ResetPassword from './pages/admin/ResetPassword'
import Prescription from './pages/admin/Prescription'
import LessPricePackages from './pages/admin/LP&MT'
import LifeStyle from './pages/admin/LifeStyle'
import MenPackages from './pages/admin/MenPackages'
import OrganTests from './pages/admin/OrganTests'
import WomenPackages from './pages/admin/WomenPackages'
import WomenAge from './pages/admin/WomenAge'
import MenAge from './pages/admin/MenAge'
import SpecialPackages from './pages/admin/SpecilaPackage'
import SingleTests from './pages/admin/SingleTests'
import Orders from './pages/admin/Order'
import OrderDetails from './pages/admin/OrderDeatails'
import TestDetails from './pages/admin/TestDatails'
import LoggedInUsers from './pages/admin/Users'

function App() {
  return (
  <div className='flex flex-col overflow-hidden bg-white'>
    <Routes>

      <Route path='/' element = {<Login/>} />
    
      <Route path='/forgot-password' element = {<ForgotPassword/>} />

      <Route path='/reset-password' element = {<ResetPassword/>} />

      <Route path='/admin'
        element = {
          <ProtectedRoute >
            <AdminLayout/>
          </ProtectedRoute>
        }
        >
          <Route path='' element = {<Dashboard/>}/>
          <Route path='bottomBanner' element = {<BottomBanner/>}/>
          <Route path='mainBanner' element = {<MainBanner/>} />
          <Route path='prescription' element = {<Prescription/>} />
          <Route path='packages/less-price-packages' element = {<LessPricePackages/>} />
          <Route path='packages/women/age' element = {<WomenAge/>} />
          <Route path='packages/men/age' element = {<MenAge/>} />
          <Route path='packages/life-style' element = {<LifeStyle/>} />
          <Route path='packages/men' element = {<MenPackages/>} />
          <Route path='packages/organ' element = {<OrganTests/>} />
          <Route path='packages/women' element = {<WomenPackages/>} />
          <Route path='packages/special' element = {<SpecialPackages/>} />
          <Route path='packages/single' element = {<SingleTests/>} />
          <Route path='packages/single' element = {<SingleTests/>} />
          <Route path='orders' element = {<Orders/>} />
          <Route path='orders/:id' element = {<OrderDetails/>} />
          <Route path="tests/:id" element={<TestDetails/>} />
          <Route path="users" element={<LoggedInUsers/>} />


        </Route>

    </Routes>
  </div>
  )
}

export default App
