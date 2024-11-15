import { useState } from 'react'
import { Card } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Search, Send } from 'lucide-react'

// Mock data for demonstration
const mockConversations = [
  {
    id: 1,
    user: 'Sarah Wilson',
    propertyName: 'Sunny Valley Apartment',
    lastMessage: 'What time would work best for a viewing?',
    timestamp: '2:30 PM',
    unread: true
  },
  {
    id: 2,
    user: 'Michael Brown',
    propertyName: 'Downtown Loft',
    lastMessage: 'Thanks for the information about parking.',
    timestamp: 'Yesterday',
    unread: false
  },
  {
    id: 3,
    user: 'Emma Davis',
    propertyName: 'Garden View House',
    lastMessage: 'Is the property still available?',
    timestamp: '2 days ago',
    unread: false
  }
]

const mockMessages = [
  {
    id: 1,
    sender: 'Sarah Wilson',
    content: 'Hi, I\'m interested in viewing the Sunny Valley Apartment.',
    timestamp: '2:15 PM',
    isOwn: false
  },
  {
    id: 2,
    sender: 'You',
    content: 'Hello Sarah! The apartment is available for viewing. When would you like to come by?',
    timestamp: '2:20 PM',
    isOwn: true
  },
  {
    id: 3,
    sender: 'Sarah Wilson',
    content: 'What time would work best for a viewing?',
    timestamp: '2:30 PM',
    isOwn: false
  }
]

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [newMessage, setNewMessage] = useState('')

  return (
    <div className="p-6 h-[calc(100vh-2rem)]">
      <h1 className="text-2xl mb-6">Messages</h1>
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        {/* Conversations List */}
        <Card className="w-80 flex flex-col bg-white/50 backdrop-blur-sm">
          <div className="p-4 border-b border-amber-200">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-amber-500" />
              <Input
                placeholder="Search messages"
                className="pl-9 bg-transparent border-amber-200 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => { setSelectedConversation(conversation) }}
                className={`p-4 border-b border-amber-200 cursor-pointer transition-colors ${
                  selectedConversation.id === conversation.id
                    ? 'bg-amber-100'
                    : 'hover:bg-amber-50'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-amber-900">{conversation.user}</h3>
                  <span className="text-xs text-amber-700">{conversation.timestamp}</span>
                </div>
                <p className="text-sm text-amber-800 font-medium mb-1">{conversation.propertyName}</p>
                <p className="text-sm text-amber-700 truncate">{conversation.lastMessage}</p>
                {conversation.unread && (
                  <div className="mt-2 w-2 h-2 rounded-full bg-amber-500"></div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Message Thread */}
        <Card className="flex-1 flex flex-col bg-white/50 backdrop-blur-sm">
          {selectedConversation && (
            <>
              <div className="p-4 border-b border-amber-200">
                <h2 className="font-semibold text-amber-900">{selectedConversation.user}</h2>
                <p className="text-sm text-amber-700">{selectedConversation.propertyName}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.isOwn
                          ? 'bg-amber-600 text-white'
                          : 'bg-white text-amber-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.isOwn ? 'text-amber-100' : 'text-amber-500'}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-amber-200">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => { setNewMessage(e.target.value) }}
                    placeholder="Type your message..."
                    className="bg-transparent border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                  />
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Messages
