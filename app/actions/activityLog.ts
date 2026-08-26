'use server'

import { logActivity, type LogActivityParams } from '@/lib/activityLog'

export async function logActivityAction(params: LogActivityParams): Promise<void> {
  await logActivity(params)
}
