import React from 'react'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import ChatComponent from './components/ui/Chat'

const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <SocketProvider>
        <Outlet />
        <ChatComponent recipientId='2' conversationId='1' />
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
