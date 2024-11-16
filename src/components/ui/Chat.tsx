import React, { useState, useEffect, useRef } from 'react'
import { useSocket } from '../../context/SocketContext' // Adjust the import path as needed
import { useAuth } from '../../context/AuthContext'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: string
}

interface ChatComponentProps {
  conversationId: string
  recipientId: string // ID of the user you are chatting with
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  conversationId,
  recipientId
}) => {
  const socket = useSocket()
  const { user } = useAuth()

  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!socket || !user) return

    // Emit 'userOnline' event to join the user's own room
    console.log('user.id', user.id)
    socket.emit('userOnline', user.id)

    // Request existing messages
    socket.emit('getMessages', conversationId)

    // Listen for incoming messages
    socket.on('messages', (msgs: Message[]) => {
      setMessages(msgs)

      // Mark unread messages as read
      msgs.forEach((msg) => {
        if (msg.receiverId === user.id && !msg.read) {
          socket.emit('readMessage', { messageId: msg.id })
        }
      })
    })

    // Listen for new messages
    socket.on('receiveMessage', (message: Message) => {
      console.log('receiveMessage', message)
      setMessages((prevMessages) => [...prevMessages, message])
    })

    // Listen for typing indicators
    socket.on('typing', (data: { username: string }) => {
      setIsTyping(true)
    })

    socket.on('stopTyping', () => {
      setIsTyping(false)
    })

    // Cleanup on unmount
    return () => {
      socket.off('messages')
      socket.off('receiveMessage')
      socket.off('typing')
      socket.off('stopTyping')
    }
  }, [socket, user, conversationId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value)

    if (socket && user) {
      // Emit 'typing' event
      console.log('recipientId', recipientId)
      socket.emit('typing', { recipientId, username: user.firstName })

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set timeout to emit 'stopTyping' after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping', { recipientId })
      }, 2000)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (messageInput.trim() && socket && user) {
      const messageData = {
        senderId: user.id,
        receiverId: recipientId,
        conversationId,
        content: messageInput.trim()
      }

      // Emit 'sendMessage' event
      socket.emit('sendMessage', messageData)

      // Optionally, add the message to your local state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...messageData,
          id: 'temp-id',
          read: false,
          createdAt: new Date().toISOString()
        }
      ])

      setMessageInput('')
    }
  }

  return (
    <div
      className='chat-container'
      style={{ border: '1px solid #ccc', padding: '10px' }}
    >
      <div
        className='messages'
        style={{ maxHeight: '300px', overflowY: 'auto' }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.senderId === user?.id ? 'right' : 'left',
              margin: '5px 0'
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '8px',
                borderRadius: '10px',
                backgroundColor: msg.senderId === user?.id ? '#DCF8C6' : '#FFF'
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {isTyping && (
          <div style={{ fontStyle: 'italic', margin: '5px 0' }}>
            The user is typing...
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', marginTop: '10px' }}
      >
        <input
          type='text'
          disabled={!user}
          value={messageInput}
          onChange={handleInputChange}
          placeholder='Type your message...'
          style={{ flex: 1, padding: '8px' }}
        />
        <button disabled={!user} type='submit' style={{ padding: '8px' }}>
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatComponent
