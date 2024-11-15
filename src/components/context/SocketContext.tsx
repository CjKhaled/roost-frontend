import React, { createContext, useContext, useEffect } from 'react'
import { socketService } from '../../apps/auth/services/socketService'

const SocketContext = createContext(socketService)

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    socketService.connect()
    return () => {
      socketService.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={socketService}>
      {children}
    </SocketContext.Provider>
  )
}
