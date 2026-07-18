'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Settings, Activity, Shield, Database, Clock, Trash2, Save } from 'lucide-react'
import KavachLogo from '@/components/shared/KavachLogo'
import { api } from '@/lib/api'
import type { Agent } from '@/types'

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState('')

  useEffect(() => {
    loadAgent()
  }, [id])

  const loadAgent = async () => {
    try {
      const data = await api.getAgent(id)
      setAgent(data)
      setConfig(JSON.stringify(data.config || {}, null, 2))
    } catch (error) {
      console.error('Failed to load agent:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!agent) return
    setSaving(true)
    try {
      await api.updateAgent(id, {
        ...agent,
        config: JSON.parse(config)
      })
      alert('Agent configuration saved successfully!')
    } catch (error) {
      console.error('Failed to save agent:', error)
      alert('Failed to save agent configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this agent?')) return
    try {
      await api.deleteAgent(id)
      router.push('/agents')
    } catch (error) {
      console.error('Failed to delete agent:', error)
      alert('Failed to delete agent')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F7CFF]"></div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Agent Not Found</h2>
          <button
            onClick={() => router.push('/agents')}
            className="px-6 py-3 bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] text-white rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            Back to Agents
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816]">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/agents')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Agents
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] bg-clip-text text-transparent">
              {agent.name}
            </h1>
            <p className="text-gray-400">Configure and monitor this AI agent</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-6 py-3 border border-red-500/50 text-red-400 rounded-lg font-semibold hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#4F7CFF]/25 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Info Card */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F7CFF] to-[#8B5CF6] flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Agent Details</h3>
                <p className="text-sm text-gray-400">Basic information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Agent ID</label>
                <p className="text-white font-mono text-sm">{agent.id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Type</label>
                <p className="text-white capitalize">{agent.type}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  agent.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {agent.status}
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Trust Score</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6]"
                      style={{ width: `${agent.trust_score}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold">{agent.trust_score}</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Created</label>
                <p className="text-white text-sm">
                  {new Date(agent.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Card */}
          <div className="glass-card p-6 rounded-2xl lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#06B6D4] flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Configuration</h3>
                <p className="text-sm text-gray-400">JSON configuration</p>
              </div>
            </div>

            <textarea
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              className="w-full h-64 bg-[#0E1424] border border-gray-700 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-[#4F7CFF] transition-colors"
              placeholder="Enter JSON configuration..."
            />
          </div>

          {/* Stats Cards */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#EF4444] flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Activity</h3>
                <p className="text-sm text-gray-400">Recent actions</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Actions</span>
                <span className="text-white font-semibold">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Blocked</span>
                <span className="text-red-400 font-semibold">45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Allowed</span>
                <span className="text-green-400 font-semibold">1,189</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Avg Risk Score</span>
                <span className="text-white font-semibold">0.23</span>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Security</h3>
                <p className="text-sm text-gray-400">Protection status</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Policies Applied</span>
                <span className="text-white font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Threats Blocked</span>
                <span className="text-red-400 font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Last Scan</span>
                <span className="text-white font-semibold">2m ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Security Level</span>
                <span className="text-green-400 font-semibold">High</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#3B82F6] flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Recent Events</h3>
                <p className="text-sm text-gray-400">Latest activity</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#0E1424] rounded-lg">
                <p className="text-white text-sm font-medium">database.query</p>
                <p className="text-gray-400 text-xs mt-1">Allowed • 2m ago</p>
              </div>
              <div className="p-3 bg-[#0E1424] rounded-lg">
                <p className="text-white text-sm font-medium">filesystem.read</p>
                <p className="text-gray-400 text-xs mt-1">Allowed • 5m ago</p>
              </div>
              <div className="p-3 bg-[#0E1424] rounded-lg">
                <p className="text-white text-sm font-medium">api.call</p>
                <p className="text-gray-400 text-xs mt-1">Blocked • 8m ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
