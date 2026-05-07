'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const bdr='1px solid rgba(255,255,255,0.07)',bg='#1a1f2e',bgL='#2f3750',bgMid='#252b3b',txt='#e8eaf0',dim='#a8b2c4',amb='#f59e0b'
const sec={padding:'20px 16px 0'} as any
const secT={fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase' as any,color:dim,marginBottom:'14px',paddingBottom:'8px',borderBottom:bdr}
const row={display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'} as any
const meta={display:'flex',flexDirection:'column' as any,gap:'3px',marginBottom:'14px'}
const mLbl={fontSize:'10px',color:dim,textTransform:'uppercase' as any,letterSpacing:'1px'}
const mVal={fontSize:'15px',color:txt,fontWeight:500}

const STATUS_LABELS: Record<string,string> = {
  pending_intake:'Pending Assessment',ready_for_teardown:'Ready for Teardown',
  in_teardown:'In Teardown',mostly_complete:'Mostly Complete',finished:'Finished',scrap_only:'Scrap Only'
}
const STATUS_COLORS: Record<string,string> = {
  pending_intake:'#3b82f6',ready_for_teardown:amb,in_teardown:amb,
  mostly_complete:'#22c55e',finished:'#a8b2c4',scrap_only:'#ef4444'
}

export default function Page({ params }: { params: { id: string } }) {
  const [lift, setLift] = useState<any>(null)
  const [parts, setParts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const sb = createClient()
      const { data: l } = await sb.from('donor_lift').select('*').eq('id', params.id).single()
      const { data: p } = await sb.from('part').select('*').eq('donor_lift_id', params.id).order('created_at', { ascending: false })
      setLift(l)
      setParts(p || [])
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) return (
    <div style={{minHeight:'100dvh',background:bg,display:'flex',alignItems:'center',justifyContent:'center',color:dim,fontSize:'14px'}}>
      Loading...
    </div>
  )

  if (!lift) return (
    <div style={{minHeight:'100dvh',background:bg,display:'flex',alignItems:'center',justifyContent:'center',color:dim,fontSize:'14px'}}>
      Lift not found.
    </div>
  )

  const pct = lift.parts_count > 0 ? Math.round((lift.parts_sold_count / lift.parts_count) * 100) : 0
  const profit = (lift.revenue_to_date || 0) - (lift.total_cost || 0)

  return (
    <div style={{minHeight:'100dvh',background:bg,paddingBottom:'80px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'16px',background:'#111520',borderBottom:bdr,position:'sticky',top:0,zIndex:30}}>
        <div onClick={()=>window.location.href='/donor-lifts'} style={{width:'40px',height:'40px',borderRadius:'8px',border:bdr,background:bgL,color:txt,fontSize:'20px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>←</div>
        <div>
          <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'20px',color:txt,textTransform:'uppercase',letterSpacing:'1px'}}>{lift.make} {lift.model}</div>
          <div style={{fontSize:'12px',color:dim}}>{lift.year} · S/N: {lift.serial_number || '—'}</div>
        </div>
        <div style={{marginLeft:'auto',padding:'4px 10px',borderRadius:'4px',background:STATUS_COLORS[lift.status]+'25',color:STATUS_COLORS[lift.status],fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'1px'}}>
          {STATUS_LABELS[lift.status] || lift.status}
        </div>
      </div>

      {/* Financials */}
      <div style={sec}>
        <div style={secT}>Financials</div>
        <div style={row}>
          <div style={{background:bgMid,border:bdr,borderRadius:'8px',padding:'14px'}}>
            <div style={{fontSize:'10px',color:dim,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px'}}>Total Cost</div>
            <div style={{fontFamily:'Barlow Condensed,sans-serif',fontSize:'24px',fontWeight:700,color:amb}}>${Number(lift.total_cost||0).toLocaleString()}</div>
          </div>
          <div style={{background:bgMid,border:bdr,borderRadius:'8px',padding:'14px'}}>
            <div style={{fontSize:'10px',color:dim,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px'}}>Revenue</div>
            <div style={{fontFamily:'Barlow Condensed,sans-serif',fontSize:'24px',fontWeight:700,color:'#22c55e'}}>${Number(lift.revenue_to_date||0).toLocaleString()}</div>
          </div>
          <div style={{background:bgMid,border:bdr,borderRadius:'8px',padding:'14px'}}>
            <div style={{fontSize:'10px',color:dim,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px'}}>Profit</div>
            <div style={{fontFamily:'Barlow Condensed,sans-serif',fontSize:'24px',fontWeight:700,color:profit>=0?'#22c55e':'#ef4444'}}>${Math.round(profit).toLocaleString()}</div>
          </div>
          <div style={{background:bgMid,border:bdr,borderRadius:'8px',padding:'14px'}}>
            <div style={{fontSize:'10px',color:dim,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px'}}>Parts</div>
            <div style={{fontFamily:'Barlow Condensed,sans-serif',fontSize:'24px',fontWeight:700,color:txt}}>{lift.parts_count||0}</div>
          </div>
        </div>
        {lift.parts_count > 0 && (
          <div style={{marginTop:'14px'}}>
            <div style={{height:'6px',background:bgL,borderRadius:'3px',overflow:'hidden'}}>
              <div style={{height:'6px',background:amb,borderRadius:'3px',width:pct+'%',transition:'width 0.3s'}}/>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'4px',fontSize:'11px',color:dim}}>
              <span>{lift.parts_count} parts catalogued</span>
              <span>{lift.parts_sold_count||0} sold</span>
            </div>
          </div>
        )}
      </div>

      {/* Details */}
      <div style={sec}>
        <div style={secT}>Unit Details</div>
        <div style={row}>
          <div style={meta}><div style={mLbl}>Fuel Type</div><div style={mVal}>{lift.fuel_type||'—'}</div></div>
          <div style={meta}><div style={mLbl}>Capacity</div><div style={mVal}>{lift.capacity_lbs?lift.capacity_lbs+' lbs':'—'}</div></div>
          <div style={meta}><div style={mLbl}>Mast Type</div><div style={mVal}>{lift.mast_type||'—'}</div></div>
          <div style={meta}><div style={mLbl}>Mast Height</div><div style={mVal}>{lift.mast_height_inches?lift.mast_height_inches+'"':'—'}</div></div>
          <div style={meta}><div style={mLbl}>Tire Type</div><div style={mVal}>{lift.tire_type||'—'}</div></div>
          <div style={meta}><div style={mLbl}>Hour Meter</div><div style={mVal}>{lift.hour_meter_reading?lift.hour_meter_reading+' hrs':'—'}</div></div>
          <div style={meta}><div style={mLbl}>Acquired</div><div style={mVal}>{lift.intake_date||'—'}</div></div>
          <div style={meta}><div style={mLbl}>Source</div><div style={mVal}>{lift.acquisition_source||'—'}</div></div>
        </div>
        {lift.arrival_condition_notes && (
          <div style={{background:bgMid,border:bdr,borderRadius:'8px',padding:'14px',marginTop:'4px'}}>
            <div style={mLbl}>Condition Notes</div>
            <div style={{fontSize:'14px',color:txt,marginTop:'6px',lineHeight:1.5}}>{lift.arrival_condition_notes}</div>
          </div>
        )}
      </div>

      {/* Arrival Photos */}
      {lift.arrival_photos?.length > 0 && (
        <div style={sec}>
          <div style={secT}>Arrival Photos</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
            {lift.arrival_photos.map((url:string,i:number)=>(
              <div key={i} style={{aspectRatio:'1',borderRadius:'8px',overflow:'hidden'}}>
                <img src={url} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parts */}
      <div style={sec}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px',paddingBottom:'8px',borderBottom:bdr}}>
          <div style={secT}>Parts ({parts.length})</div>
          <a href={'/parts/new?lift='+lift.id} style={{padding:'8px 14px',background:amb,color:'#111',borderRadius:'8px',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'12px',letterSpacing:'1px',textTransform:'uppercase',textDecoration:'none'}}>+ Add Part</a>
        </div>
        {parts.length === 0 ? (
          <div style={{textAlign:'center',padding:'32px',color:dim,fontSize:'14px'}}>
            <div style={{fontSize:'32px',marginBottom:'8px'}}>▦</div>
            No parts catalogued yet. Tap + Add Part to start.
          </div>
        ) : (
          <div style={{background:bgMid,border:bdr,borderRadius:'8px',overflow:'hidden'}}>
            {parts.map((p:any,i:number)=>{
              const gradeColor = (({'A_tested_working':'#22c55e','B_takeout_untested':amb,'C_for_parts_or_repair':'#f97316','D_core_only':'#ef4444'}) as Record<string,string>)[p.condition_grade]||dim
const gradeLabel = (({'A_tested_working':'A','B_takeout_untested':'B','C_for_parts_or_repair':'C','D_core_only':'D'}) as Record<string,string>)[p.condition_grade]||'?'
              return (
             <a key={p.id} href={'/parts/'+p.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'13px 14px',borderTop:i>0?bdr:'none',textDecoration:'none'}}>
  <div style={{width:'32px',height:'32px',borderRadius:'6px',background:gradeColor+'25',color:gradeColor,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Barlow Condensed,sans-serif',fontWeight:900,fontSize:'16px',flexShrink:0}}>{gradeLabel}</div>
  <div style={{flex:1,minWidth:0}}>
    <div style={{fontWeight:600,fontSize:'14px',color:txt,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.part_type}{p.part_subtype?' — '+p.part_subtype:''}</div>
    <div style={{fontSize:'11px',color:dim,marginTop:'2px'}}>{p.bin_location_id||'No location'} · {p.status?.replace(/_/g,' ')}</div>
  </div>
  <div style={{textAlign:'right',flexShrink:0}}>
    <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'16px',color:txt}}>${p.asking_price||'—'}</div>
  </div>
</a>
          </div>
        )}
      </div>
    </div>
  )
}
