'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
  Shield,
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
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
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

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Network,
                title: 'MCP Interception',
                desc: 'Inline proxy captures every outgoing tool call at the protocol layer before execution.',
                accent: 'from-indigo-500 to-blue-500',
                span: ''
              },
              {
                icon: Eye,
                title: 'Intent Analysis',
                desc: 'AI-powered semantic classification determines whether an action is benign, suspicious, or malicious.',
                accent: 'from-purple-500 to-pink-500',
                span: ''
              },
              {
                icon: Fingerprint,
                title: 'Prompt Injection Detection',
                desc: 'Regex signatures, vector-space scanning, and LLM-based classifiers detect override and jailbreak attempts.',
                accent: 'from-red-500 to-orange-500',
                span: 'md:col-span-2 lg:col-span-1'
              },
              {
                icon: Activity,
                title: 'Behavioral Profiling',
                desc: 'Baseline agent behavior models flag anomalous tool argument patterns and deviation scores.',
                accent: 'from-amber-500 to-yellow-500',
                span: ''
              },
              {
                icon: BarChart2,
                title: 'Dynamic Risk Scoring',
                desc: 'Weighted risk factors including intent severity, injection probability, tool risk, and trust decay.',
                accent: 'from-emerald-500 to-teal-500',
                span: ''
              },
              {
                icon: Shield,
                title: 'Trust Engine',
                desc: 'Evolving trust scores decay with violations and recover with compliant behavior over time.',
                accent: 'from-cyan-500 to-blue-500',
                span: ''
              },
              {
                icon: Lock,
                title: 'Policy Engine',
                desc: 'Configurable rule sets with conditional logic, priority levels, and automated enforcement actions.',
                accent: 'from-violet-500 to-purple-500',
                span: ''
              },
              {
                icon: UserCheck,
                title: 'Human-in-the-Loop',
                desc: 'Critical operations halt the pipeline and require manual security analyst approval before proceeding.',
                accent: 'from-pink-500 to-rose-500',
                span: ''
              },
              {
                icon: Zap,
                title: 'Execution Decision',
                desc: 'Final binary verdict — forward approved calls to MCP servers or block and log the violation.',
                accent: 'from-indigo-500 to-purple-600',
                span: ''
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-6 transition-all duration-300 cursor-default ${feature.span}`}
              >
                {/* Hover glow */}
                <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 blur-xl`} />

                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
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
              { icon: Shield, label: 'Kavach Proxy', sub: '9-Stage Pipeline', color: 'border-purple-500/40 text-purple-400 ring-2 ring-purple-500/10 bg-purple-500/[0.04] shadow-lg shadow-purple-500/10' },
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

            {/* Left: Description */}
            <div className="space-y-6 lg:sticky lg:top-28">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 font-mono">DEVELOPER GUIDE</span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Add Kavach AI to{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  any AI agent
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Kavach is <strong className="text-gray-300">model-agnostic</strong>. Whether your agent runs on
                OpenAI, Anthropic, Google Gemini, Llama, Mistral, or any local model — Kavach wraps the
                execution environment, not the model. Integration takes three steps:
              </p>

              <div className="space-y-4 pt-4">
                {[
                  { step: '01', title: 'Point your MCP client to the Kavach proxy endpoint', desc: 'Redirect tool traffic through the Kavach interceptor instead of direct MCP servers.' },
                  { step: '02', title: 'Configure security policies in the SOC dashboard', desc: 'Define rules for which tools require approval, which are blocked, and trust thresholds.' },
                  { step: '03', title: 'Monitor & respond in the Runtime Security Center', desc: 'View live telemetry, approve escalated actions, and audit every agent decision.' },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{s.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Link
                  href="/runtime"
                  className="group inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  View full integration docs in Security Center
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right: Code snippets */}
            <div className="space-y-5">
              {integrationSnippets.map((snippet, idx) => (
                <div key={idx} className="relative bg-[#0c0f1a] border border-white/[0.06] rounded-2xl overflow-hidden group">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                    <div>
                      <h4 className="text-sm font-bold text-white">{snippet.title}</h4>
                      <p className="text-[11px] text-gray-500">{snippet.subtitle}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(snippet.code, idx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-[11px] text-gray-400 hover:text-white transition-all"
                    >
                      {copiedBlock === idx ? (
                        <><Check className="w-3 h-3 text-emerald-400" /> Copied</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copy</>
                      )}
                    </button>
                  </div>
                  {/* Code */}
                  <pre className="p-5 text-[12px] font-mono leading-[1.7] text-emerald-400/90 overflow-x-auto">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              ))}
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
                <Shield className="w-4 h-4 text-white" />
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
