import React from 'react'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'

const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <SocketProvider>
        <Outlet />
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
