'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'donor-lifts', href: '/donor-lifts', icon: '⬡', label: 'Lifts' },
  { id: 'parts',       href: '/parts',       icon: '▦', label: 'Parts' },
  { id: 'listings',    href: '/listings',    icon: '◎', label: 'Listings' },
  { id: 'orders',      href: '/orders',      icon: '◈', label: 'Orders' },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('ir_auth')
    localStorage.removeItem('ir_email')
    window.location.href = '/auth/login'
  }

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-navy border-t border-ir-border z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex h-nav">
        {tabs.map(tab => {
          const active = pathname.startsWith('/' + tab.id)
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-150',
                'text-[10px] font-semibold tracking-[0.05em] uppercase',
                active ? 'text-amber' : 'text-ir-text-dim'
              )}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              {tab.label}
            </button>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-ir-text-dim text-[10px] font-semibold tracking-[0.05em] uppercase"
        >
          <span className="text-xl leading-none">⊗</span>
          Logout
        </button>
      </div>
    </nav>
  )
}
