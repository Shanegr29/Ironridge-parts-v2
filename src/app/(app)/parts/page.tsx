import { createClient } from '@/lib/supabase/server'
import { AppHeader, SectionTitle, GradeBox, StatusBadge } from '@/components/primitives'
import type { PartFull } from '@/types/database'

export default async function PartsPage() {
  const supabase = createClient()
  const { data: rawParts } = await supabase
    .from('part_full')
    .select('*')
    .neq('status', 'scrapped')
    .order('created_at', { ascending: false })

  const parts = rawParts as PartFull[] | null

  const available = parts?.filter(p => p.status === 'pulled_not_listed').length ?? 0
  const listed = parts?.filter(p => p.status === 'listed').length ?? 0
  const sold = parts?.filter(p => p.status === 'sold' || p.status === 'shipped').length ?? 0

  return (
    <>
      <AppHeader title="Parts Inventory" />
      <div className="px-4 pt-4">
        <div className="flex gap-3 mb-5 overflow-x-auto no-scrollbar pb-1">
          <div className="bg-steel-mid border border-ir-border rounded-ir px-4 py-3 flex-shrink-0 text-center min-w-[80px]">
            <div className="font-display font-bold text-2xl text-ir-green">{available}</div>
            <div className="text-[10px] uppercase tracking-wide text-ir-text-dim mt-0.5">In Stock</div>
          </div>
          <div className="bg-steel-mid border border-ir-border rounded-ir px-4 py-3 flex-shrink-0 text-center min-w-[80px]">
            <div className="font-display font-bold text-2xl text-ir-blue">{listed}</div>
            <div className="text-[10px] uppercase tracking-wide text-ir-text-dim mt-0.5">Listed</div>
          </div>
          <div className="bg-steel-mid border border-ir-border rounded-ir px-4 py-3 flex-shrink-0 text-center min-w-[80px]">
            <div className="font-display font-bold text-2xl text-ir-text-dim">{sold}</div>
            <div className="text-[10px] uppercase tracking-wide text-ir-text-dim mt-0.5">Sold</div>
          </div>
        </div>

        <SectionTitle>All Parts</SectionTitle>

        {!parts || parts.length === 0 ? (
          <div className="text-center py-16 text-ir-text-dim">
            <div className="text-4xl mb-3">▦</div>
            <div className="text-sm">No parts yet.</div>
          </div>
        ) : (
          <div className="bg-steel-mid border border-ir-border rounded-ir overflow-hidden mb-4">
            {parts.map((part, i) => (
              <a key={part.id}
                href={`/parts/${part.id}`}
                className={`flex items-center gap-3 px-4 min-h-[60px] active:bg-white/5 ${i > 0 ? 'border-t border-ir-border' : ''}`}>
                <GradeBox grade={part.condition_grade} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-ir-text truncate">{part.part_type}</div>
                  <div className="text-xs text-ir-text-dim mt-0.5">
                    {part.lift_make} {part.lift_model} · {part.bin_label ?? 'No location'}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-display font-bold text-base">${part.asking_price ?? '—'}</div>
                  <StatusBadge status={part.status} />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
