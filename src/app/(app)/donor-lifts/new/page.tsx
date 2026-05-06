'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const FUEL_TYPES = [
  { value: 'lpg', label: 'LPG / Propane' },
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric_lead_acid', label: 'Electric — Lead Acid' },
  { value: 'electric_lithium', label: 'Electric — Lithium' },
]

const MAST_TYPES = [
  { value: 'single', label: 'Single Stage' },
  { value: 'two_stage', label: 'Two Stage' },
  { value: 'three_stage', label: 'Three Stage' },
  { value: 'quad', label: 'Quad' },
  { value: 'telescopic', label: 'Telescopic' },
]

const TIRE_TYPES = [
  { value: 'cushion', label: 'Cushion' },
  { value: 'pneumatic', label: 'Pneumatic' },
  { value: 'solid_pneumatic', label: 'Solid Pneumatic' },
  { value: 'foam_filled', label: 'Foam Filled' },
]

const STATUSES = [
  { value: 'pending_intake', label: 'Pending Assessment' },
  { value: 'ready_for_teardown', label: 'Ready for Teardown' },
  { value: 'in_teardown', label: 'In Teardown' },
]

const s: Record<string, any> = {
  page: { minHeight: '100dvh', background: '#1a1f2e', paddingBottom: '80px' },
  header: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#111520', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 30 },
  backBtn: { width: '40px', height: '40px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)', background: '#2f3750', color: '#e8eaf0', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
  headerTitle: { fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '20px', color: '#e8eaf0', textTransform: 'uppercase', letterSpacing: '1px' },
  section: { padding: '20px 16px 0' },
  sectionTitle: { fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#a8b2c4', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' },
  label: { fontSize: '11px', color: '#a8b2c4', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 },
  input: { height: '56px', padding: '0 16px', background: '#2f3750', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: '#e8eaf0', fontSize: '16px', outline: 'none', width: '100%' },
  select: { height: '56px', padding: '0 16px', background: '#2f3750', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: '#e8eaf0', fontSize: '16px', outline: 'none', width: '100%', appearance: 'none' },
  textarea: { minHeight: '100px', padding: '14px 16px', background: '#2f3750', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: '#e8eaf0', fontSize: '16px', outline: 'none', width: '100%', resize: 'vertical', fontFamily: 'Barlow, sans-serif' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  voiceRow: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  voiceBtn: { width: '56px', height: '56px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)', background: '#2f3750', fontSize: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
  voiceBtnActive: { background: '#f59e0b', border: '1px solid #f59e0b' },
  photoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' },
  photoSlot: { aspectRatio: '1', borderRadius: '8px', border: '2px dashed rgba(255,255,255,0.15)', background: '#252b3b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' },
  photoImg: { width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 },
  photoPlus: { fontSize: '28px', color: '#a8b2c4' },
  photoLabel: { fontSize: '9px', color: '#a8b2c4', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' },
  submitBtn: { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', background: '#1a1f2e', borderTop: '1px solid rgba(255,255,255,0.07)' },
  submitBtnInner: { width: '100%', height: '60px', background: '#f59e0b', color: '#111', border: 'none', borderRadius: '8px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '18px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 16px', color: '#ef4444', fontSize: '13px', margin: '0 16px 16px' },
}

export default function NewDonorLiftPage() {
  const [form, setForm] = useState({
    make: '', model: '', year: '', serial_number: '', hour_meter_reading: '',
    fuel_type: '', capacity_lbs: '', mast_type: '', mast_height_inches: '',
    tire_type: '', acquisition_cost: '', transport_cost: '',
    acquisition_source: '', intake_date: new Date().toISOString().slice(0, 10),
    arrival_condition_notes: '', status: 'pending_intake',
  })
  const [photos, setPhotos] = useState<string[]>([])
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [listening, setListening] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => {
        setPhotos(p => [...p, ev.target?.result as string])
        setPhotoFiles(p => [...p, file])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (i: number) => {
    setPhotos(p => p.filter((_, idx) => idx !== i))
    setPhotoFiles(p => p.filter((_, idx) => idx !== i))
  }

  const handleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice input not supported on this browser. Try Chrome.'); return }
    const r = new SR()
    r.continuous = false
    r.interimResults = false
    r.lang = 'en-US'
    setListening(true)
    r.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setForm(f => ({ ...f, arrival_condition_notes: f.arrival_condition_notes ? f.arrival_condition_notes + ' ' + text : text }))
      setListening(false)
    }
    r.onerror = () => setListening(false)
    r.onend = () => setListening(false)
    r.start()
  }

  const handleSubmit = async () => {
    if (!form.make || !form.model || !form.acquisition_cost) {
      setError('Make, Model, and Purchase Price are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const supabase = createClient()
      const photoUrls: string[] = []
      for (const file of photoFiles) {
        const ext = file.name.split('.').pop()
        const path = 'donor-lifts/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext
        const { error: uploadError } = await supabase.storage.from('donor-lift-photos').upload(path, file)
        if (!uploadError) {
          const { data } = supabase.storage.from('donor-lift-photos').getPublicUrl(path)
          photoUrls.push(data.publicUrl)
        }
      }
      const { error: insertError } = await supabase.from('donor_lift').insert({
        make: form.make,
        model: form.model,
        year: form.year ? parseInt(form.year) : null,
        serial_number: form.serial_number || null,
        hour_meter_reading: form.hour_meter_reading ? parseInt(form.hour_meter_reading) : null,
        fuel_type: form.fuel_type || null,
        capacity_lbs: form.capacity_lbs ? parseInt(form.capacity_lbs) : null,
        mast_type: form.mast_type || null,
        mast_height_inches: form.mast_height_inches ? parseInt(form.mast_height_inches) : null,
        tire_type: form.tire_type || null,
        acquisition_cost: parseFloat(form.acquisition_cost),
        transport_cost: form.transport_cost ? parseFloat(form.transport_cost) : 0,
        acquisition_source: form.acquisition_source || null,
        intake_date: form.intake_date,
        arrival_condition_notes: form.arrival_condition_notes || null,
        arrival_photos: photoUrls,
        status: form.status,
      })
      if (insertError) { setError(insertError.message); setSaving(false); return }
      window.location.href = '/donor-lifts'
    } catch (e: any) {
      setError(e.message || 'Something went wrong.')
      setSaving(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.backBtn} onClick={() => window.location.href = '/donor-lifts'}>←</div>
        <div style={s.headerTitle}>Log Donor Lift</div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Unit Identity</div>
        <div style={s.row}>
          <div style={s.field}><label style={s.label}>Make *</label><input style={s.input} placeholder="Toyota" value={form.make} onChange={set('make')} /></div>
          <div style={s.field}><label style={s.label}>Model *</label><input style={s.input} placeholder="8FGU25" value={form.model} onChange={set('model')} /></div>
        </div>
        <div style={s.row}>
          <div style={s.field}><label style={s.label}>Year</label><input style={s.input} type="number" placeholder="2012" value={form.year} onChange={set('year')} /></div>
          <div style={s.field}><label style={s.label}>Hour Meter</label><input style={s.input} type="number" placeholder="4500" value={form.hour_meter_reading} onChange={set('hour_meter_reading')} /></div>
        </div>
        <div style={s.field}><label style={s.label}>Serial Number</label><input style={s.input} placeholder="S/N from dataplate" value={form.serial_number} onChange={set('serial_number')} /></div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Specifications</div>
        <div style={s.field}><label style={s.label}>Fuel Type</label>
          <select style={s.select} value={form.fuel_type} onChange={set('fuel_type')}>
            <option value="">— Select —</option>
            {FUEL_TYPES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
        <div style={s.row}>
          <div style={s.field}><label style={s.label}>Capacity (lbs)</label><input style={s.input} type="number" placeholder="5000" value={form.capacity_lbs} onChange={set('capacity_lbs')} /></div>
          <div style={s.field}><label style={s.label}>Tire Type</label>
            <select style={s.select} value={form.tire_type} onChange={set('tire_type')}>
              <option value="">— Select —</option>
              {TIRE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>
        <div style={s.row}>
          <div style={s.field}><label style={s.label}>Mast Type</label>
            <select style={s.select} value={form.mast_type} onChange={set('mast_type')}>
              <option value="">— Select —</option>
              {MAST_TYPES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div style={s.field}><label style={s.label}>Mast Height (in)</label><input style={s.input} type="number" placeholder="189" value={form.mast_height_inches} onChange={set('mast_height_inches')} /></div>
        </div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Acquisition</div>
        <div style={s.row}>
          <div style={s.field}><label style={s.label}>Purchase Price * ($)</lab
