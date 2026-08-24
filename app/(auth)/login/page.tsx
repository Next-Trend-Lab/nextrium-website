import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginClient from './LoginClient'

export const metadata = { title: 'Dashboard Login' }

interface Props {
  searchParams: Promise<{ message?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')
  const { message, error } = await searchParams
  return <LoginClient message={message} error={error} />
}