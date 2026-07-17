'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import KavachLogo from '@/components/shared/KavachLogo'
import {
  Zap,
  Lock,
  Activity,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  Terminal,
  Cpu,
  Database,
  Eye,
  Fingerprint,
  Network,
  UserCheck,
  BarChart2,
  Code2,
  BookOpen,
  Presentation,
  Github,
  ExternalLink,
  Copy,
  Check,
  Play,
  Layers
} from 'lucide-react'

// Typing animation for the hero terminal
function useTypewriter(lines: string[], speed = 35, lineDelay = 600) {
  const [displayed, setDisplayed] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (currentLine >= lines.length) {
      setDone(true)
      return
    }
    if (currentChar < lines[currentLine].length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => {
          const copy = [...prev]
          copy[currentLine] = (copy[currentLine] || '') + lines[currentLine][currentChar]
          return copy
        })
        setCurrentChar((c) => c + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine((l) => l + 1)
        setCurrentChar(0)
        setDisplayed((prev) => [...prev, ''])
      }, lineDelay)
      return () => clearTimeout(timeout)
    }
  }, [currentLine, currentChar, lines, speed, lineDelay])

  return { displayed: displayed.filter((l) => l !== undefined), done }
}

// Animated counter
function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = Date.now()
          const tick = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
      {count}{suffix}
    </div>
  )
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const terminalLines = [
    '$ kavach intercept --agent github_agent --tool database.query',
    '⚡ MCP Interceptor: Captured outgoing tool_call payload...',
    '🔍 Intent Analysis: Classifying prompt objectives...',
    '🛡️ Injection Detector: Scanning for override patterns...',
    '📊 Risk Score: 0.04 (LOW) | Trust Index: 99%',
    '✅ Policy SEC-001: PASSED. Forwarding to MCP runtime.',
    '🎉 Tool execution completed successfully in 120ms.'
  ]

  const { displayed, done } = useTypewriter(terminalLines, 20, 400)

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedBlock(idx)
    setTimeout(() => setCopiedBlock(null), 2000)
  }

  const integrationSnippets = [
    {
      title: 'MCP Proxy Intercept',
      subtitle: 'Route your agent MCP traffic through Kavach',
      lang: 'python',
      code: `# app/services/mcp/proxy.py
result = await kavach.intercept_tool_call(
    agent_id="github_agent",
    tool_name=tool_name,
    tool_args=arguments,
    prompt_context=prompt
)
if result["decision"] == "allow":
    return await forward_to_mcp(tool_name, arguments)
else:
    raise SecurityBlockException(result["reason"])`
    },
    {
      title: 'SDK Middleware Guard',
      subtitle: 'LangChain / CrewAI tool wrapper',
      lang: 'python',
      code: `# kavach_guard.py
class KavachGuard:
    async def verify(self, tool, args, prompt):
        res = await httpx.post(
            f"{KAVACH_URL}/api/v1/intercept",
            json={"tool": tool, "args": args,
                   "prompt": prompt}
        )
        return res.json()["decision"] != "block"`
    },
    {
      title: 'Input Sanitization',
      subtitle: 'Pre-execution prompt injection scan',
      lang: 'python',
      code: `# Pre-process user input before LLM call
scan = await httpx.post(
    f"{KAVACH_URL}/api/v1/analysis/injection",
    json={"prompt": user_input, "history": history}
)
if scan.json()["injection_detected"]:
    return "⚠️ Prompt flagged. Execution halted."
response = await llm.chat(user_input)`
    }
  ]

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans antialiased overflow-x-hidden selection:bg-indigo-500/30">

      {/* ═══════════════ AMBIENT BACKGROUND ═══════════════ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
        {/* Radial gradients */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-tl from-cyan-600/8 to-transparent rounded-full blur-3xl" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      {/* ═══════════════ NAVIGATION ═══════════════ */}
      <nav className="relative z-30 border-b border-white/[0.06] bg-[#030712]/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <KavachLogo size={36} className="group-hover:shadow-indigo-500/40 transition-shadow" />
            <span className="text-lg font-bold tracking-tight">Kavach AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Runtime SOC', href: '/runtime', icon: Activity },
              { label: 'Pitch Deck', href: '/pitch-deck.html', icon: Presentation },
              { label: 'Features', href: '#features', icon: Layers },
              { label: 'Integration', href: '#integration', icon: Code2 },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all"
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">
              Dashboard
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white rounded-lg text-sm font-medium transition-all backdrop-blur-sm"
            >
              Sign In
            </Link>
            <Link
              href="/runtime"
              className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20"
            >
              Launch Console
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative z-10 pt-20 pb-28 lg:pt-28 lg:pb-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/8 border border-indigo-500/15 rounded-full text-xs text-indigo-300 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Zero-Trust Runtime Agent Security
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.08] tracking-tight">
                The security layer
                <br />
                your AI agents are{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  missing
                </span>
              </h1>

              <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                Kavach AI intercepts every autonomous agent action at runtime — analyzing intent,
                detecting prompt injection, scoring risk, enforcing policies, and blocking threats
                <strong className="text-gray-300"> before they reach your infrastructure</strong>.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/runtime"
                  className="group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20"
                >
                  Launch Runtime Security Center
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/pitch-deck.html"
                  className="flex items-center gap-2 px-7 py-3.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-xl font-semibold hover:bg-indigo-500/20 transition-all"
                >
                  <Presentation className="w-4 h-4" />
                  Why Kavach? (Pitch Deck)
                </Link>
                <Link
                  href="#integration"
                  className="flex items-center gap-2 px-7 py-3.5 bg-white/[0.04] border border-white/[0.08] text-white rounded-xl font-semibold hover:bg-white/[0.07] transition-all"
                >
                  <Code2 className="w-4 h-4" />
                  Integration Guide
                </Link>
              </div>
            </div>

            {/* Right: Animated Live Terminal */}
            <div className="relative">
              {/* Glow behind the terminal */}
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-3xl blur-2xl" />

              <div className="relative bg-[#0c0f1a] border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
                {/* Terminal title bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  </div>
                  <span className="text-[11px] text-gray-500 font-mono ml-2">kavach-runtime — intercept-stream</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400/70 font-mono">LIVE</span>
                  </div>
                </div>

                {/* Terminal body */}
                <div className="p-5 font-mono text-[12px] leading-[1.8] min-h-[320px] overflow-hidden">
                  {displayed.map((line, idx) => {
                    let color = 'text-gray-300'
                    if (line.startsWith('$')) color = 'text-indigo-300'
                    else if (line.includes('✅') || line.includes('🎉')) color = 'text-emerald-400'
                    else if (line.includes('🔍') || line.includes('🛡️')) color = 'text-cyan-300'
                    else if (line.includes('📊')) color = 'text-purple-300'
                    else if (line.includes('⚡')) color = 'text-amber-300'
                    return (
                      <div key={idx} className={`${color} whitespace-pre-wrap`}>
                        {line}
                      </div>
                    )
                  })}
                  {!done && (
                    <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse ml-0.5" />
                  )}
                  {done && (
                    <div className="mt-4 pt-3 border-t border-white/[0.06] text-emerald-400/80 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Pipeline complete. All checks passed.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 99.9, suffix: '%', label: 'Threat Detection Rate' },
              { value: 12, suffix: 'ms', label: 'Avg. Intercept Latency' },
              { value: 9, suffix: '', label: 'Security Pipeline Stages' },
              { value: 24, suffix: '/7', label: 'Continuous Monitoring' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                {mounted ? (
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                ) : (
                  <div className="text-4xl md:text-5xl font-extrabold text-white">{stat.value}{stat.suffix}</div>
                )}
                <div className="text-sm text-gray-500 mt-1.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BENTO GRID FEATURES ═══════════════ */}
      <section id="features" className="relative z-10 py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 font-mono">MULTI-LAYER DEFENSE</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 tracking-tight">
              Nine stages of{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">runtime protection</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
              Every autonomous agent action passes through Kavach&apos;s multi-stage security pipeline before reaching your infrastructure.
            </p>
          </div>

          {/* Premium Glassmorphism Feature Cards */}
          <div className="relative">
            {/* Circuit trace background pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              {[
                {
                  icon: Network,
                  title: 'MCP Interception',
                  desc: 'Inline proxy captures every outgoing tool call at the protocol layer before execution.',
                  accent: 'from-indigo-500 to-blue-500',
                  tags: ['Protocol Layer', 'Real-time'],
                  status: 'active',
                  span: ''
                },
                {
                  icon: Eye,
                  title: 'Intent Analysis',
                  desc: 'AI-powered semantic classification determines whether an action is benign, suspicious, or malicious.',
                  accent: 'from-purple-500 to-pink-500',
                  tags: ['AI Classification', 'Semantic'],
                  status: 'active',
                  span: ''
                },
                {
                  icon: Fingerprint,
                  title: 'Prompt Injection Detection',
                  desc: 'Regex signatures, vector-space scanning, and LLM-based classifiers detect override and jailbreak attempts.',
                  accent: 'from-red-500 to-orange-500',
                  tags: ['ML Detection', 'Security'],
                  status: 'active',
                  span: 'md:col-span-2 lg:col-span-1'
                },
                {
                  icon: Activity,
                  title: 'Behavioral Profiling',
                  desc: 'Baseline agent behavior models flag anomalous tool argument patterns and deviation scores.',
                  accent: 'from-amber-500 to-yellow-500',
                  tags: ['Anomaly Detection', 'ML'],
                  status: 'active',
                  span: ''
                },
                {
                  icon: BarChart2,
                  title: 'Dynamic Risk Scoring',
                  desc: 'Weighted risk factors including intent severity, injection probability, tool risk, and trust decay.',
                  accent: 'from-emerald-500 to-teal-500',
                  tags: ['Risk Engine', 'Scoring'],
                  status: 'active',
                  span: ''
                },
                {
                  icon: KavachLogo,
                  title: 'Trust Engine',
                  desc: 'Evolving trust scores decay with violations and recover with compliant behavior over time.',
                  accent: 'from-cyan-500 to-blue-500',
                  tags: ['Trust Decay', 'Recovery'],
                  status: 'active',
                  span: ''
                },
                {
                  icon: Lock,
                  title: 'Policy Engine',
                  desc: 'Configurable rule sets with conditional logic, priority levels, and automated enforcement actions.',
                  accent: 'from-violet-500 to-purple-500',
                  tags: ['Rules Engine', 'Automation'],
                  status: 'active',
                  span: ''
                },
                {
                  icon: UserCheck,
                  title: 'Human-in-the-Loop',
                  desc: 'Critical operations halt the pipeline and require manual security analyst approval before proceeding.',
                  accent: 'from-pink-500 to-rose-500',
                  tags: ['Manual Review', 'Critical'],
                  status: 'active',
                  span: ''
                },
                {
                  icon: Zap,
                  title: 'Execution Decision',
                  desc: 'Final binary verdict — forward approved calls to MCP servers or block and log the violation.',
                  accent: 'from-indigo-500 to-purple-600',
                  tags: ['Binary Decision', 'Enforcement'],
                  status: 'active',
                  span: ''
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className={`group relative ${feature.span}`}
                  style={{ perspective: '1000px' }}
                >
                  {/* Spotlight glow effect */}
                  <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${feature.accent} opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500`} />
                  
                  {/* Card container with tilt effect */}
                  <div className="relative h-full transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2">
                    {/* Glassmorphism card */}
                    <div className="relative h-full bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 overflow-hidden transition-all duration-500 group-hover:border-white/[0.15] group-hover:shadow-2xl group-hover:shadow-black/50">
                      
                      {/* Inner glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                      
                      {/* Animated circuit trace */}
                      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <path d="M0,0 L30,0 L30,20 L50,20 L50,40 L70,40 L70,60 L100,60" stroke="currentColor" strokeWidth="1" fill="none" className={`text-${feature.accent.split('-')[1]}-500`} />
                        </svg>
                      </div>

                      {/* Feature number */}
                      <div className={`absolute top-6 right-6 text-5xl font-black bg-gradient-to-r ${feature.accent} bg-clip-text text-transparent opacity-20 group-hover:opacity-30 transition-opacity`}>
                        {(idx + 1).toString().padStart(2, '0')}
                      </div>

                      {/* Status indicator */}
                      <div className="absolute top-6 left-6 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.accent} animate-pulse`} />
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{feature.status}</span>
                      </div>

                      {/* Icon container with 3D effect */}
                      <div className="relative mt-8 mb-6">
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                        <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                          <feature.icon className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors">
                          {feature.desc}
                        </p>

                        {/* Capability tags */}
                        <div className="flex flex-wrap gap-2">
                          {feature.tags.map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              className={`px-3 py-1 text-[10px] font-mono font-medium rounded-full bg-gradient-to-r ${feature.accent} bg-opacity-10 text-white/80 border border-white/10 group-hover:border-white/20 transition-all`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom accent line */}
                      <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    </div>
                  </div>

                  {/* Circuit trace connection to next card */}
                  {idx < 8 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-50 transition-opacity" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS — ARCHITECTURE ═══════════════ */}
      <section className="relative z-10 py-28 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 font-mono">ARCHITECTURE</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 tracking-tight">
              How Kavach AI{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">protects</span> your agents
            </h2>
          </div>

          {/* Visual pipeline flow */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
            {[
              { icon: Cpu, label: 'AI Agent', sub: 'GPT / Claude / Gemini', color: 'border-indigo-500/30 text-indigo-400' },
              { icon: null, label: '→', sub: '', color: '' },
              { icon: KavachLogo, label: 'Kavach Proxy', sub: '9-Stage Pipeline', color: 'border-purple-500/40 text-purple-400 ring-2 ring-purple-500/10 bg-purple-500/[0.04] shadow-lg shadow-purple-500/10' },
              { icon: null, label: '→', sub: '', color: '' },
              { icon: Database, label: 'MCP Servers', sub: 'DB / FS / API / Cloud', color: 'border-emerald-500/30 text-emerald-400' },
            ].map((node, idx) => {
              if (node.icon === null) {
                return (
                  <div key={idx} className="hidden md:flex items-center">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-white/10 to-white/5 relative">
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 bg-white/10 rotate-45" />
                    </div>
                  </div>
                )
              }
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center gap-2 px-8 py-6 rounded-2xl border bg-white/[0.02] ${node.color} transition-all min-w-[160px]`}
                >
                  <node.icon className="w-8 h-8" />
                  <span className="text-sm font-bold text-white">{node.label}</span>
                  <span className="text-[11px] text-gray-500 font-mono">{node.sub}</span>
                </div>
              )
            })}
          </div>

          <p className="text-center text-gray-500 text-sm mt-10 max-w-xl mx-auto">
            Kavach AI sits as an inline MCP proxy between your agent and its tools. Every tool call is intercepted, analyzed, and either forwarded or blocked — in under 15ms.
          </p>
        </div>
      </section>

      {/* ═══════════════ DEVELOPER INTEGRATION SECTION ═══════════════ */}
      <section id="integration" className="relative z-10 py-28 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left: Vertical Integration Timeline */}
            <div className="space-y-8 lg:sticky lg:top-28">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 font-mono">DEVELOPER GUIDE</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LIVE</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">v0.1.0</span>
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                  Add Kavach AI to{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    any AI agent
                  </span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Kavach is <strong className="text-gray-300">model-agnostic</strong>. Whether your agent runs on
                  OpenAI, Anthropic, Google Gemini, Llama, Mistral, or any local model — Kavach wraps the
                  execution environment, not the model.
                </p>
              </div>

              {/* Vertical Timeline */}
              <div className="relative pl-8 space-y-6">
                {/* Timeline connector line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-500/50 via-cyan-500/50 to-purple-500/50" />
                
                {[
                  { 
                    step: '01', 
                    title: 'Point your MCP client to the Kavach proxy endpoint', 
                    desc: 'Redirect tool traffic through the Kavach interceptor instead of direct MCP servers.',
                    icon: Zap,
                    status: 'complete',
                    tech: ['MCP', 'REST API']
                  },
                  { 
                    step: '02', 
                    title: 'Configure security policies in the SOC dashboard', 
                    desc: 'Define rules for which tools require approval, which are blocked, and trust thresholds.',
                    icon: Lock,
                    status: 'complete',
                    tech: ['Policy Engine', 'Rules']
                  },
                  { 
                    step: '03', 
                    title: 'Monitor & respond in the Runtime Security Center', 
                    desc: 'View live telemetry, approve escalated actions, and audit every agent decision.',
                    icon: Activity,
                    status: 'active',
                    tech: ['Real-time', 'Dashboard']
                  },
                ].map((s, idx) => (
                  <div key={s.step} className="relative group">
                    {/* Timeline node */}
                    <div className={`absolute left-[-20px] top-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      s.status === 'complete' 
                        ? 'bg-emerald-500/20 border-emerald-500' 
                        : 'bg-cyan-500/20 border-cyan-500 animate-pulse'
                    }`}>
                      {s.status === 'complete' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      )}
                    </div>

                    {/* Glassmorphism step card */}
                    <div className="relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 transition-all duration-300 group-hover:border-white/[0.15] group-hover:shadow-2xl group-hover:shadow-black/50 group-hover:-translate-y-1">
                      {/* Inner glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                      
                      <div className="relative">
                        <div className="flex items-start gap-4">
                          {/* Icon container */}
                          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <s.icon className="w-6 h-6 text-emerald-400" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono text-emerald-400/60">{s.step}</span>
                              {s.status === 'active' && (
                                <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse">ACTIVE</span>
                              )}
                            </div>
                            <h4 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">{s.title}</h4>
                            <p className="text-sm text-gray-400 leading-relaxed mb-3">{s.desc}</p>
                            
                            {/* Tech chips */}
                            <div className="flex flex-wrap gap-2">
                              {s.tech.map((tech, techIdx) => (
                                <span
                                  key={techIdx}
                                  className="px-2 py-1 text-[10px] font-mono font-medium rounded-full bg-white/[0.04] text-gray-400 border border-white/[0.08] group-hover:border-white/[0.15] transition-all"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Technology stack chips */}
              <div className="pt-4">
                <p className="text-xs text-gray-500 font-mono mb-3 uppercase tracking-wider">Compatible with</p>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'FastAPI', 'MCP', 'REST API', 'SDK', 'LangChain', 'CrewAI'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-white/[0.02] text-gray-400 border border-white/[0.06] hover:border-emerald-500/30 hover:text-emerald-400 transition-all cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/runtime"
                  className="group inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  View full integration docs in Security Center
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right: Interactive Code Playground */}
            <div className="space-y-6">
              {/* Code playground container */}
              <div className="relative bg-gradient-to-br from-[#0a0d14] to-[#0c0f1a] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
                {/* Header with tabs */}
                <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono font-medium text-emerald-400">LIVE</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">Interactive Playground</span>
                  </div>
                  
                  {/* Language tabs */}
                  <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1">
                    {['Python', 'JavaScript', 'TypeScript', 'Go'].map((lang) => (
                      <button
                        key={lang}
                        className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                          lang === 'Python' 
                            ? 'bg-white/[0.08] text-white' 
                            : 'text-gray-500 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code editor */}
                <div className="relative">
                  {/* Line numbers */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-white/[0.02] border-r border-white/[0.04] flex flex-col items-center pt-4 text-xs text-gray-600 font-mono select-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                      <span key={n} className="py-0.5">{n}</span>
                    ))}
                  </div>
                  
                  {/* Code content */}
                  <div className="pl-12 pr-6 py-4 text-sm font-mono leading-relaxed">
                    <pre className="text-emerald-400/90">
                      <code>{`from kavach_ai import KavachProxy

# Initialize the proxy
proxy = KavachProxy(
    endpoint="https://api.kavach.ai/v1",
    api_key="your-api-key"
)

# Wrap your MCP client
mcp_client = proxy.wrap(mcp_client)

# Tool calls are now intercepted
result = mcp_client.call_tool(
    name="database_query",
    args={"query": "SELECT * FROM users"}
)

# Result includes security metadata
print(result.decision)  # "ALLOW" or "BLOCK"
print(result.risk_score)  # 0.0 to 1.0
print(result.analysis)  # Full security report`}</code>
                    </pre>
                  </div>

                  {/* Copy button */}
                  <button className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-xs text-gray-400 hover:text-white transition-all">
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>

                {/* Architecture diagram */}
                <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.08]">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-indigo-400" />
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">AI Agent</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-500/50 to-emerald-500/50" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-500/50 to-purple-500/50" />
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <KavachLogo size={24} />
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">Kavach AI</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500/50 to-cyan-500/50" />
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-500/50 to-emerald-500/50" />
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center">
                        <Database className="w-6 h-6 text-cyan-400" />
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">MCP Server</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Execution console */}
              <div className="bg-[#0a0d14] border border-white/[0.08] rounded-3xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-2 bg-white/[0.02] border-b border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-mono text-gray-500">Security Console</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">VERIFIED</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">SECURE</span>
                  </div>
                </div>
                
                <div className="p-4 font-mono text-xs space-y-1 h-32 overflow-y-auto" id="security-console">
                  <div className="text-gray-500">→ Intercepting tool call...</div>
                  <div className="text-emerald-400">✓ Intent Analysis: benign</div>
                  <div className="text-emerald-400">✓ Prompt Injection Scan: clean</div>
                  <div className="text-cyan-400">→ Risk Score: 18/100</div>
                  <div className="text-emerald-400">✓ Decision: ALLOW</div>
                  <div className="text-purple-400">→ Forwarding to MCP...</div>
                  <div className="text-gray-500">→ Response received in 12ms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="relative z-10 py-32 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          {/* Decorative glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[300px] bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Ready to secure your
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                autonomous agents?
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Deploy Kavach AI as your runtime guardrail and give enterprise security teams the confidence to authorize agent autonomy.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/runtime"
                className="group flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-base hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20"
              >
                <Play className="w-4 h-4 fill-current" />
                Launch Live Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white/[0.04] border border-white/[0.08] text-white rounded-xl font-semibold hover:bg-white/[0.07] transition-all"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="relative z-10 border-t border-white/[0.04] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <KavachLogo size={16} />
              </div>
              <span className="text-sm font-bold text-white">Kavach AI</span>
              <span className="text-xs text-gray-600 font-mono">v0.1.0</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/runtime" className="hover:text-white transition-colors">Runtime SOC</Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="#integration" className="hover:text-white transition-colors">Integration</Link>
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            </div>

            <p className="text-xs text-gray-600">&copy; 2026 Kavach AI. Built for the autonomous future.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
