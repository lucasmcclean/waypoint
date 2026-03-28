import { useState, type KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

export interface ChatMessage {
  id: string
  from: string
  to: string
  content: string
  timestamp: Date
  fromType: 'User' | 'Responder' | 'System'
}

interface ChatPanelProps {
  messages: ChatMessage[]
  currentUserId: string
  currentUserType: 'User' | 'Responder'
  onSendMessage: (content: string, to?: string) => void
  showBroadcast?: boolean
}

export function ChatPanel({
  messages,
  currentUserId,
  currentUserType,
  onSendMessage,
  showBroadcast = false,
}: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState('')

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim(), showBroadcast ? 'broadcast' : undefined)
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Filter messages relevant to current user
  const relevantMessages = messages.filter((msg) => (
    msg.from === currentUserId
    || msg.to === currentUserId
    || msg.to === 'broadcast'
    || msg.fromType === 'System'
  )).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-300">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold">
          {showBroadcast ? 'Broadcast Messages' : `${currentUserType} Messages`}
        </h3>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {relevantMessages.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">No messages yet</p>
        ) : (
          relevantMessages.map(msg => {
            const isFromMe = msg.from === currentUserId;
            const isBroadcast = msg.to === "broadcast";

            return (
              <div
                key={msg.id}
                className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isBroadcast
                      ? 'bg-yellow-100 border border-yellow-300'
                      : isFromMe
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {!isFromMe && (
                    <div className="text-xs font-semibold mb-1 opacity-70">
                      {msg.fromType === 'Responder' ? '🚨 ' : msg.fromType === 'User' ? '👤 ' : 'ℹ️ '}
                      {msg.from}
                    </div>
                  )}
                  <div className="text-sm">{msg.content}</div>
                  <div className={`text-xs mt-1 ${isFromMe ? 'text-blue-100' : 'text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200">
        {showBroadcast && (
          <div className="text-xs text-orange-600 mb-2 bg-orange-50 px-2 py-1 rounded">
            ⚠️ This message will be sent to all users
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={showBroadcast ? "Type broadcast message..." : "Type a message..."}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
