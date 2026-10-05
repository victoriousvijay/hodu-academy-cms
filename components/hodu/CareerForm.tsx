'use client'

import { useState } from 'react'
import { Loader, Send, CheckCircle2 } from 'lucide-react'

const POSITIONS = [
  'Physics Faculty',
  'Chemistry Faculty',
  'Mathematics Faculty',
  'Biology Faculty',
  'English / Humanities Faculty',
  'Academic Counsellor',
  'Operations / Admin',
  'Other',
]

const input = 'w-full bg-brand-bg/60 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-navy outline-none focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/10 transition-all'
const label = 'text-xs font-bold text-brand-navy block'

export default function CareerForm() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const phone = String(data.get('phone') || '').trim()
    const resume = data.get('resume')
    if (phone.length < 10) { setErr('Please enter a valid 10-digit phone number.'); return }
    if (resume instanceof File && resume.size > 4 * 1024 * 1024) { setErr('Resume must be under 4 MB.'); return }

    setLoading(true); setErr('')
    const res = await fetch('/api/careers', { method: 'POST', body: data }).catch(() => null)
    if (res?.ok) setDone(true)
    else {
      const j = await res?.json().catch(() => null)
      setErr(j?.error || 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (done) return (
    <div className="text-center py-10 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
      <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-2.5" />
      <h4 className="font-extrabold text-brand-navy text-base">Application Submitted!</h4>
      <p className="text-brand-navy/70 text-xs mt-1 max-w-xs mx-auto">Thank you for your interest. Our team will review your profile and get back to you.</p>
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5"><label className={label}>Full Name *</label><input name="name" required className={input} placeholder="Your full name" /></div>
        <div className="space-y-1.5"><label className={label}>Email *</label><input name="email" type="email" required className={input} placeholder="you@example.com" /></div>
        <div className="space-y-1.5"><label className={label}>Mobile No. *</label><input name="phone" type="tel" required className={input} placeholder="+91 98765 43210" /></div>
        <div className="space-y-1.5"><label className={label}>Position *</label>
          <select name="position" required className={input} defaultValue={POSITIONS[0]}>
            {POSITIONS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="space-y-1.5"><label className={label}>Subject / Curriculum</label><input name="subject" className={input} placeholder="e.g. IGCSE Physics, JEE Maths" /></div>
        <div className="space-y-1.5"><label className={label}>Teaching Experience</label><input name="experience" className={input} placeholder="e.g. 5 years" /></div>
        <div className="space-y-1.5"><label className={label}>Highest Qualification</label><input name="qualification" className={input} placeholder="e.g. M.Sc. Physics, B.Tech" /></div>
        <div className="space-y-1.5"><label className={label}>Current City</label><input name="city" className={input} placeholder="e.g. Jaipur" /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5"><label className={label}>Upload Resume (PDF/DOC, max 4 MB)</label>
          <input name="resume" type="file" accept=".pdf,.doc,.docx" className={`${input} file:mr-3 file:border-0 file:bg-brand-maroon file:text-white file:rounded-lg file:px-3 file:py-1 file:text-xs`} />
        </div>
        <div className="space-y-1.5"><label className={label}>Or Resume Link</label><input name="resume_link" type="url" className={input} placeholder="Google Drive / LinkedIn URL" /></div>
      </div>
      <div className="space-y-1.5"><label className={label}>Why do you want to join Hodu?</label>
        <textarea name="message" rows={3} className={`${input} resize-none`} placeholder="Tell us briefly about yourself..." />
      </div>
      {err && <p className="text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs font-medium">{err}</p>}
      <button type="submit" disabled={loading}
        className="w-full bg-brand-maroon hover:bg-brand-accent text-white font-extrabold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-md">
        {loading ? <><Loader size={14} className="animate-spin" /> Submitting…</> : <><Send size={13} /> Submit Application</>}
      </button>
    </form>
  )
}
