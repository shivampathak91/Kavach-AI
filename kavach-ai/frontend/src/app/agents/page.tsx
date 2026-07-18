'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Bot, Settings, Trash2, Activity, CheckCircle, XCircle } from 'lucide-react'
import KavachLogo from '@/components/shared/KavachLogo'
import { api } from '@/lib/api'
import type { Agent } from '@/types'

export default function AgentsPage() {
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'claude',
    api_key: '',
    config: ''
  })

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      console.log('Loading agents...')
      const data = await api.getAgents()
      console.log('Loaded agents:', data)
      setAgents(data)
    } catch (error) {
      console.error('Failed to load agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDemoData = async () => {
    try {
      console.log('Starting to load demo data...')
      
      // Create demo agents
      const demoAgents = [
        {
          name: 'Claude-3 Opus',
          type: 'claude',
          api_key: 'demo-key-claude',
          config: { model: 'claude-3-opus', max_tokens: 4096 }
        },
        {
          name: 'GPT-4 Turbo',
          type: 'gpt',
          api_key: 'demo-key-gpt',
          config: { model: 'gpt-4-turbo', temperature: 0.7 }
        },
        {
          name: 'Gemini Pro',
          type: 'gemini',
          api_key: 'demo-key-gemini',
          config: { model: 'gemini-pro' }
        }
      ]

      console.log('Creating demo agents:', demoAgents)
      
      const createdAgents = []
      for (const agentData of demoAgents) {
        try {
          console.log('Creating agent:', agentData.name)
          const agent = await api.createAgent(agentData)
          console.log('Agent created successfully:', agent)
          createdAgents.push(agent)
        } catch (error) {
          console.error('Failed to create demo agent:', agentData.name, error)
        }
      }

      console.log('Created agents:', createdAgents.length)
      
      if (createdAgents.length > 0) {
        loadAgents()
        alert(`Demo agents loaded successfully! Created ${createdAgents.length} agents.`)
      } else {
        alert('Failed to create any demo agents. Check console for errors.')
      }
    } catch (error) {
      console.error('Failed to load demo data:', error)
      alert('Failed to load demo data. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.createAgent({
        name: formData.name,
        type: formData.type,
        api_key: formData.api_key,
        config: formData.config ? JSON.parse(formData.config) : undefined
      })
      setShowModal(false)
      setFormData({ name: '', type: 'claude', api_key: '', config: '' })
      loadAgents()
    } catch (error) {
      console.error('Failed to create agent:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return
    try {
      await api.deleteAgent(id)
      loadAgents()
    } catch (error) {
      console.error('Failed to delete agent:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F7CFF]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816]">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] bg-clip-text text-transparent">
              AI Agents
            </h1>
            <p className="text-gray-400">Manage your autonomous AI agents</p>
          </div>
          <div className="flex gap-3">
            {agents.length === 0 && (
              <button
                onClick={loadDemoData}
                className="flex items-center gap-2 px-6 py-3 border border-[#4F7CFF] text-[#4F7CFF] rounded-lg font-semibold hover:bg-[#4F7CFF]/10 transition-all"
              >
                <Bot className="w-5 h-5" />
                Load Demo Data
              </button>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#4F7CFF]/25"
            >
              <Plus className="w-5 h-5" />
              Add Agent
            </button>
          </div>
        </div>

        {/* Agents Grid */}
        {agents.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center">
            <Bot className="w-16 h-16 text-[#4F7CFF] mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-4">No Agents Yet</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Add your first AI agent to start monitoring and securing its actions.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#4F7CFF]/25"
            >
              Add Your First Agent
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onDelete={() => handleDelete(agent.id)}
                onConfigure={() => router.push(`/agents/${agent.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Agent Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#0E1424] border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Agent</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Agent Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#050816]/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/50 text-white placeholder-gray-500 transition-all"
                  placeholder="My Claude Agent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Agent Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-[#050816]/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/50 text-white transition-all"
                >
                  <option value="claude">Claude</option>
                  <option value="gpt">GPT</option>
                  <option value="gemini">Gemini</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={formData.api_key}
                  onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  className="w-full px-4 py-3 bg-[#050816]/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/50 text-white placeholder-gray-500 transition-all"
                  placeholder="sk-..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Configuration (JSON - optional)
                </label>
                <textarea
                  value={formData.config}
                  onChange={(e) => setFormData({ ...formData, config: e.target.value })}
                  className="w-full px-4 py-3 bg-[#050816]/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/50 text-white placeholder-gray-500 transition-all h-24 resize-none"
                  placeholder='{"model": "claude-3-opus", "max_tokens": 4096}'
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-600 text-white rounded-lg font-semibold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#4F7CFF]/25"
                >
                  Create Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function AgentCard({ agent, onDelete, onConfigure }: { agent: Agent; onDelete: () => void; onConfigure: () => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500'
      case 'inactive':
        return 'text-gray-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-yellow-500'
    }
  }

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'claude':
        return '🤖'
      case 'gpt':
        return '🧠'
      case 'gemini':
        return '✨'
      default:
        return '🔧'
    }
  }

  return (
    <div className="glass-card p-6 rounded-xl hover:border-[#4F7CFF]/50 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#4F7CFF]/10 rounded-lg flex items-center justify-center text-2xl">
            {getAgentIcon(agent.type)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
            <p className="text-sm text-gray-400 capitalize">{agent.type}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 ${getStatusColor(agent.status)}`}>
          <Activity className="w-4 h-4" />
          <span className="text-sm capitalize">{agent.status}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Trust Score</span>
          <span className="text-white font-medium">{agent.trust_score || 0}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Events</span>
          <span className="text-white font-medium">0</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onConfigure}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#4F7CFF]/10 text-[#4F7CFF] rounded-lg hover:bg-[#4F7CFF]/20 transition-all"
        >
          <Settings className="w-4 h-4" />
          Configure
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
