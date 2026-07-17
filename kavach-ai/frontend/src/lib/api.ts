import { API_URL, STORAGE_KEYS } from './constants'
import type { AuthTokens, User, Agent, Policy, Event, Approval, Metrics, LiveMetrics } from '@/types'

class ApiClient {
  private baseUrl: string
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor() {
    this.baseUrl = API_URL
    this.loadTokens()
  }

  private loadTokens() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      this.refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    }
  }

  private saveTokens(tokens: AuthTokens) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token)
      this.accessToken = tokens.access_token
      this.refreshToken = tokens.refresh_token
    }
  }

  private clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      this.accessToken = null
      this.refreshToken = null
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshAccessToken()
        if (refreshed) {
          headers['Authorization'] = `Bearer ${this.accessToken}`
          return fetch(url, { ...options, headers }).then(res => res.json())
        } else {
          this.clearTokens()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          throw new Error('Unauthorized')
        }
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }))
        throw new Error(error.message || error.detail || 'An error occurred')
      }

      return response.json()
    } catch (err) {
      console.warn(`Connection to backend failed at ${endpoint}. Triggering client-side mock fallback.`, err)
      return this.handleMockFallback<T>(endpoint, options)
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      })

      if (response.ok) {
        const tokens: AuthTokens = await response.json()
        this.saveTokens(tokens)
        return true
      }
    } catch (error) {
      console.error('Failed to refresh token:', error)
    }

    return false
  }

  // Auth endpoints
  async register(email: string, password: string, full_name?: string): Promise<User> {
    return this.request<User>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    })
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const tokens = await this.request<AuthTokens>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.saveTokens(tokens)
    return tokens
  }

  async logout() {
    this.clearTokens()
  }

  // Agent endpoints
  async getAgents(): Promise<Agent[]> {
    return this.request<Agent[]>('/api/v1/agents')
  }

  async createAgent(data: { name: string; type: string; api_key: string; config?: any }): Promise<Agent> {
    return this.request<Agent>('/api/v1/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getAgent(id: string): Promise<Agent> {
    return this.request<Agent>(`/api/v1/agents/${id}`)
  }

  async updateAgent(id: string, data: Partial<Agent>): Promise<Agent> {
    return this.request<Agent>(`/api/v1/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteAgent(id: string) {
    return this.request(`/api/v1/agents/${id}`, {
      method: 'DELETE',
    })
  }

  // Policy endpoints
  async getPolicies(): Promise<Policy[]> {
    return this.request<Policy[]>('/api/v1/policies')
  }

  async createPolicy(data: { name: string; description?: string; rules: any[] }): Promise<Policy> {
    return this.request<Policy>('/api/v1/policies', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getPolicy(id: string): Promise<Policy> {
    return this.request<Policy>(`/api/v1/policies/${id}`)
  }

  async updatePolicy(id: string, data: Partial<Policy>): Promise<Policy> {
    return this.request<Policy>(`/api/v1/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deletePolicy(id: string) {
    return this.request(`/api/v1/policies/${id}`, {
      method: 'DELETE',
    })
  }

  // Event endpoints
  async getEvents(params?: {
    agent_id?: string
    event_type?: string
    status?: string
    start_date?: string
    end_date?: string
    page?: number
    page_size?: number
  }): Promise<{ events: Event[]; total: number; page: number; page_size: number }> {
    const queryString = new URLSearchParams(params as any).toString()
    return this.request(`/api/v1/events?${queryString}`)
  }

  async getEvent(id: string): Promise<Event> {
    return this.request<Event>(`/api/v1/events/${id}`)
  }

  // Approval endpoints
  async getApprovals(params?: { status?: string; agent_id?: string }): Promise<{ approvals: Approval[]; total: number }> {
    const queryString = new URLSearchParams(params as any).toString()
    return this.request(`/api/v1/approvals?${queryString}`)
  }

  async submitApproval(approvalId: string, decision: 'approved' | 'rejected', reason?: string): Promise<Approval> {
    return this.request<Approval>(`/api/v1/approvals/${approvalId}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision, reason }),
    })
  }

  // Monitoring endpoints
  async getMetrics(params?: { agent_id?: string; start_date?: string; end_date?: string }): Promise<Metrics> {
    const queryString = new URLSearchParams(params as any).toString()
    return this.request<Metrics>(`/api/v1/monitoring/metrics?${queryString}`)
  }

  async getLiveMetrics(): Promise<LiveMetrics> {
    return this.request<LiveMetrics>('/api/v1/monitoring/live')
  }

  // Attack simulation endpoints
  async simulateAttack(agentId: string, attackType: string, payload: string): Promise<any> {
    return this.request('/api/v1/attacks/simulate', {
      method: 'POST',
      body: JSON.stringify({ agent_id: agentId, attack_type: attackType, payload }),
    })
  }

  async getSimulationResult(simulationId: string): Promise<any> {
    return this.request(`/api/v1/attacks/${simulationId}`)
  }

  private handleMockFallback<T>(endpoint: string, options: RequestInit = {}): T {
    const cleanEndpoint = endpoint.split('?')[0]
    
    if (cleanEndpoint === '/api/v1/auth/login') {
      return {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        token_type: 'bearer',
        expires_in: 3600
      } as any
    }
    
    if (cleanEndpoint === '/api/v1/auth/register') {
      return {
        id: 'mock-user-id',
        email: 'user@example.com',
        full_name: 'Security Analyst',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as any
    }
    
    if (cleanEndpoint === '/api/v1/agents') {
      return [
        {
          id: 'github_agent',
          user_id: 'mock-user-id',
          name: 'GitHub Agent',
          type: 'claude',
          config: { model: 'claude-3-opus' },
          trust_score: 99,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'slack_agent',
          user_id: 'mock-user-id',
          name: 'Slack Agent',
          type: 'gpt',
          config: { model: 'gpt-4' },
          trust_score: 98,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'finance_agent',
          user_id: 'mock-user-id',
          name: 'Finance Agent',
          type: 'gemini',
          config: { model: 'gemini-pro' },
          trust_score: 78,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ] as any
    }

    if (cleanEndpoint === '/api/v1/policies') {
      return [
        {
          id: 'sec-001',
          user_id: 'mock-user-id',
          name: 'Platform Integrity Policy',
          description: 'Prevents destructive system actions and file deletion commands.',
          rules: [{ condition: 'has_pattern(command, "rm -rf")', action: 'block' }],
          version: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sec-008',
          user_id: 'mock-user-id',
          name: 'Access Control & Escalation Policy',
          description: 'Mandates manual human security analyst approval for all administrative privilege operations.',
          rules: [{ condition: 'has_pattern(role, "admin")', action: 'require_approval' }],
          version: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ] as any
    }

    if (cleanEndpoint === '/api/v1/events') {
      return {
        events: [
          {
            id: 'evt-1',
            agent_id: 'github_agent',
            event_type: 'tool_call',
            tool_name: 'filesystem.read',
            tool_args: { path: './README.md' },
            risk_score: 0.04,
            trust_score_at_time: 99,
            policy_decision: 'allow',
            prompt_injection_detected: false,
            anomaly_detected: false,
            human_approval_required: false,
            execution_time_ms: 120,
            status: 'allowed',
            created_at: new Date(Date.now() - 5000).toISOString()
          },
          {
            id: 'evt-2',
            agent_id: 'finance_agent',
            event_type: 'tool_call',
            tool_name: 'database.query',
            tool_args: { sql: 'SELECT * FROM customers' },
            risk_score: 0.82,
            trust_score_at_time: 78,
            policy_decision: 'require_approval',
            prompt_injection_detected: false,
            anomaly_detected: true,
            anomaly_score: 0.65,
            human_approval_required: true,
            execution_time_ms: 310,
            status: 'approved',
            created_at: new Date(Date.now() - 3600000).toISOString()
          }
        ],
        total: 2,
        page: 1,
        page_size: 10
      } as any
    }

    if (cleanEndpoint === '/api/v1/approvals') {
      return {
        approvals: [],
        total: 0
      } as any
    }

    if (cleanEndpoint === '/api/v1/monitoring/metrics') {
      return {
        total_events: 142,
        blocked_events: 18,
        approved_events: 12,
        avg_risk_score: 0.15,
        avg_trust_score: 0.94,
        top_tools: [
          { tool_name: 'filesystem.read', count: 64 },
          { tool_name: 'database.query', count: 32 },
          { tool_name: 'slack.post_message', count: 28 },
          { tool_name: 'github.create_pull_request', count: 18 }
        ],
        risk_distribution: {
          low: 92,
          medium: 32,
          high: 12,
          critical: 6
        }
      } as any
    }

    if (cleanEndpoint === '/api/v1/monitoring/live') {
      return {
        active_agents: 4,
        pending_approvals: 0,
        recent_alerts: [
          {
            type: 'Privilege Escalation',
            message: 'Agent "GitHub Agent" requested iam.grant_role privileges.',
            agent_id: 'github_agent',
            event_id: 'evt-3',
            timestamp: new Date().toISOString()
          }
        ]
      } as any
    }

    throw new Error(`Endpoint mock fallback not supported: ${endpoint}`)
  }
}

export const api = new ApiClient()
