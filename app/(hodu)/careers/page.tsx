import type { Metadata } from 'next'
import CareerForm from '@/components/hodu/CareerForm'
import { Briefcase, GraduationCap, Users, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Careers at Hodu Academy — Join Our Faculty Team in Jaipur',
  description: 'Apply for faculty and staff roles at Hodu Academy, Jaipur. We are hiring passionate educators for IGCSE, IB, CBSE, JEE & NEET.',
  alternates: { canonical: '/careers' },
}

const perks = [
  { icon: GraduationCap, title: 'Teach Top Curricula', text: 'IGCSE, IB DP, CBSE, JEE & NEET batches.' },
  { icon: Users, title: 'Small Batches', text: 'Personal mentorship with focused groups.' },
  { icon: Sparkles, title: 'Grow With Us', text: 'Training, resources and a supportive team.' },
]

export default function CareersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-12 bg-white">
      <div className="max-w-2xl space-y-3">
        <span className="text-xs bg-brand-maroon text-white px-3.5 py-1.5 rounded-full font-black uppercase tracking-wider inline-flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" /> We&apos;re Hiring
        </span>
        <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon">Careers at Hodu Academy</h1>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Passionate about teaching? Join our team of mentors shaping students across Cambridge, IB, CBSE and competitive exams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4 space-y-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3 bg-brand-bg/60 border border-brand-border rounded-2xl p-5">
              <Icon className="w-6 h-6 text-brand-maroon shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-neutral-900">{title}</h3>
                <p className="text-xs text-neutral-600 mt-0.5">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-8 bg-white border-2 border-brand-border p-6 sm:p-9 rounded-3xl shadow-xs space-y-6">
          <div className="border-b border-brand-border pb-3">
            <h2 className="font-serif-editorial font-bold text-lg text-neutral-900">Job Application Form</h2>
            <p className="text-xs text-neutral-500 mt-1">Fill in your details and attach your resume.</p>
          </div>
          <CareerForm />
        </div>
      </div>
    </div>
  )
}
