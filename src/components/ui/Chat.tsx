import React, { useState, useEffect, useRef } from 'react'
import { useSocket } from '../../context/SocketContext'
import { useAuth } from '../../context/AuthContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { X } from 'lucide-react'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: string
}

interface ChatComponentProps {
  recipientId: string // ID of the user you are chatting with
  isOpen: boolean
  onClose: () => void
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  recipientId,
  isOpen,
  onClose
}) => {
  const socket = useSocket()
  const { user } = useAuth()

  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!socket || !user || !isOpen) return
    // Emit 'userOnline' when the component opens
    socket.emit('userOnline', { userId: user.id, recipientId })

    // Listen for 'conversationId' from the server
    socket.on('conversationId', (convId: string) => {
      setConversationId(convId)
      setIsLoading(false)
    })

    // Handle errors
    socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message)
      // You can set an error state here if needed
      setIsLoading(false)
    })

    return () => {
      socket.off('conversationId')
      socket.off('error')
    }
  }, [socket, user, recipientId, isOpen])

  useEffect(() => {
    if (!socket || !user || !conversationId) return

    // Fetch messages when conversationId is available
    socket.emit('getMessages', conversationId)

    socket.on('messages', (msgs: Message[]) => {
      setMessages(msgs)

      msgs.forEach((msg) => {
        if (msg.receiverId === user.id && !msg.read) {
          socket.emit('readMessage', { messageId: msg.id })
        }
      })
    })

    socket.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    socket.on('typing', (data: { username: string }) => {
      setIsTyping(true)
    })

    socket.on('stopTyping', () => {
      setIsTyping(false)
    })

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
      socket.emit('typing', { recipientId, username: user.firstName })

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping', { recipientId })
      }, 2000)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (messageInput.trim() && socket && user && conversationId) {
      const messageData = {
        senderId: user.id,
        receiverId: recipientId,
        conversationId,
        content: messageInput.trim()
      }

      socket.emit('sendMessage', messageData)

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...messageData,
          id: 'temp-id-' + Date.now(),
          read: false,
          createdAt: new Date().toISOString()
        }
      ])

      setMessageInput('')
    }
  }

  let content = (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === user?.id ? 'justify-end' : 'justify-start'
            } mb-2`}
          >
            <div
              className={`px-4 py-2 rounded-lg ${
                msg.senderId === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-sm italic text-gray-500">The user is typing...</div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          disabled={!user}
          value={messageInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          disabled={!user}
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  )
  if (isLoading) {
    content = (
      <div className="flex items-center justify-center h-64">
        <div>Loading chat...</div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Chat</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4">
              <X className="w-6 h-6" />
            </Button>
          </DialogClose>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}

export default ChatComponent
