import { BottomNav } from '@/components/primitives/BottomNav'
import { OnlineIndicator } from '@/components/primitives'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-dvh max-w-[480px] mx-auto relative">
      <OnlineIndicator />
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: '72px' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

