import './App.css'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RoutesPage from './RoutesPage'
import AuthProvider from 'react-auth-kit'
import createStore from 'react-auth-kit/createStore';
import refresh_api from './RefreshApi'
import Layout from './components/Layout'

const store = createStore<{username: string}>({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: false,
  // cookieSecure: window.location.protocol === 'https:',
  // refresh: refresh_api,
})

function App() {
  return (
    <>
      <AuthProvider store={store}>
        <Layout>
          <RoutesPage/>
        </Layout>
      </AuthProvider>
    </>
  )
}

export default App