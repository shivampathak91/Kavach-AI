# Phase 1: Research & Architecture

## Kavach AI – Zero-Trust Runtime Security Platform for Autonomous AI Agents

---

## 1. Research & Threat Analysis

### 1.1 AI Agent Security Landscape

**Current State:**
- AI agents increasingly interact with external tools, APIs, and MCP servers
- No standardized security layer exists between agents and their tools
- Prompt injection attacks are becoming more sophisticated
- Agent behavior is often opaque and unpredictable
- No real-time monitoring or intervention capabilities

**Key Threat Vectors:**

1. **Prompt Injection Attacks**
   - Direct injection: Malicious instructions embedded in user prompts
   - Indirect injection: Poisoned data from external sources
   - Multi-turn injection: Gradual manipulation over conversations
   - Tool hijacking: Forcing agents to use tools maliciously

2. **Data Exfiltration**
   - Agents leaking sensitive information through tool outputs
   - Encoding sensitive data in seemingly benign requests
   - Side-channel attacks through timing or error messages

3. **Unauthorized Actions**
   - Agents executing destructive operations (file deletion, API calls)
   - Privilege escalation through tool chaining
   - Bypassing safety guardrails through creative prompting

4. **Behavior Drift**
   - Gradual deviation from intended behavior
   - Learning from malicious feedback loops
   - Unintended tool combinations

5. **Supply Chain Attacks**
   - Compromised MCP servers
   - Malicious tool implementations
   - Poisoned training data or embeddings

### 1.2 Existing Solutions & Gaps

