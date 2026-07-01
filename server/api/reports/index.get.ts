export default defineEventHandler(async (event) => {
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

  const { data: reports } = await supabase
    .from('AccidentReport')
    .select('*')
    .eq('userId', payload.userId)
    .order('createdAt', { ascending: false })

  return { reports: reports || [] }
})
