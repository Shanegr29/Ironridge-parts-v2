import { AppHeader } from '@/components/primitives'

export default function ListingsPage() {
  return (
    <>
      <AppHeader title="Listings" />
      <div className="px-4 pt-8 text-center text-ir-text-dim">
        <div className="text-4xl mb-3">◎</div>
        <div className="text-sm">Listings coming in V1.</div>
        <div className="text-xs mt-1 text-ir-text-dim/60">eBay integration after MVP is stable.</div>
      </div>
    </>
  )
}
