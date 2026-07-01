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

  const body = await readBody(event)
  const { firstName, lastName, birthDate, phone, bloodGroup, allergies, healthNotes, emergencyContactName, emergencyContactPhone } = body

  if (!firstName || !lastName || !birthDate || !phone) {
    throw createError({ statusCode: 400, statusMessage: 'Zorunlu alanları doldurun.' })
  }

  const supabase = useSupabase()

  const { data: updatedUser, error } = await supabase
    .from('User')
    .update({
      firstName,
      lastName,
      birthDate,
      phone,
      bloodGroup,
      allergies,
      healthNotes,
      emergencyContactName,
      emergencyContactPhone,
      updatedAt: new Date().toISOString()
    })
    .eq('id', payload.userId)
    .select()
    .single()

  if (error || !updatedUser) {
    throw createError({ statusCode: 500, statusMessage: 'Profil güncellenemedi.' })
  }

  // Prevent sending password
  updatedUser.password = undefined

  return { success: true, user: updatedUser }
})
