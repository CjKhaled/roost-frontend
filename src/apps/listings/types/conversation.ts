export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  read: boolean
}

export interface Conversation {
  id: string
  createdAt: string
  updatedAt: string
  userOneId: string
  userTwoId: string
  messages: Message[]
}
