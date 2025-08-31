'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useFormStatus } from 'react-dom'

export function PendingOverlay() {
  const { pending } = useFormStatus()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!pending || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/40 backdrop-blur-sm">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/50 border-t-transparent" />
    </div>,
    document.body
  )
}
