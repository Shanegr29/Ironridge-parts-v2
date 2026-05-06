Now here's file 2 — src/app/(app)/parts/[id]/page.tsx:
Go to GitHub → src/app/(app)/parts/ → Add file → Create new file → type [id]/page.tsx → use Ctrl+A then Ctrl+C to copy → paste → confirm last line is } → commit:
tsx'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const bg='#1a1f2e',bgL='#2f3750',bgMid='#252b3b',txt='#e8eaf0',dim='#a8b2c4',amb='#f59e0b',bdr='1px solid rgba(255,255,255,0.07)'
const sec={padding:'20px 16px 0'} as any
const secT={fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase' as any,color:dim,marginBottom:'14px',paddingBottom:'8px',borderBottom:bdr}
const row={display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'} as any
const meta={display:'flex',flexDirection:'column' as any,gap:'3px',marginBottom:'14px'}
const mLbl={fontSize:'10px',color:dim,textTransform:'uppercase' as any,letterSpacing:'1px'}
const mVal={fontSize:'15px',color:txt,fontWeight:500}
const inp={height:'56px',padding:'0 16px',background:bgL,border:bdr,borderRadius:'8px',color:txt,fontSize:'16px',outline:'none',width:'100%'} as any

const GRADE_COLOR:Record<string,string> = {A_tested_working:'#22c55e',B_takeout_untested:amb,C_for_parts_or_repair:'#f97316',D_core_only:'#ef4444'}
const GRADE_LABEL:Record<string,string> = {A_tested_working:'A — Tested Working',B_takeout_untested:'B — Takeout Untested',C_for_parts_or_repair:'C — For Parts/Repair',D_core_only:'D — Core Only'}
const STATUS_COLOR:Record<string,string> = {pulled_not_listed:'#22c55e',listed:'#3b82f6',sold:dim,shipped:'#22c55e',reserved:amb,returned:'#ef4444',scrapped:dim}
const STATUS_LABEL:Record<string,string> = {pulled_not_listed:'In Stock',listed:'Listed',sold:'Sold',shipped:'Shipped',reserved:'Reserved',returned:'Returned',scrapped:'Scrapped'}

export default function Page({ params }: { params: { id: string } }) {
  const [part, setPart] = useState<any>(null)
  const [lift, setLift] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'details'|'sell'|'reserve'>('details')
  const [sellPrice, setSellPrice] = useState('')
  const [customer, setCustomer] = useState('')
  const [woNumber, setWoNumber] = useState('')
  const [working, setWorking] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const load = async () => {
      const sb = createClient()
      const {data:p} = await sb.from('part').select('*').eq('id',params.id).single()
      if (p) {
        setPart(p)
        setSellPrice(p.asking_price||'')
        const {data:l} = await sb.from('donor_lift').select('id,make,model,year').eq('id',p.donor_lift_id).single()
        setLift(l)
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  const markSold = async () => {
    if (!sellPrice) { setMsg('Enter a sale price.'); return }
    setWorking(true)
    const sb = createClient()
    await (sb.from('part') as any).update({ status:'sold', asking_price:parseFloat(sellPrice) }).eq('id',params.id)
    setMsg('Marked as sold!')
    setPart((p:any) => ({...p, status:'sold'}))
    setWorking(false)
    setTab('details')
  }

  const markReserved = async () => {
    if (!woNumber) { setMsg('Enter a work order number.'); return }
    setWorking(true)
    const sb = createClient()
    await (sb.from('part') as any).update({ status:'reserved' }).eq('id',params.id)
    setMsg('Reserved for '+woNumber)
    setPart((p:any) => ({...p, status:'reserved'}))
    setWorking(false)
    setTab('details')
  }

  const markAvailable = async () => {
    setWorking(true)
    const sb = createClient()
    await (sb.from('part') as any).update({ status:'pulled_not_listed' }).eq('id',params.id)
    setPart((p:any) => ({...p, status:'pulled_not_listed'}))
    setWorking(false)
  }

  if (loading) return <div style={{minHeight:'100dvh',background:bg,display:'flex',alignItems:'center',justifyContent:'center',color:dim}}>Loading...</div>
  if (!part) return <div style={{minHeight:'100dvh',background:bg,display:'flex',alignItems:'center',justifyContent:'center',color:dim}}>Part not found.</div>

  const gc = GRADE_COLOR[part.condition_grade]||dim
  const gl = GRADE_LABEL[part.condition_grade]||part.condition_grade
  const sc = STATUS_COLOR[part.status]||dim
  const sl = STATUS_LABEL[part.status]||part.status

  return (
    <div style={{minHeight:'100dvh',background:bg,paddingBottom:'100px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'16px',background:'#111520',borderBottom:bdr,position:'sticky',top:0,zIndex:30}}>
        <div onClick={()=>window.history.back()} style={{width:'40px',height:'40px',borderRadius:'8px',border:bdr,background:bgL,color:txt,fontSize:'20px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>←</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'20px',color:txt,textTransform:'uppercase',letterSpacing:'1px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{part.part_type}</div>
          {lift && <div style={{fontSize:'12px',color:dim}}>{lift.year} {lift.make} {lift.model}</div>}
        </div>
        <div style={{padding:'4px 10px',borderRadius:'4px',background:sc+'25',color:sc,fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',flexShrink:0}}>{sl}</div>
      </div>

      <div style={{padding:'16px',display:'flex',gap:'12px'}}>
        <div style={{width:'64px',height:'64px',borderRadius:'10px',background:gc+'20',color:gc,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Barlow Condensed,sans-serif',fontWeight:900,fontSize:'32px',flexShrink:0}}>{gl[0]}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:'13px',color:dim,marginBottom:'2px'}}>{gl}</div>
          <div style={{fontFamily:'Barlow Condensed,sans-serif',fontSize:'32px',fontWeight:700,color:txt,lineHeight:'1'}}>{part.asking_price?'$'+Number(part.asking_price).toLocaleString():'No price set'}</div>
          {part.minimum_acceptable_price && <div style={{fontSize:'12px',color:dim,marginTop:'2px'}}>Min: ${Number(part.minimum_acceptable_price).toLocaleString()}</div>}
        </div>
      </div>

      {part.status==='pulled_not_listed' && (
        <div style={{padding:'0 16px',display:'flex',gap:'10px',marginBottom:'4px'}}>
          <button onClick={()=>setTab('sell')} style={{flex:1,height:'52px',background:amb,color:'#111',border:'none',borderRadius:'8px',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'14px',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer'}}>Mark Sold</button>
          <button onClick={()=>setTab('reserve')} style={{flex:1,height:'52px',background:bgL,color:txt,border:bdr,borderRadius:'8px',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'14px',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer'}}>Reserve</button>
        </div>
      )}
      {part.status==='reserved' && (
        <div style={{padding:'0 16px',marginBottom:'4px'}}>
          <button onClick={markAvailable} style={{width:'100%',height:'52px',background:bgL,color:txt,border:bdr,borderRadius:'8px',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'14px',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer'}}>Mark Available</button>
        </div>
      )}

      {tab==='sell' && (
        <div style={{margin:'16px',background:bgMid,border:bdr,borderRadius:'8px',padding:'16px'}}>
          <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'13px',letterSpacing:'2px',textTransform:'uppercase',color:dim,marginBottom:'12px'}}>Record Sale</div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <input style={inp} placeholder="Customer name / company" value={customer} onChange={e=>setCustomer(e.target.value)}/>
            <input style={inp} type="number" placeholder={'Sale price (listed: $'+(part.asking_price||0)+')'} value={sellPrice} onChange={e=>setSellPrice(e.target.value)}/>
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={()=>setTab('details')} style={{flex:1,height:'52px',background:bgL,color:txt,border:bdr,borderRadius:'8px',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'13px',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer'}}>Cancel</button>
              <button onClick={markSold} disabled={working} style={{flex:1,height:'52px',background:amb,color:'#111',border:'none',borderRadius:'8px',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'13px',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer'}}>{working?'Saving...':'Confirm Sale'}</button>
            </div>
          </div>
        </div>
      )}

      {tab==='reserve' && (
        <div style={{margin:'16px',background:bgMid,border:bdr,borderRadius:'8px',padding:'16px'}}>
          <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'13px',letterSpacing:'2px',textTransform:'uppercase',color:dim,marginBottom:'12px'}}>Reserve for Work Order</div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <input style={inp} placeholder="Work Order # e.g. WO-2248" value={woNumber} onChange={e=>setWoNumber(e.target.value)}/>
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={()=>setTab('details')} style={{flex:1,height:'52px',background:bgL,color:txt,border:bdr,borderRadius:'8px',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'13px',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer'}}>Cancel</button>
              <button onClick={markReserved} disabled={working} style={{flex:1,height:'52px',background:amb,color:'#111',border:'none',borderRadius:'8px',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'13px',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer'}}>{working?'Saving...':'Reserve'}</button>
            </div>
          </div>
        </div>
      )}

      {msg && <div style={{margin:'0 16px 8px',background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:'8px',padding:'10px 14px',color:'#22c55e',fontSize:'13px'}}>{msg}</div>}

      <div style={sec}>
        <div style={secT}>Part Details</div>
        <div style={row}>
          <div style={meta}><div style={mLbl}>Category</div><div style={mVal}>{part.description||'—'}</div></div>
          <div style={meta}><div style={mLbl}>OEM Part #</div><div style={mVal}>{part.oem_part_number||'—'}</div></div>
          <div style={meta}><div style={mLbl}>Weight</div><div style={mVal}>{part.weight_lbs?part.weight_lbs+' lbs':'—'}</div></div>
          <div style={meta}><div style={mLbl}>Status</div><div style={mVal}>{sl}</div></div>
        </div>
        {part.condition_notes && (
          <div style={{background:bgMid,border:bdr,borderRadius:'8px',padding:'14px',marginBottom:'14px'}}>
            <div style={mLbl}>Condition Notes</div>
            <div style={{fontSize:'14px',color:txt,marginTop:'6px',lineHeight:'1.5'}}>{part.condition_notes}</div>
          </div>
        )}
        {part.compatible_models?.length > 0 && (
          <div style={{background:bgMid,border:bdr,borderRadius:'8px',padding:'14px',marginBottom:'14px'}}>
            <div style={mLbl}>Compatible Models</div>
            <div style={{fontSize:'14px',color:txt,marginTop:'6px'}}>{part.compatible_models.join(', ')}</div>
          </div>
        )}
      </div>

      {part.photos?.length > 0 && (
        <div style={sec}>
          <div style={secT}>Photos</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
            {part.photos.map((url:string,i:number)=>(
              <div key={i} style={{aspectRatio:'1',borderRadius:'8px',overflow:'hidden'}}>
                <img src={url} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
