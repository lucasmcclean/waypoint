import { useEffect, useMemo, useState } from 'react'
import { User, MapPin } from 'lucide-react'
import { ChatPanel, type ChatMessage } from './ChatPanel'
import { MapCanvas } from './MapCanvas'
import {
  connectRealtimeSession,
  sendMessage,
  type LocationTuple,
  type SessionController,
} from '../services/api'

function getCurrentLocation(): Promise<LocationTuple | null> {
  if (!navigator.geolocation) {
    return Promise.resolve(null)
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve([position.coords.latitude, position.coords.longitude])
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    )
  })
}

export default function UserView() {
  const [clientId, setClientId] = useState('connecting...')
  const [connectionState, setConnectionState] = useState('Connecting')
  const [locations, setLocations] = useState<LocationTuple[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    let sessionController: SessionController | null = null
    let mounted = true

    async function startSession() {
      const location = await getCurrentLocation()

      try {
        sessionController = await connectRealtimeSession({
          role: 'user',
          location,
          onClientId: (id) => {
            if (!mounted) return
            setClientId(id)
            setConnectionState('Connected')
          },
          onData: (data) => {
            if (!mounted) return
            setLocations(data.locations)
          },
          onDisconnect: () => {
            if (!mounted) return
            setConnectionState('Disconnected')
          },
          onError: () => {
            if (!mounted) return
            setConnectionState('Error')
          },
        })
      } catch {
        if (!mounted) return
        setConnectionState('Error')
      }
    }

    startSession()

    return () => {
      mounted = false
      sessionController?.close()
    }
  }, [])

  const liveBadgeClass = useMemo(() => {
    if (connectionState === 'Connected') return 'bg-green-600'
    if (connectionState === 'Connecting') return 'bg-amber-500'
    return 'bg-red-600'
  }, [connectionState])

  const handleSendMessage = async (content: string) => {
    if (!clientId || clientId === 'connecting...') return

    const outgoingMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      from: clientId,
      to: 'broadcast',
      content,
      timestamp: new Date(),
      fromType: 'User',
    }

    setMessages((previous) => [...previous, outgoingMessage])

    try {
      await sendMessage(clientId, content)
    } catch {
      setMessages((previous) => [...previous, {
        id: `system-${Date.now()}`,
        from: 'system',
        to: clientId,
        content: 'Failed to deliver message to backend /message endpoint.',
        timestamp: new Date(),
        fromType: 'System',
      }])
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="text-blue-500" size={28} />
            <div>
              <h1 className="text-xl font-semibold">Emergency Response - User Portal</h1>
              <p className="text-sm text-gray-600">Client ID: {clientId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <div className={`w-2 h-2 rounded-full animate-pulse ${liveBadgeClass}`} />
            <span className="text-sm">{connectionState}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex gap-4 p-6 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-blue-500" size={20} />
            <h2 className="font-semibold">Live Locations from `/ws`</h2>
          </div>
          <div className="flex-1">
            <MapCanvas locations={locations} />
          </div>
          <div className="mt-4 text-sm text-gray-600">Active map points: {locations.length}</div>
        </div>

        <div className="w-96 flex flex-col">
          <ChatPanel
            messages={messages}
            currentUserId={clientId}
            currentUserType="User"
            onSendMessage={handleSendMessage}
          />

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Connected Backend Features</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• WebSocket handshake for `client_id`</li>
              <li>• WebSocket broadcast for `locations` and `regions`</li>
              <li>• HTTP post to `/message` when you send chat text</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
