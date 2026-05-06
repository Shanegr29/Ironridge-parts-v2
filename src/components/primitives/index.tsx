'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { ConditionGrade, PartStatus, DonorStatus } from '@/types/database'

// ── FAB ──────────────────────────────────────────────────────────────────────
interface FABProps {
  onClick: () => void
  hidden?: boolean
}
export function FAB({ onClick, hidden }: FABProps) {
  if (hidden) return null
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed z-40 w-14 h-14 rounded-full',
        'bg-amber text-navy text-3xl font-bold leading-none',
        'shadow-fab active:scale-90 transition-transform',
        'flex items-center justify-center',
      )}
      style={{ bottom: 'calc(72px + 16px)', right: 'max(16px, calc(50vw - 240px + 16px))' }}
      aria-label="Add new"
    >
      +
    </button>
  )
}

// ── GradeBox ──────────────────────────────────────────────────────────────────
const gradeConfig: Record<ConditionGrade, { bg: string; text: string; label: string }> = {
  A_tested_working:      { bg: 'bg-ir-green/15',  text: 'text-ir-green',  label: 'A' },
  B_takeout_untested:    { bg: 'bg-amber/15',      text: 'text-amber',     label: 'B' },
  C_for_parts_or_repair: { bg: 'bg-ir-orange/15', text: 'text-ir-orange', label: 'C' },
  D_core_only:           { bg: 'bg-ir-red/15',    text: 'text-ir-red',    label: 'D' },
}

interface GradeBoxProps {
  grade: ConditionGrade
  size?: 'sm' | 'md'
}
export function GradeBox({ grade, size = 'md' }: GradeBoxProps) {
  const cfg = gradeConfig[grade]
  return (
    <div className={cn(
      'rounded-grade flex items-center justify-center font-display font-black flex-shrink-0',
      cfg.bg, cfg.text,
      size === 'md' ? 'w-8 h-8 text-base' : 'w-6 h-6 text-sm'
    )}>
      {cfg.label}
    </div>
  )
}

export function gradeLabel(grade: ConditionGrade): string {
  const labels: Record<ConditionGrade, string> = {
    A_tested_working:      'A — Tested Working',
    B_takeout_untested:    'B — Takeout Untested',
    C_for_parts_or_repair: 'C — For Parts/Repair',
    D_core_only:           'D — Core Only',
  }
  return labels[grade]
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
type AnyStatus = PartStatus | DonorStatus | string

const statusConfig: Record<string, { cls: string; label: string }> = {
  pulled_not_listed:  { cls: 'bg-ir-green/15 text-ir-green',   label: 'In Stock' },
  listed:             { cls: 'bg-ir-blue/15 text-ir-blue',     label: 'Listed' },
  sold:               { cls: 'bg-white/10 text-ir-text-dim',   label: 'Sold' },
  shipped:            { cls: 'bg-ir-green/15 text-ir-green',   label: 'Shipped' },
  returned:           { cls: 'bg-ir-red/15 text-ir-red',       label: 'Returned' },
  scrapped:           { cls: 'bg-white/10 text-ir-text-dim',   label: 'Scrapped' },
  reserved:           { cls: 'bg-amber/15 text-amber',         label: 'Reserved' },
  pending_intake:     { cls: 'bg-ir-blue/15 text-ir-blue',     label: 'Pending' },
  ready_for_teardown: { cls: 'bg-amber/15 text-amber',         label: 'Ready' },
  in_teardown:        { cls: 'bg-amber/15 text-amber',         label: 'Teardown' },
  mostly_complete:    { cls: 'bg-ir-green/15 text-ir-green',   label: 'Nearly Done' },
  finished:           { cls: 'bg-white/10 text-ir-text-dim',   label: 'Finished' },
  scrap_only:         { cls: 'bg-ir-red/15 text-ir-red',       label: 'Scrap' },
}

interface StatusBadgeProps { status: AnyStatus }
export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status] ?? { cls: 'bg-white/10 text-ir-text-dim', label: status }
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-[3px] rounded-badge',
      'text-[10px] font-bold uppercase tracking-[0.06em]',
      cfg.cls
    )}>
      {cfg.label}
    </span>
  )
}

// ── StatCard ──────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  valueColor?: 'default' | 'amber' | 'green'
}
export function StatCard({ label, value, sub, valueColor = 'default' }: StatCardProps) {
  return (
    <div className="bg-steel-mid border border-ir-border rounded-ir p-4">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ir-text-dim mb-1">{label}</div>
      <div className={cn(
        'font-display font-bold text-[28px] leading-none',
        valueColor === 'amber' && 'text-amber',
        valueColor === 'green' && 'text-ir-green',
        valueColor === 'default' && 'text-ir-text',
      )}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-ir-text-dim mt-1">{sub}</div>}
    </div>
  )
}

