import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'

import Register from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import UploadAndMap from './pages/Uploadfiles'
import ReconciliationView from './pages/ReconciliationView'
import Auditlog from './pages/AuditLog'




const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
           <Route path='/uploadfile' element={<UploadAndMap/>}/> 
          <Route path='/reconciliationview' element={<ReconciliationView/>}/>
          <Route path='/auditlog' element={<Auditlog/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App