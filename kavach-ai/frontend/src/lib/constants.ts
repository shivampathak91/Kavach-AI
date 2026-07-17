export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001'

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'kavach_access_token',
  REFRESH_TOKEN: 'kavach_refresh_token',
  USER: 'kavach_user',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  AGENTS: '/agents',
  POLICIES: '/policies',
  EVENTS: '/events',
  MONITORING: '/monitoring',
  ATTACKS: '/attacks',
  REPLAY: '/replay',
  MEMORY: '/memory',
} as const

export const RISK_LEVELS = {
  LOW: { value: 0.3, label: 'Low', color: 'green' },
  MEDIUM: { value: 0.6, label: 'Medium', color: 'yellow' },
  HIGH: { value: 0.8, label: 'High', color: 'orange' },
  CRITICAL: { value: 1.0, label: 'Critical', color: 'red' },
} as const

export const EVENT_TYPES = {
  TOOL_CALL: 'tool_call',
  PROMPT: 'prompt',
  RESPONSE: 'response',
  ERROR: 'error',
} as const

export const AGENT_TYPES = {
  CLAUDE: 'claude',
  GPT: 'gpt',
  GEMINI: 'gemini',
  CUSTOM: 'custom',
} as const
