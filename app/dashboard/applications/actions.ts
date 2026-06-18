'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteApplication(id: string): Promise<{ error?: string }> {
  try {
    const supabase = createServiceClient()
    const { error } = await (supabase.from('applications') as any)
      .delete()
      .eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/applications')
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to delete application.' }
  }
}