const RESEND_API = 'https://api.resend.com/emails'

export interface EmailAttachment {
  filename: string
  content: string // base64
}

function escapeHtml(v: string) {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * Sends a form-submission notification through Resend.
 * Env: RESEND_API_KEY (required), RESEND_FROM_EMAIL, NOTIFY_EMAIL_TO (comma-separated).
 * Never throws — returns false on failure so form submissions still succeed.
 */
export async function sendFormEmail(opts: {
  subject: string
  heading: string
  fields: Record<string, string | null | undefined>
  replyTo?: string | null
  attachments?: EmailAttachment[]
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  const to = (process.env.NOTIFY_EMAIL_TO || '').split(',').map(s => s.trim()).filter(Boolean)
  if (!apiKey || to.length === 0) {
    console.warn('Resend not configured: set RESEND_API_KEY and NOTIFY_EMAIL_TO')
    return false
  }

  const rows = Object.entries(opts.fields)
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `<tr><td style="padding:8px 12px;border:1px solid #F3DCDC;font-weight:600;color:#7E0D0D;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td><td style="padding:8px 12px;border:1px solid #F3DCDC;color:#1B2A44;white-space:pre-wrap">${escapeHtml(String(v))}</td></tr>`)
    .join('')

  const html = `<div style="font-family:Arial,sans-serif;max-width:640px"><h2 style="color:#7E0D0D;margin:0 0 12px">${escapeHtml(opts.heading)}</h2><table style="border-collapse:collapse;width:100%;font-size:14px">${rows}</table><p style="color:#888;font-size:12px;margin-top:16px">Submitted ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST via hoduacademy website</p></div>`
  const text = Object.entries(opts.fields).filter(([, v]) => v && String(v).trim()).map(([k, v]) => `${k}: ${v}`).join('\n')

  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Hodu Academy <onboarding@resend.dev>',
        to,
        subject: opts.subject,
        html,
        text,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
        ...(opts.attachments?.length ? { attachments: opts.attachments } : {}),
      }),
    })
    if (!res.ok) {
      console.error('Resend error:', res.status, await res.text())
      return false
    }
    return true
  } catch (err) {
    console.error('Resend request failed:', err)
    return false
  }
}