**Current Approaches:**
- **Input/Output filtering**: Basic regex and keyword matching (insufficient)
- **Sandboxes**: Isolated environments (don't catch intent-based attacks)
- **Rate limiting**: Prevents abuse but not sophisticated attacks
- **Manual review**: Not scalable for real-time operations

**Gaps in Market:**
- No intent understanding at runtime
- No behavioral profiling over time
- No dynamic trust scoring
- No real-time intervention capabilities
- No comprehensive audit trails
- No attack simulation for testing

### 1.3 Kavach AI's Unique Approach

**Zero-Trust Model:**
- Every agent action is treated as potentially malicious
- Continuous verification of intent and behavior
- Dynamic trust scores that evolve with agent actions
- Human-in-the-loop for critical operations

**Runtime Interception:**
- Sits between agents and MCP servers/APIs
- Intercepts every tool call before execution
- Analyzes intent, context, and patterns
- Blocks or modifies unsafe operations

**Behavioral Learning:**
- Profiles normal agent behavior
- Detects anomalies and deviations
- Learns from attack patterns
- Improves detection over time

---

## 2. Engineering Decisions

### 2.1 Architectural Principles

**1. Clean Architecture**
- Domain-driven design with clear boundaries
- Business logic independent of frameworks
- Testable components with dependency injection
- Separation of concerns across layers

**2. SOLID Principles**
- Single Responsibility: Each component has one reason to change
- Open/Closed: Open for extension, closed for modification
- Liskov Substitution: Subtypes must be substitutable
- Interface Segregation: Clients shouldn't depend on unused interfaces
- Dependency Inversion: Depend on abstractions, not concretions

**3. Modular Design**
- Microservice-ready architecture
- Clear module boundaries with defined interfaces
- Independent deployment and scaling
- Plugin system for extensibility

**4. Event-Driven Architecture**
- Async communication between components
- Event sourcing for audit trails
- Real-time updates via WebSockets
- Message queues for reliability

### 2.2 Technology Stack Rationale

**Frontend: Next.js 15 + React 19 + TypeScript**
- **Next.js 15**: Latest App Router, server components, optimized performance
- **React 19**: Latest features, improved concurrent rendering
- **TypeScript**: Type safety, better developer experience, reduced bugs
- **Tailwind CSS**: Utility-first, rapid development, consistent design
- **shadcn/ui**: Beautiful, accessible components built on Radix UI
- **Framer Motion**: Smooth animations, micro-interactions
- **React Flow**: Visual graph for runtime monitoring
- **Zustand**: Lightweight state management
- **TanStack Query**: Server state management, caching, synchronization

**Backend: FastAPI + PostgreSQL + Redis**
- **FastAPI**: Modern, fast, async support, automatic docs, type hints
- **PostgreSQL**: ACID compliance, complex queries, JSON support, reliability
- **Redis**: Caching, session management, pub/sub, rate limiting
- **SQLAlchemy**: ORM with relationship management, migrations
- **WebSockets**: Real-time communication for live monitoring
- **JWT Authentication**: Stateless, scalable, industry standard

**AI: Provider Abstraction Layer**
- **OpenAI**: GPT-4, GPT-3.5 for intent analysis
- **Gemini**: Google's latest models for diversity
- **Claude**: Anthropic's models for safety-focused analysis
- **OpenRouter**: Access to multiple models via single API
- **Local AI**: sentence-transformers for embeddings, ONNX for inference
- **No Ollama**: Direct integration with inference engines for better control

**Learning & Analytics:**
- **Behavioral Profiling**: Track agent patterns, tool usage, decision trees
- **Anomaly Detection**: Statistical analysis, ML models for deviation detection
- **Trust Scoring**: Multi-factor scoring system with temporal decay
- **Embeddings**: Vector similarity for semantic analysis
- **Feedback Learning**: Reinforcement from human approvals/rejections

### 2.3 Key Design Decisions

**1. MCP Interceptor Architecture**
- Proxy pattern for tool call interception
- Middleware pipeline for analysis stages
- Async processing for non-blocking operations
- Circuit breakers for reliability

**2. Intent Analysis Engine**
- Multi-model approach for redundancy
- Context window management for long conversations
- Few-shot learning for prompt injection detection
- Confidence scoring for decision making

**3. Risk Scoring**
- Multi-dimensional factors: intent severity, tool risk, agent trust, context
- Weighted scoring algorithm
- Dynamic threshold adjustment
- Temporal decay for recent events

**4. Behavior Learning**
- Incremental learning from agent actions
- Clustering for behavior pattern discovery
- Anomaly detection using statistical methods
- Feedback loop from human decisions

**5. Policy Engine**
- Rule-based policies with condition evaluation
- Policy versioning and rollback
- A/B testing for policy effectiveness
- Policy templates for common scenarios

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Kavach AI Platform                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│   AI Agents          │    │   Web Dashboard      │    │   Mobile App         │
│   (Claude, GPT, etc) │    │   (Next.js)          │    │   (React Native)     │
└──────────┬───────────┘    └──────────┬───────────┘    └──────────┬───────────┘
           │                          │                          │
           │ HTTPS/WebSocket          │ HTTPS/WebSocket          │ HTTPS
           │                          │                          │
           ▼                          ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API Gateway (FastAPI)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Service │  │ Rate Limiter │  │ Router       │  │ WebSocket    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  Core Services       │  │  Analysis Engine     │  │  Learning Engine     │
│  ┌────────────────┐  │  │  ┌────────────────┐  │  │  ┌────────────────┐  │
│  │ MCP Interceptor│  │  │  │ Intent Analyzer│  │  │  │ Behavior       │  │
│  │ Policy Engine   │  │  │  │ Risk Scorer    │  │  │  │ Profiler       │  │
│  │ Trust Engine    │  │  │  │ Prompt Inj.    │  │  │  │ Anomaly Det.   │  │
│  │ Memory Inspector│  │  │  │ Detector       │  │  │  │ Trust Learner  │  │
│  └────────────────┘  │  │  └────────────────┘  │  │  └────────────────┘  │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
           │                          │                          │
           │                          │                          │
           ▼                          ▼                          ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  Data Layer          │  │  AI Providers        │  │  Message Queue       │
│  ┌────────────────┐  │  │  ┌────────────────┐  │  │  ┌────────────────┐  │
│  │ PostgreSQL     │  │  │  │ OpenAI         │  │  │  │ Redis Pub/Sub  │  │
│  │ Redis          │  │  │  │ Gemini         │  │  │  │ Event Stream  │  │
│  │ Vector DB      │  │  │  │ Claude         │  │  │  │ Task Queue    │  │
│  └────────────────┘  │  │  │ OpenRouter     │  │  │  └────────────────┘  │
└──────────────────────┘  │  │ Local AI       │  │  └──────────────────────┘
                          │  └────────────────┘  │
                          └──────────────────────┘

                                    │
                                    ▼
                          ┌──────────────────────┐
                          │  External Tools      │
                          │  ┌────────────────┐  │
                          │  │ MCP Servers    │  │
                          │  │ APIs           │  │
                          │  │ Databases      │  │
                          │  └────────────────┘  │
                          └──────────────────────┘
```

### 3.2 Component Interaction Flow

```
Agent Tool Call Flow:

1. Agent initiates tool call
   ↓
2. MCP Interceptor captures request
   ↓
3. Intent Analyzer examines prompt context
   ↓
4. Prompt Injection Detector checks for attacks
   ↓
5. Risk Scorer calculates risk score
   ↓
6. Trust Engine evaluates agent trust
   ↓
7. Policy Engine checks against rules
   ↓
8. Decision: Allow/Block/Require Approval
   ↓
9a. ALLOW: Forward to MCP server
   ↓
10a. Capture response
   ↓
11a. Behavior Learning updates profile
   ↓
12a. Return to agent

9b. BLOCK: Return error to agent
   ↓
10b. Log incident
   ↓
11b. Alert security team

9c. APPROVAL: Queue for human review
   ↓
10c. Human approves/denies
   ↓
11c. Execute or block based on decision
   ↓
12c. Learn from human decision
```

### 3.3 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Event-Driven Data Flow                       │
└─────────────────────────────────────────────────────────────────┘

Agent Action → Event Emitter → Message Queue → Event Handlers
                                              ↓
                    ┌─────────────────────────┼───────────────────┐
                    ▼                         ▼                   ▼
            ┌───────────────┐         ┌───────────────┐   ┌───────────────┐
            │ Intent Engine │         │ Risk Engine   │   │ Learning      │
            │ Handler       │         │ Handler       │   │ Engine Handler│
            └───────────────┘         └───────────────┘   └───────────────┘
                    │                         │                   │
                    ▼                         ▼                   ▼
            ┌───────────────┐         ┌───────────────┐   ┌───────────────┐
            │ Write to DB   │         │ Update Cache  │   │ Update Model  │
            │ (PostgreSQL)  │         │ (Redis)       │   │ (Vector DB)   │
            └───────────────┘         └───────────────┘   └───────────────┘
                    │                         │                   │
                    └─────────────────────────┼───────────────────┘
                                              ▼
                                    ┌───────────────┐
                                    │ WebSocket     │
                                    │ Broadcast     │
                                    │ (Real-time UI)│
                                    └───────────────┘
```

---

## 4. Folder Structure

```
kavach-ai/
├── README.md
├── docker-compose.yml
├── .env.example
├── .gitignore
│
├── frontend/                          # Next.js 15 Frontend
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   │
│   ├── src/
│   │   ├── app/                       # App Router
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx               # Landing page
│   │   │   ├── login/
│   │   │   ├── dashboard/            # Mission Control
│   │   │   ├── agents/               # Agent Workspace
│   │   │   ├── policies/             # Policy Studio
│   │   │   ├── monitoring/           # Live Monitoring
│   │   │   ├── attacks/              # Attack Simulator
│   │   │   ├── replay/               # Replay Center
│   │   │   └── api/                  # API routes
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── landing/              # Landing page components
│   │   │   ├── dashboard/            # Dashboard components
│   │   │   ├── graphs/               # React Flow graphs
│   │   │   ├── charts/               # Animated charts
│   │   │   └── shared/               # Shared components
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                # API client
│   │   │   ├── websocket.ts          # WebSocket client
│   │   │   ├── utils.ts              # Utilities
│   │   │   └── constants.ts          # Constants
│   │   │
│   │   ├── stores/
│   │   │   ├── auth.ts               # Auth store (Zustand)
│   │   │   ├── agents.ts             # Agents store
│   │   │   ├── monitoring.ts         # Monitoring store
│   │   │   └── ui.ts                 # UI store
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useWebSocket.ts
│   │   │   └── useQuery.ts           # TanStack Query hooks
│   │   │
│   │   ├── types/
│   │   │   ├── agent.ts
│   │   │   ├── policy.ts
│   │   │   ├── event.ts
│   │   │   └── index.ts
│   │   │
│   │   └── styles/
│   │       └── globals.css
│   │
│   └── public/
│       ├── images/
│       └── fonts/
│
├── backend/                           # FastAPI Backend
│   ├── requirements.txt
│   ├── pyproject.toml
│   ├── alembic.ini
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI app entry
│   │   ├── config.py                 # Configuration
│   │   │
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── dependencies.py       # Dependency injection
│   │   │   ├── routes/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py
│   │   │   │   ├── agents.py
│   │   │   │   ├── policies.py
│   │   │   │   ├── events.py
│   │   │   │   ├── monitoring.py
│   │   │   │   └── approvals.py
│   │   │   └── websocket/
│   │   │       ├── __init__.py
│   │   │       └── manager.py
│   │   │
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── security.py           # JWT, password hashing
│   │   │   ├── rbac.py               # Role-based access control
│   │   │   └── events.py             # Event definitions
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── agent.py
│   │   │   ├── policy.py
│   │   │   ├── event.py
│   │   │   ├── approval.py
│   │   │   └── audit.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── agent.py
│   │   │   ├── policy.py
│   │   │   ├── event.py
│   │   │   └── approval.py
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   │
│   │   │   ├── mcp/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── interceptor.py    # MCP interceptor
│   │   │   │   └── proxy.py
│   │   │   │
│   │   │   ├── analysis/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── intent.py         # Intent analysis
│   │   │   │   ├── prompt_injection.py
│   │   │   │   └── risk.py           # Risk scoring
│   │   │   │
│   │   │   ├── learning/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── behavior.py       # Behavior profiling
│   │   │   │   ├── anomaly.py        # Anomaly detection
│   │   │   │   └── trust.py          # Trust scoring
│   │   │   │
│   │   │   ├── policy/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── engine.py         # Policy engine
│   │   │   │   └── evaluator.py
│   │   │   │
│   │   │   ├── memory/
│   │   │   │   ├── __init__.py
│   │   │   │   └── inspector.py
│   │   │   │
│   │   │   └── approval/
│   │   │       ├── __init__.py
│   │   │       └── workflow.py
│   │   │
│   │   ├── ai/
│   │   │   ├── __init__.py
│   │   │   ├── base.py               # Base provider interface
│   │   │   ├── openai.py
│   │   │   ├── gemini.py
│   │   │   ├── claude.py
│   │   │   ├── openrouter.py
│   │   │   └── local.py              # Local AI
│   │   │
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   ├── session.py            # Database session
│   │   │   ├── base.py               # Base model
│   │   │   └── init_db.py
│   │   │
│   │   ├── cache/
│   │   │   ├── __init__.py
│   │   │   └── redis.py
│   │   │
│   │   ├── queue/
│   │   │   ├── __init__.py
│   │   │   └── tasks.py
│   │   │
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── logger.py
│   │       └── helpers.py
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── test_api/
│   │   ├── test_services/
│   │   └── test_ai/
│   │
│   └── alembic/
│       └── versions/
│
├── docs/                              # Documentation
│   ├── api.md
│   ├── architecture.md
│   └── deployment.md
│
└── scripts/                           # Utility scripts
    ├── setup.sh
    └── migrate.sh
```

---

## 5. Database Schema

### 5.1 Core Tables

**Users**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- admin, security_analyst, user
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Agents**
```sql
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- claude, gpt, gemini, custom
    api_key_encrypted TEXT,
    config JSONB, -- Agent-specific configuration
    trust_score DECIMAL(5,4) DEFAULT 0.5000, -- 0.0000 to 1.0000
    status VARCHAR(50) DEFAULT 'active', -- active, suspended, deleted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_type ON agents(type);
CREATE INDEX idx_agents_trust_score ON agents(trust_score);
```

**Policies**
```sql
CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rules JSONB NOT NULL, -- Policy rules as JSON
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_policies_user_id ON policies(user_id);
CREATE INDEX idx_policies_active ON policies(is_active);
```

**Events** (Core table for all agent actions)
```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- tool_call, prompt, response, error
    tool_name VARCHAR(255),
    tool_args JSONB,
    prompt_text TEXT,
    response_text TEXT,
    intent_analysis JSONB, -- Intent analysis results
    risk_score DECIMAL(5,4), -- 0.0000 to 1.0000
    trust_score_at_time DECIMAL(5,4),
    policy_decision VARCHAR(50), -- allow, block, approve
    policy_id UUID REFERENCES policies(id),
    prompt_injection_detected BOOLEAN DEFAULT false,
    injection_score DECIMAL(5,4),
    anomaly_detected BOOLEAN DEFAULT false,
    anomaly_score DECIMAL(5,4),
    human_approval_required BOOLEAN DEFAULT false,
    human_approval_id UUID,
    execution_time_ms INTEGER,
    status VARCHAR(50) DEFAULT 'pending', -- pending, allowed, blocked, approved, rejected
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_agent_id ON events(agent_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_risk_score ON events(risk_score);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_tool_name ON events(tool_name);

-- Partitioning for large-scale deployments
-- CREATE TABLE events_2024_01 PARTITION OF events
-- FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

**Approvals** (Human approval workflow)
```sql
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    decision VARCHAR(50) NOT NULL, -- approved, rejected
    reason TEXT,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approvals_event_id ON approvals(event_id);
CREATE INDEX idx_approvals_user_id ON approvals(user_id);
```

**Behavior Profiles** (Learned agent behavior)
```sql
CREATE TABLE behavior_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    profile_type VARCHAR(100) NOT NULL, -- tool_usage, temporal, contextual
    profile_data JSONB NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1
);

