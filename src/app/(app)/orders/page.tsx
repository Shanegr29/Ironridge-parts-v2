import { AppHeader } from '@/components/primitives'

export default function OrdersPage() {
  return (
    <>
      <AppHeader title="Orders" />
      <div className="px-4 pt-8 text-center text-ir-text-dim">
        <div className="text-4xl mb-3">◈</div>
        <div className="text-sm">Orders coming in V1.</div>
        <div className="text-xs mt-1 text-ir-text-dim/60">Manual order entry after MVP is stable.</div>
      </div>
    </>
  )
}
