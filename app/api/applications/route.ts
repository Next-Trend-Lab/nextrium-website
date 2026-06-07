import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') ?? ''
    let name = '', email = '', role_id = '', role_title = '', cover_note = '', cv_url = ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      name       = (formData.get('name')       as string) ?? ''
      email      = (formData.get('email')      as string) ?? ''
      role_id    = (formData.get('role_id')    as string) ?? ''
      cover_note = (formData.get('cover_note') as string) ?? ''

      const cvFile = formData.get('cv') as File | null
      if (cvFile && cvFile.size > 0) {
        const supabase = await createServiceClient()
        const ext      = cvFile.name.split('.').pop()
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const path     = `applications/${filename}`
        const arrayBuffer = await cvFile.arrayBuffer()
        const buffer      = Buffer.from(arrayBuffer)

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(path, buffer, { contentType: cvFile.type, upsert: false })

        if (!uploadError) {
          const { data } = supabase.storage.from('documents').getPublicUrl(path)
          cv_url = data.publicUrl
        }
      }
    } else {
      const body = await request.json()
      name       = body.name       ?? ''
      email      = body.email      ?? ''
      role_id    = body.role_id    ?? ''
      role_title = body.role_title ?? ''
      cover_note = body.cover_note ?? ''
    }

    if (!name.trim())  return NextResponse.json({ error: 'Name is required.' },  { status: 400 })
    if (!email.trim()) return NextResponse.json({ error: 'Email is required.' }, { status: 400 })

    const supabase = await createServiceClient()

    if (role_id && !role_title) {
      const { data: role } = await supabase.from('roles').select('title').eq('slug', role_id).single()
      if (role) role_title = role.title
    }

    const publicClient = await createClient()
    const { error: dbError } = await publicClient.from('applications').insert({
      name:       name.trim(),
      email:      email.trim(),
      role_id:    role_id    || null,
      role_title: role_title || null,
      cover_note: cover_note.trim() || null,
      cv_url:     cv_url     || null,
      status:     'pending',
    })

    if (dbError) throw new Error(dbError.message)

    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key':      process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender:  { name: 'NexTrium Website', email: process.env.BREVO_SENDER_EMAIL! },
        to:      [{ email: 'hello@nextrium.org', name: 'NexTrium' }],
        replyTo: { email: email.trim(), name: name.trim() },
        subject: `[NexTrium] New application from ${name.trim()}${role_title ? ` — ${role_title}` : ''}`,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #071628; color: #F5F6F8;">
            <div style="border-bottom: 2px solid #DB6727; padding-bottom: 16px; margin-bottom: 24px;">
              <h2 style="margin: 0; font-size: 20px; color: #ffffff;">New job application</h2>
              <p style="margin: 4px 0 0; font-size: 12px; color: #8A9BB0; text-transform: uppercase; letter-spacing: 0.1em;">${role_title || 'Open application'}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #8A9BB0; font-size: 12px; width: 120px;">Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #F5F6F8; font-size: 14px;">${name.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #8A9BB0; font-size: 12px;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #DB6727; font-size: 14px;"><a href="mailto:${email.trim()}" style="color: #DB6727;">${email.trim()}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #8A9BB0; font-size: 12px;">Role</td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #F5F6F8; font-size: 14px;">${role_title || 'Open application'}</td>
              </tr>
              ${cv_url ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #8A9BB0; font-size: 12px;">CV</td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px;"><a href="${cv_url}" style="color: #DB6727;">Download CV →</a></td>
              </tr>` : ''}
            </table>
            ${cover_note.trim() ? `
            <div style="background: #0D233D; padding: 20px; border-left: 3px solid #DB6727;">
              <p style="margin: 0 0 8px; color: #8A9BB0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Cover note</p>
              <p style="margin: 0; color: #F5F6F8; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${cover_note.trim()}</p>
            </div>` : ''}
            <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06);">
              <a href="mailto:${email.trim()}?subject=Re: Your application to NexTrium" style="display: inline-block; padding: 12px 24px; background: #DB6727; color: #ffffff; text-decoration: none; font-size: 13px;">Reply to ${name.trim()} →</a>
            </div>
            <p style="margin-top: 24px; font-size: 11px; color: #2E3F54;">This application was submitted via nextrium.org/careers</p>
          </div>
        `,
      }),
    })

    if (!brevoRes.ok) {
      const brevoError = await brevoRes.json()
      console.error('Brevo error:', brevoError)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Applications route error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Something went wrong.' },
      { status: 500 }
    )
  }
}