CREATE INDEX idx_behavior_profiles_agent_id ON behavior_profiles(agent_id);
CREATE INDEX idx_behavior_profiles_type ON behavior_profiles(profile_type);
```

**Anomalies** (Detected anomalies)
```sql
CREATE TABLE anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    anomaly_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50), -- low, medium, high, critical
    description TEXT,
    anomaly_score DECIMAL(5,4),
    baseline_score DECIMAL(5,4),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT false
);

CREATE INDEX idx_anomalies_agent_id_ON anomalies(agent_id);
CREATE INDEX idx_anomalies_severity ON anomalies(severity);
CREATE INDEX idx_anomalies_detected_at ON anomalies(detected_at);
```

**Audit Logs** (Comprehensive audit trail)
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

**Attack Simulations**
```sql
CREATE TABLE attack_simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    simulation_type VARCHAR(100) NOT NULL,
    attack_vector VARCHAR(100),
    payload TEXT,
    expected_result VARCHAR(100),
    actual_result VARCHAR(100),
    passed BOOLEAN,
    detection_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attack_simulations_user_id ON attack_simulations(user_id);
CREATE INDEX idx_attack_simulations_agent_id ON attack_simulations(agent_id);
```

### 5.2 Redis Data Structures

**Session Management**
```
session:{user_id} -> Hash (session data, expiry)
```

**Caching**
```
agent:{agent_id}:trust -> String (current trust score)
agent:{agent_id}:profile -> Hash (behavior profile cache)
policy:{policy_id} -> Hash (policy cache)
event:{event_id} -> Hash (event cache)
```

**Rate Limiting**
```
ratelimit:{user_id}:{endpoint} -> String (request count, TTL)
```

**Real-time Metrics**
```
metrics:live:events -> Stream (event stream for WebSocket)
metrics:alerts -> List (recent alerts)
metrics:agent:{agent_id}:stats -> Hash (real-time agent stats)
```

**Message Queue**
```
queue:analysis -> List (pending analysis tasks)
queue:learning -> List (pending learning tasks)
queue:alerts -> List (pending alert notifications)
```

### 5.3 Vector Database (pgvector)

**Embeddings Table**
```sql
CREATE TABLE embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    embedding vector(1536), -- OpenAI embedding dimension
    embedding_type VARCHAR(100) NOT NULL, -- prompt, response, tool_args
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_embeddings_event_id ON embeddings(event_id);
CREATE INDEX idx_embeddings_vector ON embeddings USING ivfflat (embedding vector_cosine_ops);
```

---

## 6. Testing Strategy

### 6.1 Testing Pyramid

```
        ┌─────────────┐
        │   E2E Tests │  (10% - Critical user flows)
        ├─────────────┤
        │Integration  │  (30% - Service interactions)
        │   Tests     │
        ├─────────────┤
        │  Unit Tests │  (60% - Individual components)
        └─────────────┘
