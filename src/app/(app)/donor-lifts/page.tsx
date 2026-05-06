import { createClient } from '@/lib/supabase/server'
import { AppHeader, SectionTitle, StatCard, StatusBadge, ProgressBar } from '@/components/primitives'
import type { DonorLiftSummary } from '@/types/database'

export default async function DonorLiftsPage() {
  const supabase = createClient()
  const { data: rawLifts } = await supabase
    .from('donor_lift_summary')
    .select('*')
    .order('created_at', { ascending: false })

  const lifts = rawLifts as DonorLiftSummary[] | null

  const totalLifts = lifts?.length ?? 0
  const totalRevenue = lifts?.reduce((s, l) => s + (l.revenue_to_date ?? 0), 0) ?? 0
  const totalCost = lifts?.reduce((s, l) => s + (l.total_cost ?? 0), 0) ?? 0
  const totalParts = lifts?.reduce((s, l) => s + (l.parts_count ?? 0), 0) ?? 0

  return (
    <>
      <AppHeader title="Source Units" />
      <div className="px-4 pt-4">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatCard label="Total Lifts" value={totalLifts} />
          <StatCard label="Total Parts" value={totalParts} />
          <StatCard
            label="Revenue"
            value={`$${Math.round(totalRevenue).toLocaleString()}`}
            valueColor="green"
          />
          <StatCard
            label="Invested"
            value={`$${Math.round(totalCost).toLocaleString()}`}
            valueColor="amber"
          />
        </div>

        <SectionTitle>Donor Lifts</SectionTitle>

        {!lifts || lifts.length === 0 ? (
          <div className="text-center py-16 text-ir-text-dim">
            <div className="text-4xl mb-3">⬡</div>
            <div className="text-sm">No donor lifts yet.</div>
            <div className="text-xs mt-1">Tap + to log your first unit.</div>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {lifts.map(lift => (
              <LiftCard key={lift.id} lift={lift} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function LiftCard({ lift }: { lift: DonorLiftSummary }) {
  const pct = lift.parts_count > 0
    ? Math.round((lift.parts_sold_count / lift.parts_count) * 100)
    : 0

  return (
    <a href={`/donor-lifts/${lift.id}`}
      className="block bg-steel-mid border border-ir-border rounded-ir overflow-hidden active:bg-white/5">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-display font-bold text-lg uppercase text-ir-text">
              {lift.make} {lift.model}
            </div>
            <div className="text-xs text-ir-text-dim mt-0.5">
              {lift.year} · S/N: {lift.serial_number ?? '—'} · {lift.intake_date}
            </div>
          </div>
          <StatusBadge status={lift.status} />
        </div>

        <div className="flex gap-4 mb-3 text-sm">
          <div>
            <span className="text-[10px] uppercase tracking-wide text-ir-text-dim block">Cost</span>
            ${lift.total_cost.toLocaleString()}
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wide text-ir-text-dim block">Revenue</span>
            <span className="text-ir-green">${lift.revenue_to_date.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wide text-ir-text-dim block">Profit</span>
            <span className={lift.gross_profit >= 0 ? 'text-ir-green' : 'text-ir-red'}>
              ${Math.round(lift.gross_profit).toLocaleString()}
            </span>
          </div>
        </div>

        <ProgressBar
          value={pct}
          leftLabel={`${lift.parts_count} parts`}
          rightLabel={`${lift.parts_sold_count} sold`}
        />
      </div>
    </a>
  )
}
