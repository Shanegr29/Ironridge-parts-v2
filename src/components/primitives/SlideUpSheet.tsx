'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface SlideUpSheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function SlideUpSheet({ open, onClose, title, children, footer }: SlideUpSheetProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(10,12,20,0.75)]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className={cn(
        'relative w-full max-w-[480px] max-h-[92dvh] flex flex-col',
        'bg-steel-mid rounded-sheet shadow-sheet',
        'animate-slide-up'
      )}>
        {/* Handle */}
        <div className="w-9 h-1 bg-iron rounded-full mx-auto mt-3 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-ir-border flex-shrink-0">
          <h2 className="font-display font-bold text-lg uppercase tracking-wide text-ir-text">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-ir border border-ir-border text-ir-text-dim active:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-ir-border flex-shrink-0"
            style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