```

### 6.2 Unit Testing

**Backend (pytest)**
- Test all service layer functions
- Test business logic in isolation
- Mock external dependencies (AI providers, databases)
- Test edge cases and error handling
- Achieve >80% code coverage

**Frontend (Jest + React Testing Library)**
- Test component rendering
- Test user interactions
- Test custom hooks
- Mock API calls
- Test state management

### 6.3 Integration Testing

**Service Integration**
- Test service-to-service communication
- Test database operations
- Test cache layer
- Test message queue processing
- Test WebSocket connections

**API Integration**
- Test API endpoints end-to-end
- Test authentication flow
- Test rate limiting
- Test error responses

### 6.4 End-to-End Testing

**Critical User Flows**
- User registration and login
- Agent registration and configuration
- Policy creation and activation
- Tool call interception and analysis
- Human approval workflow
- Attack simulation and detection

**Tools**
- Playwright for E2E tests
- Test against staging environment
- Run before each deployment

### 6.5 Performance Testing

**Load Testing**
- API response times under load
- Concurrent WebSocket connections
- Database query performance
- Cache hit rates

**Tools**
- Locust for load testing
- Database query analysis
- Profiling tools

### 6.6 Security Testing

**Security Tests**
- SQL injection attempts
- XSS attempts
- CSRF protection
- Authentication bypass attempts
- Rate limiting effectiveness

**Tools**
- OWASP ZAP
- Custom security test suite
- Penetration testing

### 6.7 AI/ML Testing

**Model Testing**
- Intent analysis accuracy
- Prompt injection detection precision/recall
- Risk scoring calibration
- Anomaly detection accuracy

**Dataset**
- Curated test dataset of prompts
- Known attack patterns
- Normal agent behavior samples

---

## 7. Scalability Considerations

### 7.1 Horizontal Scaling

**Stateless Services**
- API Gateway: Scale based on request volume
- Analysis Engine: Scale based on queue length
- Learning Engine: Scale based on processing needs
- Worker processes for async tasks

**Load Balancing**
- Nginx or HAProxy for HTTP/WebSocket
- Round-robin or least-connections
- Sticky sessions for WebSocket connections

### 7.2 Database Scaling

**PostgreSQL**
- Read replicas for query scaling
- Connection pooling (PgBouncer)
- Partitioning for events table (by time)
- Index optimization for common queries

**Redis**
- Redis Cluster for horizontal scaling
- Master-slave replication
- Memory optimization

**Vector Database**
- pgvector with proper indexing
- Consider dedicated vector DB for large scale (Milvus, Weaviate)

### 7.3 Caching Strategy

**Multi-level Caching**
- Application-level cache (in-memory)
- Redis cache (distributed)
- CDN for static assets
- Database query caching

**Cache Invalidation**
- TTL-based expiration
- Event-based invalidation
- Write-through cache for critical data

### 7.4 Message Queue Scaling

**Redis Queue**
- Multiple worker processes
- Priority queues for critical tasks
- Dead letter queues for failed tasks
- Backpressure handling

### 7.5 CDN and Static Assets

**Frontend Assets**
- Next.js static optimization
- CDN for JavaScript, CSS, images
- Image optimization
- Font subsetting

### 7.6 Monitoring and Auto-scaling

**Metrics**
- Request rate, response time, error rate
- Queue lengths, processing times
- Database connection counts, query times
- Cache hit rates, memory usage

**Auto-scaling**
- Kubernetes HPA based on metrics
- Scale up during high load
- Scale down to save costs
- Predictive scaling based on patterns

### 7.7 Geographic Distribution

**Multi-region Deployment**
- Deploy close to users
- Data replication with conflict resolution
- Regional databases with sync
- CDN for global content delivery

---

## 8. Security Considerations

### 8.1 Application Security

**Authentication**
- JWT with short expiration (15 minutes)
- Refresh tokens with secure storage
- MFA support for sensitive operations
- Password strength requirements
- Secure password hashing

**Authorization**
- Role-based access control (RBAC)
- Principle of least privilege
- Resource-level permissions
- Audit trail for all actions

**Input Validation**
- Validate all user inputs
- Sanitize data from external sources
- Type checking with TypeScript/Pydantic
- Length limits on all inputs

**Output Encoding**
- Escape all dynamic content
- Content Security Policy (CSP)
- XSS protection headers
- Safe JSON serialization

### 8.2 Data Security

**Encryption at Rest**
- Database encryption (TDE)
- Encrypted backups
- Encrypted API keys in database
- Environment variable encryption

**Encryption in Transit**
- TLS 1.3 for all communications
- Certificate pinning for mobile
- Secure WebSocket (WSS)
- Internal service mTLS

**Data Privacy**
- PII identification and protection
- Data retention policies
- Right to deletion (GDPR)
- Data minimization

### 8.3 API Security

**Rate Limiting**
- Per-user rate limits
- Per-endpoint limits
- IP-based limits
- Gradual response degradation

**API Key Management**
- Secure API key storage
- Key rotation
- Key scopes and permissions
- Revocation mechanism

**CORS Configuration**
- Whitelist allowed origins
- Proper CORS headers
- Preflight handling
- Credential handling

### 8.4 AI Security

**Prompt Injection Protection**
- Multi-layer detection
- Adversarial testing
- Regular model updates
- Human review for high-risk

**Model Security**
- Model versioning
- A/B testing for model changes
- Fallback mechanisms
- Model output filtering

**Provider Security**
- Secure API key storage
- Request signing
- Response validation
- Abuse detection

### 8.5 Infrastructure Security

**Network Security**
- VPC isolation
- Security groups and firewalls
- Private subnets for databases
- Bastion hosts for access

**Container Security**
- Minimal base images
- Vulnerability scanning
- Non-root containers
- Resource limits

**Secrets Management**
- HashiCorp Vault or AWS Secrets Manager
- No secrets in code
- Automatic rotation
- Audit access to secrets

### 8.6 Monitoring and Logging

**Security Monitoring**
- Real-time alerting for suspicious activity
- Anomaly detection in logs
- Failed login attempt tracking
- Unusual API usage patterns

**Audit Logging**
- Log all security-relevant events
- Immutable log storage
- Log analysis and correlation
- Compliance reporting

**Incident Response**
- Defined incident response plan
- Automated containment
- Post-incident analysis
- Regular security drills

### 8.7 Compliance

**Standards**
- SOC 2 Type II compliance
- GDPR compliance
- HIPAA compliance (if handling healthcare data)
- ISO 27001 certification

**Regular Assessments**
- Penetration testing
- Security audits
- Code security reviews
- Dependency vulnerability scanning

---

## Phase 1 Summary

**Completed:**
- ✅ Research and threat analysis
- ✅ Engineering decisions and architectural principles
- ✅ System architecture diagrams
- ✅ Complete folder structure
- ✅ Database schema design
- ✅ Testing strategy
- ✅ Scalability considerations
- ✅ Security considerations

**Key Architectural Decisions:**
1. Clean architecture with clear separation of concerns
2. Event-driven architecture for real-time processing
3. Multi-layer AI analysis (intent, risk, behavior)
4. Zero-trust model with dynamic trust scoring
5. Human-in-the-loop for critical operations
6. Modular design for extensibility

**Tech Stack Confirmed:**
- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- Backend: FastAPI, PostgreSQL, Redis, SQLAlchemy, WebSockets
- AI: Multi-provider abstraction (OpenAI, Gemini, Claude, OpenRouter, Local AI)
- Learning: Behavioral profiling, anomaly detection, trust scoring

**Ready for Phase 2: System Design**

---

**STOP - Waiting for NEXT command to proceed to Phase 2**
