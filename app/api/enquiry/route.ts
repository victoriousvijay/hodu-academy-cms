import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID } from '@/lib/hodu'
import { sendFormEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = String(body.name || '').trim()
    const phone = String(body.phone || '').trim()
    const email = String(body.email || '').trim()
    const category = String(body.category || '').trim()
    const message = String(body.message || '').trim()
    const source = String(body.source || 'Website Enquiry').trim()

    if (!name || phone.length < 10) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const leadMessage = [category && `[${category}]`, email, message].filter(Boolean).join(' — ')
    const { error } = await supabase.from('cms_leads').insert({
      site_id: HODU_SITE_ID,
      name,
      phone,
      message: leadMessage || null,
      status: 'new',
    })
    if (error) console.error('Lead insert error:', error)

    const mailed = await sendFormEmail({
      subject: `New Enquiry: ${name} (${phone})`,
      heading: `New ${source}`,
      replyTo: email || null,
      fields: { Name: name, Phone: phone, Email: email, Course: category, Message: message, Source: source },
    })

    if (error && !mailed) {
      return NextResponse.json({ error: 'Unable to submit enquiry' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Enquiry error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
