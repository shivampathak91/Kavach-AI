export interface User {
  id: string
  email: string
  full_name?: string
  role: 'admin' | 'security_analyst' | 'user'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  user_id: string
  name: string
  type: 'claude' | 'gpt' | 'gemini' | 'custom'
  config?: Record<string, any>
  trust_score: number
  status: 'active' | 'suspended' | 'deleted'
  created_at: string
  updated_at: string
}

export interface Policy {
  id: string
  user_id: string
  name: string
  description?: string
  rules: PolicyRule[]
  version: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PolicyRule {
  condition: string
  action: string
  parameters?: Record<string, any>
}

export interface Event {
  id: string
  agent_id: string
  event_type: 'tool_call' | 'prompt' | 'response' | 'error'
  tool_name?: string
  tool_args?: Record<string, any>
  prompt_text?: string
  response_text?: string
  intent_analysis?: Record<string, any>
  risk_score?: number
  trust_score_at_time?: number
  policy_decision?: 'allow' | 'block' | 'require_approval'
  policy_id?: string
  prompt_injection_detected: boolean
  injection_score?: number
  anomaly_detected: boolean
  anomaly_score?: number
  human_approval_required: boolean
  human_approval_id?: string
  execution_time_ms?: number
  status: 'pending' | 'allowed' | 'blocked' | 'approved' | 'rejected'
  error_message?: string
  metadata?: Record<string, any>
  created_at: string
}

export interface Approval {
  id: string
  event_id: string
  user_id: string
  decision: 'approved' | 'rejected'
  reason?: string
  reviewed_at: string
}

export interface Metrics {
  total_events: number
  blocked_events: number
  approved_events: number
  avg_risk_score: number
  avg_trust_score: number
  top_tools: Array<{ tool_name: string; count: number }>
  risk_distribution: {
    low: number
    medium: number
    high: number
    critical: number
  }
}

export interface LiveMetrics {
  active_agents: number
  pending_approvals: number
  recent_alerts: Array<{
    type: string
    message: string
    agent_id: string
    event_id: string
    timestamp: string
  }>
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface ToolCall {
  tool: string
  resource: string
  action: string
  arguments: {
    path?: string
    command?: string
    [key: string]: any
  }
}
