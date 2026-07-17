'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const tokens = await api.login(email, password)
      console.log('Login successful:', tokens)
      
      // Set auth state
      setAuth({ email, full_name: '', id: '', role: 'user' } as any, tokens)
      
      router.push('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      let errorMessage = 'Login failed. Please check your credentials and try again.'
      
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'object' && err !== null) {
        const errorObj = err as any
        errorMessage = errorObj.message || errorObj.detail || errorObj.error || 'Invalid email or password'
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050816] via-[#0E1424] to-[#050816]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4F7CFF]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md px-8">
        <div className="bg-[#0E1424]/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-[#4F7CFF]" />
              <span className="text-2xl font-bold text-white">Kavach AI</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#050816]/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/50 text-white placeholder-gray-500 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#050816]/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/50 text-white placeholder-gray-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#4F7CFF]/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#4F7CFF] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
