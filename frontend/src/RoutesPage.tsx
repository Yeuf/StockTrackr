import { Route, Routes, Navigate } from 'react-router-dom'

import RequireAuth from '@auth-kit/react-router/RequireAuth'

import Home from './components/Home'
import Login from './components/Login'
import PortfolioManagement from './components/PortfolioManagement'
import PortfolioDashboard from './components/PortfolioDashboard'

const RoutesPage = () => {
  return (
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
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
          <Route path={'/portfolio/:id'} element={
            <RequireAuth fallbackPath={'/login'}>
              <PortfolioDashboard/>
            </RequireAuth>
          }/>
        </Routes>
  )
}

export default RoutesPage