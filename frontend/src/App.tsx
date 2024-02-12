import './App.css'
import RoutesPage from './RoutesPage'
import AuthProvider from 'react-auth-kit'
import createStore from 'react-auth-kit/createStore';

const store = createStore<{username: string}>({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: false,
  // cookieSecure: window.location.protocol === 'https:',
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