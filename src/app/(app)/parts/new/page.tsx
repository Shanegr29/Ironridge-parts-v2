'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const CATS=['Engine / Powertrain','Transmission','Mast & Carriage','Hydraulics','Electrical','Brakes','Steering','Tires & Wheels','Cab / Body','Forks & Attachments','Cooling System','Exhaust','Fuel System','Misc']
const GRADES=[['A_tested_working','A — Tested & Working'],['B_takeout_untested','B — Takeout Untested'],['C_for_parts_or_repair','C — For Parts / Repair'],['D_core_only','D — Core Only']]

const bg='#1a1f2e',bgL='#2f3750',txt='#e8eaf0',dim='#a8b2c4',amb='#f59e0b',bdr='1px solid rgba(255,255,255,0.07)',bgMid='#252b3b'
const inp={height:'56px',padding:'0 16px',background:bgL,border:bdr,borderRadius:'8px',color:txt,fontSize:'16px',outline:'none',width:'100%'} as any
const sel={...inp,appearance:'none' as any}
const lbl={fontSize:'11px',color:dim,textTransform:'uppercase' as any,letterSpacing:'1px',fontWeight:600}
const fld={display:'flex',flexDirection:'column' as any,gap:'6px',marginBottom:'16px'}
const row={display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'} as any
const sec={padding:'20px 16px 0'} as any
const secT={fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase' as any,color:dim,marginBottom:'14px',paddingBottom:'8px',borderBottom:bdr}
const slot={aspectRatio:'1',borderRadius:'8px',border:'2px dashed rgba(255,255,255,0.15)',background:bgMid,display:'flex',flexDirection:'column' as any,alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden',position:'relative' as any}

export default function Page() {
  const [liftId, setLiftId] = useState('')
  const [lift, setLift] = useState<any>(null)
  const [locations, setLocations] = useState<any[]>([])
  const [f, sf] = useState({ part_type:'', part_subtype:'', oem_part_number:'', category:CATS[0], grade:'B_takeout_untested', condition_notes:'', weight:'', asking_price:'', minimum_price:'', location_id:'', compatible_models:'' })
  const [photos, setPhotos] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [mic, setMic] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  const set = (k:string) => (e:any) => sf(p => ({...p,[k]:e.target.value}))

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('lift') || ''
    setLiftId(id)
    const load = async () => {
      const sb = createClient()
      if (id) {
        const {data} = await sb.from('donor_lift').select('id,make,model,year').eq('id',id).single()
        setLift(data)
      }
      const {data:locs} = await sb.from('location').select('id,display_label,facility').order('display_label')
      setLocations(locs||[])
    }
    load()
  }, [])

  const addPhoto = (e:React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files||[]).forEach(file => {
      const r = new FileReader()
      r.onload = ev => { setPhotos(p=>[...p,ev.target?.result as string]); setFiles(p=>[...p,file]) }
      r.readAsDataURL(file)
    })
  }

  const voice = () => {
    const SR = (window as any).SpeechRecognition||(window as any).webkitSpeechRecognition
    if (!SR) { alert('Try Chrome for voice input'); return }
    const r = new SR(); r.lang='en-US'; setMic(true)
    r.onresult = (e:any) => { sf(p=>({...p,condition_notes:p.condition_notes?(p.condition_notes+' '+e.results[0][0].transcript):e.results[0][0].transcript})); setMic(false) }
    r.onerror = () => setMic(false); r.onend = () => setMic(false); r.start()
  }

  const save = async () => {
    if (!f.part_type || !liftId) { setErr('Part name and donor lift are required.'); return }
    setSaving(true); setErr('')
    try {
      const sb = createClient()
      const urls:string[] = []
      for (const file of files) {
        const path = 'part-photos/'+Date.now()+'-'+Math.random().toString(36).slice(2)+'.'+file.name.split('.').pop()
        const {error:ue} = await sb.storage.from('part-photos').upload(path,file)
        if (!ue) { const {data} = sb.storage.from('part-photos').getPublicUrl(path); urls.push(data.publicUrl) }
      }
      const compatible = f.compatible_models ? f.compatible_models.split(',').map((s:string)=>s.trim()).filter(Boolean) : []
      const {error:ie} = await (sb.from('part') as any).insert({
        donor_lift_id: liftId,
        part_type: f.part_type,
        part_subtype: f.part_subtype||null,
        oem_part_number: f.oem_part_number||null,
        description: f.category,
        condition_grade: f.grade,
        condition_notes: f.condition_notes||null,
        weight_lbs: f.weight?parseFloat(f.weight):null,
        asking_price: f.asking_price?parseFloat(f.asking_price):null,
        minimum_acceptable_price: f.minimum_price?parseFloat(f.minimum_price):null,
        bin_location_id: f.location_id||null,
        photos: urls,
        compatible_models: compatible,
        status: 'pulled_not_listed',
        pulled_at: new Date().toISOString(),
      })
      if (ie) { setErr(ie.message); setSaving(false); return }
      window.location.href = liftId ? '/donor-lifts/'+liftId : '/parts'
    } catch(e:any) { setErr(e.message||'Error'); setSaving(false) }
  }

  return (
    <div style={{minHeight:'100dvh',background:bg,paddingBottom:'80px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'16px',background:'#111520',borderBottom:bdr,position:'sticky',top:0,zIndex:30}}>
        <div onClick={()=>window.history.back()} style={{width:'40px',height:'40px',borderRadius:'8px',border:bdr,background:bgL,color:txt,fontSize:'20px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>←</div>
        <div>
          <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'20px',color:txt,textTransform:'uppercase',letterSpacing:'1px'}}>Add Part</div>
          {lift && <div style={{fontSize:'12px',color:dim}}>{lift.year} {lift.make} {lift.model}</div>}
        </div>
      </div>

      <div style={sec}>
        <div style={secT}>Part Identity</div>
        <div style={fld}><label style={lbl}>Part Name *</label><input style={inp} placeholder="Radiator, Drive Motor, Mast..." value={f.part_type} onChange={set('part_type')}/></div>
        <div style={fld}><label style={lbl}>Subtype / Detail</label><input style={inp} placeholder="e.g. Fan-Cooled, Series Wound..." value={f.part_subtype} onChange={set('part_subtype')}/></div>
        <div style={row}>
          <div style={fld}><label style={lbl}>OEM Part Number</label><input style={inp} placeholder="OEM #" value={f.oem_part_number} onChange={set('oem_part_number')}/></div>
          <div style={fld}><label style={lbl}>Category</label>
            <select style={sel} value={f.category} onChange={set('category')}>
              {CATS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={sec}>
        <div style={secT}>Condition</div>
        <div style={fld}><label style={lbl}>Grade</label>
          <select style={sel} value={f.grade} onChange={set('grade')}>
            {GRADES.map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div style={fld}>
          <label style={lbl}>Condition Notes <span style={{color:amb}}>🎤 tap to dictate</span></label>
          <div style={{display:'flex',gap:'10px'}}>
            <textarea style={{flex:1,minHeight:'100px',padding:'14px 16px',background:bgL,border:bdr,borderRadius:'8px',color:txt,fontSize:'16px',outline:'none',resize:'vertical',fontFamily:'Barlow,sans-serif'}} placeholder="Describe condition, tests done, known issues..." value={f.condition_notes} onChange={set('condition_notes')}/>
            <div onClick={voice} style={{width:'56px',height:'56px',borderRadius:'8px',border:bdr,background:mic?amb:bgL,fontSize:'22px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>🎤</div>
          </div>
          {mic&&<div style={{fontSize:'12px',color:amb,marginTop:'4px'}}>● Listening...</div>}
        </div>
      </div>

      <div style={sec}>
        <div style={secT}>Pricing</div>
        <div style={row}>
          <div style={fld}><label style={lbl}>Asking Price ($)</label><input style={inp} type="number" placeholder="0.00" value={f.asking_price} onChange={set('asking_price')}/></div>
          <div style={fld}><label style={lbl}>Min Accept Price ($)</label><input style={inp} type="number" placeholder="0.00" value={f.minimum_price} onChange={set('minimum_price')}/></div>
        </div>
        <div style={fld}><label style={lbl}>Weight (lbs)</label><input style={inp} type="number" placeholder="0.0" value={f.weight} onChange={set('weight')}/></div>
      </div>

      <div style={sec}>
        <div style={secT}>Location & Compatibility</div>
        <div style={fld}><label style={lbl}>Bin Location</label>
          <select style={sel} value={f.location_id} onChange={set('location_id')}>
            <option value="">— Select bin —</option>
            {locations.map((l:any)=><option key={l.id} value={l.id}>{l.display_label}</option>)}
          </select>
        </div>
        <div style={fld}><label style={lbl}>Compatible Models (comma separated)</label><input style={inp} placeholder="Toyota 8FGU25, Crown FC4500..." value={f.compatible_models} onChange={set('compatible_models')}/></div>
      </div>

      <div style={sec}>
        <div style={secT}>Photos</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'16px'}}>
          {photos.map((p,i)=>(
            <div key={i} style={slot} onClick={()=>{setPhotos(a=>a.filter((_,x)=>x!==i));setFiles(a=>a.filter((_,x)=>x!==i))}}>
              <img src={p} style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}} alt=""/>
              <div style={{position:'absolute',top:'4px',right:'4px',background:'rgba(0,0,0,0.6)',borderRadius:'50%',width:'22px',height:'22px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'12px'}}>✕</div>
            </div>
          ))}
          {photos.length<8&&(
            <div style={slot} onClick={()=>ref.current?.click()}>
              <div style={{fontSize:'28px',color:dim}}>📷</div>
              <div style={{fontSize:'9px',color:dim,textTransform:'uppercase',letterSpacing:'1px',marginTop:'4px'}}>Add Photo</div>
            </div>
          )}
        </div>
        <input ref={ref} type="file" accept="image/*" capture="environment" multiple style={{display:'none'}} onChange={addPhoto}/>
      </div>

      {err&&<div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'8px',padding:'12px 16px',color:'#ef4444',fontSize:'13px',margin:'0 16px 16px'}}>{err}</div>}

      <div style={{position:'fixed',bottom:0,left:0,right:0,padding:'16px',background:bg,borderTop:bdr}}>
        <button onClick={save} disabled={saving} style={{width:'100%',height:'60px',background:amb,color:'#111',border:'none',borderRadius:'8px',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'18px',letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer'}}>
          {saving?'Saving...':'Save Part'}
        </button>
      </div>
    </div>
  )
}
Confirm the last line is just } before committing. Then let me know and I'll give you file 2.

You said: i think i need to add a folder
1778109260162_image.png
i think i need to add a folder

7:14 PM
Claude responded: Yes — you're inside the parts folder and you need to create new/page.
Yes — you're inside the parts folder and you need to create new/page.tsx. Click Add file → Create new file and type new/page.tsx in the filename box. GitHub will create the new folder automatically. Then paste the content and commit.



