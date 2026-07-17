'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/lib/api'
import type { Metrics, LiveMetrics, Agent, Event } from '@/types'
import KavachLogo from '@/components/shared/KavachLogo'
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const { isAuthenticated } = useAuthStore()
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics | null>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    const loadData = async () => {
      try {
        const [metricsData, liveData, agentsData, eventsData] = await Promise.all([
          api.getMetrics().catch(() => null),
          api.getLiveMetrics().catch(() => null),
          api.getAgents().catch(() => []),
          api.getEvents({ page: 1, page_size: 10 }).catch(() => ({ events: [] }))
        ])
        
        setMetrics(metricsData)
        setLiveMetrics(liveData)
        setAgents(agentsData)
        setRecentEvents(eventsData?.events || [])
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    
    // Refresh live metrics every 30 seconds
    const interval = setInterval(() => {
      api.getLiveMetrics().then(setLiveMetrics).catch(() => {})
    }, 30000)

    return () => clearInterval(interval)
  }, [isAuthenticated])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const hasData = (metrics?.total_events || 0) > 0 || agents.length > 0 || recentEvents.length > 0

  return (
    <div className="min-h-screen bg-[#050816]">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] bg-clip-text text-transparent">
            Mission Control
          </h1>
          <p className="text-gray-400">Real-time AI agent security monitoring</p>
        </div>

        {/* Runtime Security Center Callout */}
        <div className="bg-gradient-to-r from-[#4F7CFF]/15 to-[#8B5CF6]/15 backdrop-blur border border-gray-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <KavachLogo size={20} />
              Runtime Security Center
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Monitor AI agents in real time, run automated security scenario checks, analyze intent, and configure dynamic guardrails.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/runtime'}
            className="px-6 py-2.5 bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#4F7CFF]/20 shrink-0 animate-pulse"
          >
            Launch Security Center
          </button>
        </div>

        {!hasData ? (
          /* Empty State */
          <div className="glass-card p-12 rounded-2xl text-center">
            <KavachLogo size={64} className="mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-4">No Data Yet</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Get started by adding your first AI agent. Once you have agents running, 
              you'll see real-time security metrics, events, and alerts here.
            </p>
            <button
              onClick={() => window.location.href = '/agents'}
              className="px-8 py-3 bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#4F7CFF]/25"
            >
              Add Your First Agent
            </button>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Events"
                value={metrics?.total_events || 0}
                icon={Activity}
                trend={12}
                trendDirection="up"
              />
              <MetricCard
                title="Blocked Events"
                value={metrics?.blocked_events || 0}
                icon={KavachLogo}
                trend={-5}
                trendDirection="down"
                color="red"
              />
              <MetricCard
                title="Pending Approvals"
                value={liveMetrics?.pending_approvals || 0}
                icon={Clock}
                color="yellow"
              />
              <MetricCard
                title="Active Agents"
                value={liveMetrics?.active_agents || 0}
                icon={CheckCircle}
                color="green"
              />
            </div>

            {/* Risk Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="glass-card p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Risk Distribution</h2>
                <div className="space-y-4">
                  {metrics && (
                    <>
                      <RiskBar label="Low" value={metrics.risk_distribution.low} total={metrics.total_events} color="green" />
                      <RiskBar label="Medium" value={metrics.risk_distribution.medium} total={metrics.total_events} color="yellow" />
                      <RiskBar label="High" value={metrics.risk_distribution.high} total={metrics.total_events} color="orange" />
                      <RiskBar label="Critical" value={metrics.risk_distribution.critical} total={metrics.total_events} color="red" />
                    </>
                  )}
                </div>
              </div>

              <div className="glass-card p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Top Tools</h2>
                <div className="space-y-3">
                  {metrics?.top_tools.slice(0, 5).map((tool, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{tool.tool_name}</span>
                      <span className="text-sm font-semibold text-white">{tool.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            {liveMetrics?.recent_alerts && liveMetrics.recent_alerts.length > 0 && (
              <div className="glass-card p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-yellow-500" />
                  Recent Alerts
                </h2>
                <div className="space-y-3">
                  {liveMetrics.recent_alerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#0E1424]/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{alert.message}</p>
                        <p className="text-sm text-gray-400">Agent: {alert.agent_id}</p>
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Events */}
            <div className="glass-card p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Events</h2>
              <div className="space-y-3">
                {recentEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, trend, trendDirection, color }: any) {
  const colorClasses = {
    green: 'text-green-500',
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    blue: 'text-blue-500',
  }

  return (
    <div className="glass-card p-6 rounded-lg hover:glow-primary transition-all">
      <div className="flex items-center justify-between mb-4">
        <Icon className={`h-6 w-6 ${color ? colorClasses[color as keyof typeof colorClasses] : 'text-primary'}`} />
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trendDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            <TrendingUp className="h-4 w-4" />
            {trend}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold mb-2">{value.toLocaleString()}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  )
}

function RiskBar({ label, value, total, color }: any) {
  const percentage = total > 0 ? (value / total) * 100 : 0
  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  }

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value} ({percentage.toFixed(1)}%)</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color as keyof typeof colorClasses]} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function EventCard({ event }: { event: Event }) {
  const riskColors = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-orange-500',
    critical: 'text-red-500',
  }

  const getRiskLevel = (score?: number) => {
    if (!score) return 'low'
    if (score < 0.3) return 'low'
    if (score < 0.6) return 'medium'
    if (score < 0.8) return 'high'
    return 'critical'
  }

  const riskLevel = getRiskLevel(event.risk_score)

  return (
    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-medium">{event.tool_name || event.event_type}</span>
          <span className={`text-sm ${riskColors[riskLevel as keyof typeof riskColors]}`}>
            {riskLevel.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date(event.created_at).toLocaleString()}
        </p>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium">{event.status}</div>
        {event.risk_score && (
          <div className="text-sm text-muted-foreground">
            Risk: {(event.risk_score * 100).toFixed(0)}%
          </div>
        )}
      </div>
    </div>
  )
}
