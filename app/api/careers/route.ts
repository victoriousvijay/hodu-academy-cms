import { NextRequest, NextResponse } from 'next/server'
import { sendFormEmail, type EmailAttachment } from '@/lib/email'

const MAX_RESUME_BYTES = 4 * 1024 * 1024

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const get = (k: string) => String(form.get(k) || '').trim()
    const name = get('name')
    const email = get('email')
    const phone = get('phone')

    if (!name || !email || phone.length < 10) {
      return NextResponse.json({ error: 'Name, email and a valid phone number are required.' }, { status: 400 })
    }

    const attachments: EmailAttachment[] = []
    const resume = form.get('resume')
    if (resume && typeof resume !== 'string' && resume.size > 0) {
      if (resume.size > MAX_RESUME_BYTES) {
        return NextResponse.json({ error: 'Resume must be under 4 MB.' }, { status: 400 })
      }
      const buf = Buffer.from(await resume.arrayBuffer())
      attachments.push({ filename: resume.name || 'resume.pdf', content: buf.toString('base64') })
    }

    const ok = await sendFormEmail({
      subject: `Job Application: ${get('position') || 'General'} — ${name}`,
      heading: 'New Career Application',
      replyTo: email,
      attachments,
      fields: {
        Name: name,
        Email: email,
        Phone: phone,
        Position: get('position'),
        Subject: get('subject'),
        Experience: get('experience'),
        Qualification: get('qualification'),
        City: get('city'),
        'Resume Link': get('resume_link'),
        Message: get('message'),
        'Resume Attached': attachments.length ? attachments[0].filename : 'No',
      },
    })

    if (!ok) return NextResponse.json({ error: 'Unable to submit application. Please try again.' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Career form error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
