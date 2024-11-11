import React, { useEffect, useState } from 'react'
import {io, Socket} from 'socket.io-client'
import { Outlet } from 'react-router-dom'

const SOCKET_URL = 'http://localhost:3000'

const App = (): JSX.Element => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketIo = io(SOCKET_URL)
    setSocket(socketIo)

    return () => {
      socketIo.disconnect()
    }
  }, [])

  // handle events
  useEffect(() => {
    if (socket) {
      socket.on('recieveMessage', (message) => {
        console.log('Message recieved: ', message)
      })
      socket.on('typing', (data) => {
        console.log(`${data.username} is typing...`)
      })
      socket.on('disconnect', () => {
        console.log('Disconnected from server')
      })
    }
  }, [socket])

  const sendMessage = () => {
    if (socket) {
      socket.emit('sendMessage', {
        text: 'some message',
        userId: 'SOME_USER_ID'
      })
    }
  }

  return (
    <div>
        <Outlet />
    </div>
  )
}

export default App
