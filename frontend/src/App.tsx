import './App.css'
import RoutesPage from './RoutesPage'
import AuthProvider from 'react-auth-kit'
import createStore from 'react-auth-kit/createStore';
import refresh_api from './RefreshApi'

const store = createStore<{username: string}>({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: false,
  // cookieSecure: window.location.protocol === 'https:',
  refresh: refresh_api,
})

function App() {
  return (
    <>
      <AuthProvider store={store}>
        <RoutesPage/>
      </AuthProvider>
    </>
  )
}

export default App