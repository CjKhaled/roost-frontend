import React from 'react'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './components/context/SocketContext'
import ChatComponent from './components/ui/Chat'

const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <SocketProvider>
        <Outlet />
        <ChatComponent />
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
