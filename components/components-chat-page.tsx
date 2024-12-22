'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Phone, Video, Search, ArrowLeft } from 'lucide-react'

type Message = {
  id: number
  sender: 'user' | 'other'
  content: string
  timestamp: string
}

type Conversation = {
  id: number
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  messages: Message[]
}

const initialConversations: Conversation[] = [
  {
    id: 1,
    name: "Acme Corp",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Sure, I can help with that.",
    timestamp: "10:30 AM",
    unread: 2,
    messages: [
      { id: 1, sender: 'other', content: 'Hello! How can I assist you today?', timestamp: '10:00 AM' },
      { id: 2, sender: 'user', content: 'Hi, I have a question about your products.', timestamp: '10:05 AM' },
      { id: 3, sender: 'other', content: 'Of course! I\'d be happy to help. What would you like to know?', timestamp: '10:07 AM' },
      { id: 4, sender: 'user', content: 'I\'m looking for industrial pumps. Do you have any in stock?', timestamp: '10:15 AM' },
      { id: 5, sender: 'other', content: 'Yes, we have several models of industrial pumps available. Could you specify the capacity and type you\'re looking for?', timestamp: '10:20 AM' },
      { id: 6, sender: 'user', content: 'I need a centrifugal pump with a capacity of about 500 GPM.', timestamp: '10:25 AM' },
      { id: 7, sender: 'other', content: 'Sure, I can help with that. We have a few models that meet those specifications. Let me pull up the details for you.', timestamp: '10:30 AM' },
    ]
  },
  {
    id: 2,
    name: "XYZ Industries",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The shipment will arrive tomorrow.",
    timestamp: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, sender: 'other', content: 'Good morning! I wanted to update you on your recent order.', timestamp: '9:00 AM' },
      { id: 2, sender: 'user', content: 'Thanks for reaching out. What\'s the status?', timestamp: '9:15 AM' },
      { id: 3, sender: 'other', content: 'I\'m pleased to inform you that your order has been shipped.', timestamp: '9:20 AM' },
      { id: 4, sender: 'other', content: 'The shipment will arrive tomorrow.', timestamp: '9:21 AM' },
      { id: 5, sender: 'user', content: 'That\'s great news! Thank you for the update.', timestamp: '9:30 AM' },
    ]
  },
  {
    id: 3,
    name: "Global Manufacturing",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can we schedule a call next week?",
    timestamp: "2 days ago",
    unread: 1,
    messages: [
      { id: 1, sender: 'other', content: 'Hello! I hope this message finds you well.', timestamp: '2:00 PM' },
      { id: 2, sender: 'user', content: 'Hi there! How can I help you today?', timestamp: '2:15 PM' },
      { id: 3, sender: 'other', content: 'I\'d like to discuss our upcoming project in more detail.', timestamp: '2:20 PM' },
      { id: 4, sender: 'other', content: 'Can we schedule a call next week?', timestamp: '2:21 PM' },
    ]
  },
]

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && selectedConversation) {
      const newMsg: Message = {
        id: selectedConversation.messages.length + 1,
        sender: 'user',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      const updatedConversation = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMsg],
        lastMessage: newMessage,
        timestamp: newMsg.timestamp
      }
      setConversations(conversations.map(conv => 
        conv.id === selectedConversation.id ? updatedConversation : conv
      ))
      setSelectedConversation(updatedConversation)
      setNewMessage('')
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-[#003853]">
      {/* Conversation List */}
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-white/10 ${selectedConversation ? 'hidden md:block' : 'block'}`}>
        <div className="p-4">
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/10 text-white placeholder-white/50 border-white/20"
          />
        </div>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center space-x-4 p-4 hover:bg-white/5 cursor-pointer ${
                selectedConversation?.id === conversation.id ? 'bg-white/10' : ''
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <Avatar>
                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                <AvatarFallback>{conversation.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-medium text-white truncate">{conversation.name}</h3>
                  <span className="text-xs text-white/60">{conversation.timestamp}</span>
                </div>
                <p className="text-sm text-white/60 truncate">{conversation.lastMessage}</p>
              </div>
              {conversation.unread > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-[#7AB80E] rounded-full">
                  {conversation.unread}
                </span>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={`flex flex-col w-full md:w-2/3 lg:w-3/4 ${selectedConversation ? 'block' : 'hidden md:block'}`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <header className="bg-[#003853] border-b border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="h-5 w-5 text-white" />
                  </Button>
                  <Avatar>
                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                    <AvatarFallback>{selectedConversation.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedConversation.name}</h2>
                    <p className="text-sm text-white/60">Online</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5 text-white" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Messages */}
            <ScrollArea className="flex-grow p-4">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  } mb-4`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-[#7AB80E] text-white'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-50 mt-1 block">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t border-white/10 p-4">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow bg-white/10 text-white placeholder-white/50 border-white/20"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage} className="bg-[#7AB80E] hover:bg-[#8BC727] text-white">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  )
}