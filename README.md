# Kavach AI – Zero-Trust Runtime Security Platform for Autonomous AI Agents

Kavach AI is a runtime security platform for AI agents. Instead of modifying the AI model itself, it sits between users and AI agents, inspecting every prompt before it reaches the model. By understanding user intent, evaluating risk, and enforcing security policies, Kavach AI helps prevent prompt injection, jailbreak attempts, unauthorized tool execution, and sensitive data exposure in real time.

## The Problem

As AI agents become capable of accessing databases, calling APIs, and automating business workflows, they also introduce new security risks.

Traditional security solutions such as firewalls and web application firewalls inspect network traffic, but they cannot understand the meaning or intent behind natural language prompts. As a result, attackers can manipulate AI agents using techniques such as:

Prompt injection to override system instructions
Jailbreak attacks to bypass safety restrictions
Sensitive data extraction through carefully crafted prompts
Unauthorized execution of tools and external APIs

Organizations need a security layer that understands AI interactions rather than just network traffic.

## Solution

- Acts as a security layer between users and AI agents.
- Analyzes every prompt in real time before it reaches the AI model.
- Detects and blocks prompt injection, jailbreak attacks, and data exfiltration attempts.
- Evaluates risk and enforces customizable security policies.
- Monitors AI interactions and provides audit logs for complete visibility.

## 🚀 Features

- **MCP Runtime Interceptor**: Intercept and analyze all tool calls before execution
- **Intent Analysis Engine**: AI-powered intent understanding and classification
- **Prompt Injection Detection**: Multi-layer detection of prompt injection attacks
- **Risk Scoring Engine**: Multi-factor risk calculation with dynamic thresholds
- **Behavior Learning Engine**: Profiling and anomaly detection for agent behavior
- **Trust Engine**: Dynamic trust scoring with temporal decay
- **Policy Engine**: Rule-based policy evaluation and enforcement
- **Memory Inspector**: Analyze and inspect agent memory/context
- **Attack Simulator**: Test security with comprehensive attack simulation
- **Human Approval Workflow**: Queue high-risk actions for human review
- **Real-time Monitoring**: Live dashboard with WebSocket updates
- **Audit Logs**: Comprehensive audit trail for compliance

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Beautiful, accessible components
- **Framer Motion**: Smooth animations
- **React Flow**: Visual graph for runtime monitoring
- **Zustand**: Lightweight state management
- **TanStack Query**: Server state management

### Backend
- **FastAPI**: Modern, fast Python web framework
- **PostgreSQL**: ACID-compliant database with pgvector
- **Redis**: Caching and pub/sub
- **SQLAlchemy**: ORM with async support
- **WebSockets**: Real-time communication
- **JWT Authentication**: Stateless authentication

### AI/ML
- **Multi-provider AI**: OpenAI, Claude, Gemini, OpenRouter
- **Local AI**: sentence-transformers, ONNX Runtime
- **Embeddings**: Vector similarity for semantic analysis
- **Behavioral Profiling**: Statistical analysis and ML models

## � Screenshots

![Screenshot 1](images/1.png)
![Screenshot 2](images/2.png)
![Screenshot 3](images/3.png)
![Screenshot 4](images/4.png)
![Screenshot 5](images/5.png)
![Screenshot 6](images/6.png)
![Screenshot 7](images/7.png)
![Screenshot 8](images/8.png)
![Screenshot 9](images/9.png)
![Screenshot 10](images/10.png)
![Screenshot 11](images/11.png)

## �📋 Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

## 🔧 Installation

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start the development server
npm run dev
```

### Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🏗️ Project Structure

```
kavach-ai/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── ai/               # AI provider implementations
│   │   ├── api/              # API routes and WebSocket
│   │   ├── core/             # Security, RBAC
│   │   ├── db/               # Database models and session
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   │   ├── analysis/    # Intent, risk, injection
│   │   │   ├── learning/    # Behavior, trust
│   │   │   ├── policy/      # Policy engine
│   │   │   ├── memory/      # Memory inspector
│   │   │   ├── mcp/         # MCP interceptor
│   │   │   └── approval/    # Approval workflow
│   │   └── utils/           # Utilities
│   ├── tests/                # Test suite
│   └── requirements.txt
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities and API client
│   │   ├── stores/           # Zustand stores
│   │   └── types/            # TypeScript types
│   └── package.json
├── docs/                      # Documentation
└── docker-compose.yml
```

## 🔐 Security Features

- **Zero-Trust Architecture**: Every action is treated as potentially malicious
- **Multi-Layer Analysis**: Intent, risk, behavior, and policy evaluation
- **Prompt Injection Detection**: Pattern-based and semantic detection
- **Dynamic Trust Scoring**: Trust scores that evolve with agent behavior
- **Human-in-the-Loop**: Critical actions require human approval
- **Comprehensive Audit Trail**: All actions logged for compliance

## 📊 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_api/test_auth.py
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Environment Variables

Backend (`.env`):
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/kavach
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

Frontend (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production Deployment

1. **Backend**:
   - Use Gunicorn with Uvicorn workers
   - Configure PostgreSQL with connection pooling
   - Set up Redis with persistence
   - Enable HTTPS with proper certificates

2. **Frontend**:
   - Build with `npm run build`
   - Serve with Node.js or use Next.js standalone output
   - Configure CDN for static assets

3. **Docker**:
   - Use the provided Dockerfile
   - Deploy with Docker Compose or Kubernetes
   - Configure health checks and auto-restart policies

## 📈 Monitoring

- **Prometheus**: Metrics collection
- **Sentry**: Error tracking and performance monitoring
- **Custom Dashboard**: Real-time monitoring via WebSocket

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Inspired by the need for AI agent security in production environments
- Built with modern best practices and enterprise-grade architecture
- Design inspiration from Linear, Cursor, Vercel, and OpenAI

---

**Built with ❤️ for secure AI agent operations**
