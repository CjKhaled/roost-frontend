import { Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

export default App
