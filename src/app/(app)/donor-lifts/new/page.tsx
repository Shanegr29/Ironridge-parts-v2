tsx'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const FUELS = [['lpg','LPG / Propane'],['gasoline','Gasoline'],['diesel','Diesel'],['electric_lead_acid','Electric — Lead Acid'],['electric_lithium','Electric — Lithium']]
const MASTS = [['single','Single Stage'],['two_stage','Two Stage'],['three_stage','Three Stage'],['quad','Quad'],['telescopic','Telescopic']]
const TIRES = [['cushion','Cushion'],['pneumatic','Pneumatic'],['solid_pneumatic','Solid Pneumatic'],['foam_filled','Foam Filled']]

const bg='#1a1f2e',bgMid='#252b3b',bgL='#2f3750',amb='#f59e0b',bdr='1px solid rgba(255,255,255,0.07)',txt='#e8eaf0',dim='#a8b2c4'
const inp={height:'56px',padding:'0 16px',background:bgL,border:bdr,borderRadius:'8px',color:txt,fontSize:'16px',outline:'none',width:'100%'} as any
const sel={...inp,appearance:'none' as any}
const lbl={fontSize:'11px',color:dim,textTransform:'uppercase' as any,letterSpacing:'1px',fontWeight:600}
const fld={display:'flex',flexDirection:'column' as any,gap:'6px',marginBottom:'16px'}
const row={display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'} as any
const sec={padding:'20px 16px 0'} as any
const secT={fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase' as any,color:dim,marginBottom:'14px',paddingBottom:'8px',borderBottom:bdr}
const slot={aspectRatio:'1',borderRadius:'8px',border:'2px dashed rgba(255,255,255,0.15)',background:bgMid,display:'flex',flexDirection:'column' as any,alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden',position:'relative' as any}

export default function Page() {
  const [f,sf]=useState({make:'',model:'',year:'',serial:'',hours:'',fuel:'',cap:'',mast:'',mastH:'',tire:'',price:'',transport:'',source:'',date:new Date().toISOString().slice(0,10),notes:'',status:'pending_intake'})
  const [photos,setPhotos]=useState<string[]>([])
  const [files,setFiles]=useState<File[]>([])
  const [saving,setSaving]=useState(false)
  const [err,setErr]=useState('')
  const [mic,setMic]=useState(false)
  const ref=useRef<HTMLInputElement>(null)
  const set=(k:string)=>(e:any)=>sf(p=>({...p,[k]:e.target.value}))

  const addPhoto=(e:React.ChangeEvent<HTMLInputElement>)=>{
    Array.from(e.target.files||[]).forEach(file=>{
      const r=new FileReader()
      r.onload=ev=>{setPhotos(p=>[...p,ev.target?.result as string]);setFiles(p=>[...p,file])}
      r.readAsDataURL(file)
    })
  }

  const voice=()=>{
    const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition
    if(!SR){alert('Try Chrome for voice input');return}
    const r=new SR();r.lang='en-US';setMic(true)
    r.onresult=(e:any)=>{sf(p=>({...p,notes:p.notes?(p.notes+' '+e.results[0][0].transcript):e.results[0][0].transcript}));setMic(false)}
    r.onerror=()=>setMic(false);r.onend=()=>setMic(false);r.start()
  }

  const save=async()=>{
    if(!f.make||!f.model||!f.price){setErr('Make, Model, and Purchase Price are required.');return}
    setSaving(true);setErr('')
    try{
      const sb=createClient()
      const urls:string[]=[]
      for(const file of files){
        const path='donor-lifts/'+Date.now()+'-'+Math.random().toString(36).slice(2)+'.'+file.name.split('.').pop()
        const {error:ue}=await sb.storage.from('donor-lift-photos').upload(path,file)
        if(!ue){const {data}=sb.storage.from('donor-lift-photos').getPublicUrl(path);urls.push(data.publicUrl)}
      }
      const {error:ie}=await sb.from('donor_lift').insert({
        make:f.make,model:f.model,
        year:f.year?parseInt(f.year):null,
        serial_number:f.serial||null,
        hour_meter_reading:f.hours?parseInt(f.hours):null,
        fuel_type:f.fuel||null,
        capacity_lbs:f.cap?parseInt(f.cap):null,
        mast_type:f.mast||null,
        mast_height_inches:f.mastH?parseInt(f.mastH):null,
        tire_type:f.tire||null,
        acquisition_cost:parseFloat(f.price),
        transport_cost:f.transport?parseFloat(f.transport):0,
        acquisition_source:f.source||null,
        intake_date:f.date,
        arrival_condition_notes:f.notes||null,
        arrival_photos:urls,
        status:f.status,
      })
      if(ie){setErr(ie.message);setSaving(false);return}
      window.location.href='/donor-lifts'
    }catch(e:any){setErr(e.message||'Error');setSaving(false)}
  }

  return(
    <div style={{minHeight:'100dvh',background:bg,paddingBottom:'80px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'16px',background:'#111520',borderBottom:bdr,position:'sticky',top:0,zIndex:30}}>
        <div onClick={()=>window.location.href='/donor-lifts'} style={{width:'40px',height:'40px',borderRadius:'8px',border:bdr,background:bgL,color:txt,fontSize:'20px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>←</div>
        <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'20px',color:txt,textTransform:'uppercase',letterSpacing:'1px'}}>Log Donor Lift</div>
      </div>

      <div style={sec}>
        <div style={secT}>Unit Identity</div>
        <div style={row}>
          <div style={fld}><label style={lbl}>Make *</label><input style={inp} placeholder="Toyota" value={f.make} onChange={set('make')}/></div>
          <div style={fld}><label style={lbl}>Model *</label><input style={inp} placeholder="8FGU25" value={f.model} onChange={set('model')}/></div>
        </div>
        <div style={row}>
          <div style={fld}><label style={lbl}>Year</label><input style={inp} type="number" placeholder="2012" value={f.year} onChange={set('year')}/></div>
          <div style={fld}><label style={lbl}>Hour Meter</label><input style={inp} type="number" placeholder="4500" value={f.hours} onChange={set('hours')}/></div>
        </div>
        <div style={fld}><label style={lbl}>Serial Number</label><input style={inp} placeholder="S/N from dataplate" value={f.serial} onChange={set('serial')}/></div>
      </div>

      <div style={sec}>
        <div style={secT}>Specifications</div>
        <div style={fld}><label style={lbl}>Fuel Type</label>
          <select style={sel} value={f.fuel} onChange={set('fuel')}>
            <option value="">— Select —</option>
            {FUELS.map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div style={row}>
          <div style={fld}><label style={lbl}>Capacity (lbs)</label><input style={inp} type="number" placeholder="5000" value={f.cap} onChange={set('cap')}/></div>
          <div style={fld}><label style={lbl}>Tire Type</label>
            <select style={sel} value={f.tire} onChange={set('tire')}>
              <option value="">— Select —</option>
              {TIRES.map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        <div style={row}>
          <div style={fld}><label style={lbl}>Mast Type</label>
            <select style={sel} value={f.mast} onChange={set('mast')}>
              <option value="">— Select —</option>
              {MASTS.map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div style={fld}><label style={lbl}>Mast Height (in)</label><input style={inp} type="number" placeholder="189" value={f.mastH} onChange={set('mastH')}/></div>
        </div>
      </div>

      <div style={sec}>
        <div style={secT}>Acquisition</div>
        <div style={row}>
          <div style={fld}><label style={lbl}>Purchase Price * ($)</label><input style={inp} type="number" placeholder="0.00" value={f.price} onChange={set('price')}/></div>
          <div style={fld}><label style={lbl}>Transport Cost ($)</label><input style={inp} type="number" placeholder="0.00" value={f.transport} onChange={set('transport')}/></div>
        </div>
        <div style={fld}><label style={lbl}>Source</label><input style={inp} placeholder="Auction, dealer, end user..." value={f.source} onChange={set('source')}/></div>
        <div style={row}>
          <div style={fld}><label style={lbl}>Intake Date</label><input style={inp} type="date" value={f.date} onChange={set('date')}/></div>
          <div style={fld}><label style={lbl}>Status</label>
            <select style={sel} value={f.status} onChange={set('status')}>
              <option value="pending_intake">Pending Assessment</option>
              <option value="ready_for_teardown">Ready for Teardown</option>
              <option value="in_teardown">In Teardown</option>
            </select>
          </div>
        </div>
      </div>

      <div style={sec}>
        <div style={secT}>Arrival Photos</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'16px'}}>
          {photos.map((p,i)=>(
            <div key={i} style={slot} onClick={()=>{setPhotos(a=>a.filter((_,x)=>x!==i));setFiles(a=>a.filter((_,x)=>x!==i))}}>
              <img src={p} style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}} alt=""/>
              <div style={{position:'absolute',top:'4px',right:'4px',background:'rgba(0,0,0,0.6)',borderRadius:'50%',width:'22px',height:'22px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'12px'}}>✕</div>
            </div>
          ))}
          {photos.length<6&&(
            <div style={slot} onClick={()=>ref.current?.click()}>
              <div style={{fontSize:'28px',color:dim}}>📷</div>
              <div style={{fontSize:'9px',color:dim,textTransform:'uppercase',letterSpacing:'1px',marginTop:'4px'}}>Add Photo</div>
            </div>
          )}
        </div>
        <input ref={ref} type="file" accept="image/*" capture="environment" multiple style={{display:'none'}} onChange={addPhoto}/>
      </div>

      <div style={sec}>
        <div style={secT}>Condition Notes</div>
        <div style={fld}>
          <label style={lbl}>Notes <span style={{color:amb}}>🎤 tap to dictate</span></label>
          <div style={{display:'flex',gap:'10px'}}>
            <textarea style={{flex:1,minHeight:'100px',padding:'14px 16px',background:bgL,border:bdr,borderRadius:'8px',color:txt,fontSize:'16px',outline:'none',resize:'vertical',fontFamily:'Barlow,sans-serif'}} placeholder="Describe condition..." value={f.notes} onChange={set('notes')}/>
            <div onClick={voice} style={{width:'56px',height:'56px',borderRadius:'8px',border:bdr,background:mic?amb:bgL,fontSize:'22px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>🎤</div>
          </div>
          {mic&&<div style={{fontSize:'12px',color:amb,marginTop:'4px'}}>● Listening...</div>}
        </div>
      </div>

      {err&&<div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'8px',padding:'12px 16px',color:'#ef4444',fontSize:'13px',margin:'0 16px 16px'}}>{err}</div>}

      <div style={{position:'fixed',bottom:0,left:0,right:0,padding:'16px',background:bg,borderTop:bdr}}>
        <button onClick={save} disabled={saving} style={{width:'100%',height:'60px',background:amb,color:'#111',border:'none',borderRadius:'8px',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'18px',letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer'}}>
          {saving?'Saving...':'Save Donor Lift'}
        </button>
      </div>
    </div>
  )
}
