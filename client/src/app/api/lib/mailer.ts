export async function sendEmail({
  to,
  subject,
  html,
}: { to: string; subject: string; html: string }) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || 'no-reply@example.com'

  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — logging email instead of sending.')
    console.warn('To:', to)
    console.warn('Subject:', subject)
    console.warn('HTML:', html)
    return { ok: true, simulated: true }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend failed: ${res.status} ${text}`)
  }

  return res.json()
}