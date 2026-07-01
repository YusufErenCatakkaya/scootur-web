import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  const authHeader = getHeader(event, 'Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  
  const token = authHeader.split(' ')[1]
  const payload = verifyToken(token)
  
  if (!payload || !payload.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  const supabase = useSupabase()

  const { data: report, error } = await supabase
    .from('AccidentReport')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !report) {
    throw createError({ statusCode: 404, statusMessage: 'Tutanak bulunamadı' })
  }

  if (report.userId !== payload.userId) {
    throw createError({ statusCode: 403, statusMessage: 'Bu işlem için yetkiniz yok' })
  }

  return { success: true, report }
})
