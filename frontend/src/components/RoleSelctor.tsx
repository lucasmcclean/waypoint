import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { User, Shield, AlertCircle } from 'lucide-react'
import { checkBackendHealth } from '../services/api'

export default function RoleSelector() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => {
    let mounted = true

    checkBackendHealth().then((ok) => {
      if (!mounted) return
      setBackendStatus(ok ? 'online' : 'offline')
    })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="text-red-500" size={48} />
            <h1 className="text-4xl font-bold text-gray-900">Emergency Response System</h1>
          </div>
          <p className="text-gray-600">Select your role to access the portal</p>
          <p className="text-sm mt-2 text-gray-500">
            Backend status: {backendStatus === 'checking' ? 'Checking...' : backendStatus}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/user">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-500 cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                  <User className="text-blue-500 group-hover:text-white transition-colors" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">User Portal</h2>
                <p className="text-gray-600 mb-6">
                  Request assistance, view responder locations, and communicate with emergency responders
                </p>
                <ul className="text-sm text-left space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>View responder locations on map</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Send messages to request help</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Receive updates from responders</span>
                  </li>
                </ul>
                <div className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg group-hover:bg-blue-600 transition-colors">
                  Enter as User
                </div>
              </div>
            </div>
          </Link>

          <Link to="/responder">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-red-500 cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-500 transition-colors">
                  <Shield className="text-red-500 group-hover:text-white transition-colors" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Responder Portal</h2>
                <p className="text-gray-600 mb-6">
                  Monitor regions, broadcast messages, and query incident reports with RAG-powered search
                </p>
                <ul className="text-sm text-left space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✓</span>
                    <span>View all users and responders on map</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✓</span>
                    <span>Click regions to view reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✓</span>
                    <span>Broadcast messages to all users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✓</span>
                    <span>Query messages with RAG search</span>
                  </li>
                </ul>
                <div className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg group-hover:bg-red-600 transition-colors">
                  Enter as Responder
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-sm text-yellow-800">
            <strong>Live Backend:</strong> Roles connect to `/ws` and use `/switch`, `/message`, and `/query`.
          </p>
        </div>
      </div>
    </div>
  )
}
