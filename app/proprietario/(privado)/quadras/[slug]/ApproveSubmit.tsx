'use client'
import { useFormStatus } from 'react-dom'

export function ApproveSubmit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
      disabled={pending}
    >
      {pending ? 'Aprovando…' : 'Aprovar'}
    </button>
  )
}
