'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/donor-lifts'
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#111520', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '28px', color: '#f59e0b', letterSpacing: '3px', textTransform: 'uppercase' }}>⬡ IronRidge</div>
          <div style={{ fontSize: '11px', color: '#a8b2c4', letterSpacing: '3px', textTransform: 'uppercase', marginTop: '4px' }}>Parts Department</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: '#a8b2c4', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ height: '52px', padding: '0 16px', background: '#2f3750', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: '#e8eaf0', fontSize: '16px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: '#a8b2c4', textTransform: 'uppercase', letterSpacing: '1px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ height: '52px', padding: '0 16px', background: '#2f3750', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: '#e8eaf0', fontSize: '16px', outline: 'none' }}
            />
          </div>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', color: '#ef4444', fontSize: '13px' }}>
              {error}
            </div>
          )}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ height: '56px', background: '#f59e0b', color: '#111', border: 'none', borderRadius: '8px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
