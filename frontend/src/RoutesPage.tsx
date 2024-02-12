import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import RequireAuth from '@auth-kit/react-router/RequireAuth'

import Home from './components/Home'
import Login from './components/Login'

const RoutesPage = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<Login/>}/>
          <Route path={'/login' } element={<Login/>}/>
          <Route path={'/home'} element={
            <RequireAuth fallbackPath={'/login'}>
              <Home/>
            </RequireAuth>
          }/>
        </Routes>
    </BrowserRouter>
  )
}

export default RoutesPage