import React from 'react'
import { useSocket } from '../context/SocketContext'

const ChatComponent = () => {
  const socket = useSocket()

  const sendMessage = () => {
    socket.emit('sendMessage', {
      text: 'some message',
      userId: 'SOME_USER_ID'
    })
  }

  React.useEffect(() => {
    socket.on('recieveMessage', (message: string) => {
      console.log('Message received: ', message)
    })
    socket.on('typing', (data: any) => {
      console.log(`${data.username} is typing...`)
    })

    return () => {
      socket.off('recieveMessage')
      socket.off('typing')
    }
  }, [socket])

  return (
    <div>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  )
}

export default ChatComponent