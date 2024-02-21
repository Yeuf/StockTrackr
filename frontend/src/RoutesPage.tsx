import { BrowserRouter, Route, Routes } from 'react-router-dom'

import RequireAuth from '@auth-kit/react-router/RequireAuth'

import Home from './components/Home'
import Login from './components/Login'
import PortfolioManagement from './components/PortfolioManagement'

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
          <Route path={'/portfolio'} element={
            <RequireAuth fallbackPath={'/login'}>
              <PortfolioManagement/>
            </RequireAuth>
          }/>
        </Routes>
    </BrowserRouter>
  )
}

export default RoutesPage