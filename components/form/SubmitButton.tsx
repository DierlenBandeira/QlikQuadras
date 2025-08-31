// components/form/SubmitButton.tsx
'use client'
import { useFormStatus } from 'react-dom'

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
    >
      {pending ? 'Salvando…' : children}
    </button>
  )
}
