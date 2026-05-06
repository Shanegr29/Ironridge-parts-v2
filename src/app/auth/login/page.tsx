'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/donor-lifts')
      router.refresh()
    }
  }

  return (
    <div className="min-h-dvh bg-navy flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="font-display font-black text-3xl text-amber tracking-widest uppercase">
            ⬡ IronRidge
          </div>
          <div className="text-xs text-ir-text-dim tracking-[0.2em] uppercase mt-1">
            Parts Department
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-label uppercase text-ir-text-dim">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@ironridge.com"
              className="min-h-touch bg-steel-light border border-ir-border rounded-ir px-4 text-ir-text text-base focus:outline-none focus:border-amber"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label uppercase text-ir-text-dim">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="min-h-touch bg-steel-light border border-ir-border rounded-ir px-4 text-ir-text text-base focus:outline-none focus:border-amber"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && (
            <div className="text-ir-red text-sm bg-red-500/10 border border-red-500/20 rounded-ir px-4 py-3">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full min-h-touch-lg bg-amber text-navy font-display font-bold text-base tracking-widest uppercase rounded-ir disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
