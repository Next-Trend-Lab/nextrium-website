import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') ?? ''
    let name = '', email = '', role_id = '', role_title = '', cover_note = '', cv_url = ''

    let phone = '', location = '', linkedin_url = '', portfolio_url = '', github_url = '', design_url = '', published_work_url = '', currently_building = ''
    let project_links: { url: string; description: string }[] = []

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      name                = (formData.get('name')                as string) ?? ''
      email               = (formData.get('email')               as string) ?? ''
      role_id             = (formData.get('role_id')              as string) ?? ''
      role_title          = (formData.get('role_title')           as string) ?? ''
      cover_note          = (formData.get('cover_note')           as string) ?? ''
      phone               = (formData.get('phone')                as string) ?? ''
      location            = (formData.get('location')             as string) ?? ''
      linkedin_url        = (formData.get('linkedin_url')         as string) ?? ''
      portfolio_url       = (formData.get('portfolio_url')        as string) ?? ''
      github_url          = (formData.get('github_url')           as string) ?? ''
      design_url          = (formData.get('design_url')           as string) ?? ''
      published_work_url  = (formData.get('published_work_url')   as string) ?? ''
      currently_building  = (formData.get('currently_building')   as string) ?? ''

      for (let i = 1; i <= 3; i++) {
        const url  = formData.get(`project_link_${i}_url`)  as string | null
        const desc = formData.get(`project_link_${i}_desc`) as string | null
        if (url && url.trim()) {
          project_links.push({ url: url.trim(), description: desc?.trim() ?? '' })
        }
      }

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
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text   = await request.text()
      const params = new URLSearchParams(text)
      name       = params.get('name')       ?? ''
      email      = params.get('email')      ?? ''
      role_id    = params.get('role_id')    ?? ''
      role_title = params.get('role_title') ?? ''
      cover_note = params.get('cover_note') ?? ''
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

    const supabase = createServiceClient()

    if (role_id) {
      const { data: role } = await supabase.from('roles').select('title').eq('slug', role_id).single()
      if (role && 'title' in role) role_title = (role as { title: string }).title
    }

    const { data: existing } = await supabase
      .from('applications')
      .select('id, status')
      .eq('email', email.trim())
      .eq('role_id', role_id || '')
      .neq('status', 'rejected')
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'You have already submitted an application for this position.' },
        { status: 409 }
      )
    }

    const { error: dbError } = await (supabase.from('applications') as any).insert({
      name:                name.trim(),
      email:               email.trim(),
      role_id:             role_id    || null,
      role_title:          role_title || null,
      cover_note:          cover_note.trim() || null,
      cv_url:              cv_url     || null,
      phone:               phone.trim()               || null,
      location:            location.trim()             || null,
      linkedin_url:        linkedin_url.trim()         || null,
      portfolio_url:       portfolio_url.trim()        || null,
      github_url:          github_url.trim()           || null,
      design_url:          design_url.trim()           || null,
      published_work_url:  published_work_url.trim()   || null,
      currently_building:  currently_building.trim()   || null,
      project_links:       project_links.length > 0 ? project_links : null,
      status:              'pending',
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

    // Send confirmation email to applicant
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key':      process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender:  { name: 'NexTrium', email: process.env.BREVO_SENDER_EMAIL! },
        to:      [{ email: email.trim(), name: name.trim() }],
        subject: `We received your application${role_title ? ` — ${role_title}` : ''} | NexTrium`,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #071628; color: #F5F6F8;">
            <div style="border-bottom: 2px solid #DB6727; padding-bottom: 16px; margin-bottom: 24px;">
              <h2 style="margin: 0; font-size: 20px; color: #ffffff;">Application received.</h2>
              <p style="margin: 4px 0 0; font-size: 12px; color: #8A9BB0; text-transform: uppercase; letter-spacing: 0.1em;">${role_title || 'Open application'}</p>
            </div>
            <p style="font-size: 15px; color: #F5F6F8; line-height: 1.7; margin-bottom: 16px;">Hi ${name.trim()},</p>
            <p style="font-size: 15px; color: #8A9BB0; line-height: 1.7; margin-bottom: 24px;">
              Thank you for applying${role_title ? ` for the ${role_title} position` : ''} at NexTrium. We have received your application and will review it carefully.
            </p>
            <p style="font-size: 15px; color: #8A9BB0; line-height: 1.7; margin-bottom: 32px;">
              We read every application and respond to everyone within two weeks. If your background is a strong fit, we will be in touch to discuss next steps.
            </p>
            <div style="background: #0D233D; padding: 20px; border-left: 3px solid #DB6727; margin-bottom: 32px;">
              <p style="margin: 0; font-size: 13px; color: #8A9BB0; line-height: 1.7;">
                In the meantime, explore what we are building at <a href="https://nextrium.org" style="color: #DB6727;">nextrium.org</a>
              </p>
            </div>
            <p style="font-size: 13px; color: #2E3F54;">NexTrium Global Innovations Ltd · Lagos, Nigeria</p>
          </div>
        `,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Applications route error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Something went wrong.' },
      { status: 500 }
    )
  }
}