// ── ProgressBar ───────────────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number
  leftLabel?: string
  rightLabel?: string
}
export function ProgressBar({ value, leftLabel, rightLabel }: ProgressBarProps) {
  return (
    <div>
      <div className="h-1 bg-steel-light rounded-full overflow-hidden">
        <div
          className="h-1 bg-amber rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-ir-text-dim">{leftLabel}</span>
          <span className="text-[10px] text-ir-text-dim">{rightLabel}</span>
        </div>
      )}
    </div>
  )
}

// ── SectionTitle ──────────────────────────────────────────────────────────────
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-display font-bold text-[11px] uppercase tracking-[0.18em] text-ir-text-dim mb-3 mt-5 first:mt-0">
      {children}
    </div>
  )
}

// ── FormField ─────────────────────────────────────────────────────────────────
interface FormFieldProps {
  label: string
  children: React.ReactNode
  className?: string
}
export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-[11px] uppercase tracking-[0.08em] text-ir-text-dim font-semibold">
        {label}
      </label>
      {children}
    </div>
  )
}

export const inputCls = cn(
  'min-h-[60px] w-full px-4 rounded-ir text-ir-text text-base',
  'bg-steel-light border border-ir-border',
  'focus:outline-none focus:border-amber',
  'placeholder:text-ir-text-dim/50',
  'transition-colors duration-150'
)

export const selectCls = cn(inputCls, 'cursor-pointer')

export const textareaCls = cn(
  'min-h-[80px] w-full px-4 py-3 rounded-ir text-ir-text text-base',
  'bg-steel-light border border-ir-border',
  'focus:outline-none focus:border-amber',
  'placeholder:text-ir-text-dim/50',
  'resize-y transition-colors duration-150'
)

// ── VoiceButton ───────────────────────────────────────────────────────────────
interface VoiceButtonProps {
  onTranscript: (text: string) => void
  active?: boolean
}
export function VoiceButton({ onTranscript, active }: VoiceButtonProps) {
  const handleClick = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice input not supported on this device.'); return }
    const recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onresult = (e: any) => onTranscript(e.results[0][0].transcript)
    recognition.start()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'w-12 h-12 rounded-ir flex items-center justify-center flex-shrink-0',
        'border border-ir-border transition-colors',
        active ? 'bg-amber text-navy border-amber' : 'bg-steel-light text-amber'
      )}
      title="Voice input"
    >
      🎤
    </button>
  )
}

// ── Btn ───────────────────────────────────────────────────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'md' | 'sm'
}
export function Btn({ variant = 'primary', size = 'md', className, children, ...props }: BtnProps) {
  return (
    <button
      className={cn(
        'flex items-center justify-center gap-2 rounded-ir font-display font-bold uppercase tracking-widest transition-all active:scale-[0.98]',
        size === 'md' && 'min-h-[64px] px-6 text-base w-full',
        size === 'sm' && 'h-10 px-4 text-xs w-auto',
        variant === 'primary' && 'bg-amber text-navy disabled:opacity-50',
        variant === 'ghost' && 'border border-ir-border text-ir-text-dim bg-transparent',
        variant === 'danger' && 'bg-ir-red/15 text-ir-red border border-ir-red/20',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────
interface ToastProps {
  message: string
  color?: string
}
export function Toast({ message, color = '#22c55e' }: ToastProps) {
  return (
    <div
      className={cn(
        'fixed left-1/2 z-[200]',
        'flex items-center gap-2 px-5 py-3',
        'bg-steel-mid border border-ir-border rounded-full',
        'shadow-toast text-[13px] whitespace-nowrap',
        'animate-fade-up'
      )}
      style={{ bottom: 'calc(72px + 12px)' }}
    >
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      {message}
    </div>
  )
}

// ── AppHeader ─────────────────────────────────────────────────────────────────
interface AppHeaderProps {
  title?: string
  actions?: React.ReactNode
}
export function AppHeader({ title, actions }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-header bg-navy border-b border-ir-border flex-shrink-0">
      <div>
        <div className="font-display font-black text-xl text-amber tracking-widest uppercase leading-none">
          ⬡ IronRidge
        </div>
        {title && (
          <div className="text-[10px] text-ir-text-dim tracking-[0.2em] uppercase mt-0.5">
            {title}
          </div>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </header>
  )
}

// ── OnlineIndicator ───────────────────────────────────────────────────────────
export function OnlineIndicator() {
  const [online, setOnline] = useState(true)

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    setOnline(navigator.onLine)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  if (online) return null

  return (
    <div className="fixed top-[60px] left-0 right-0 z-20 bg-ir-red/90 text-white text-center text-xs py-1.5 font-semibold tracking-wide">
      ⚠ Offline — changes will sync when reconnected
    </div>
  )
}
