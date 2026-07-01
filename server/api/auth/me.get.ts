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

  const { data: user } = await supabase
    .from('User')
    .select('*')
    .eq('id', payload.userId)
    .single()

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      tcNo: user.tcNo,
      phone: user.phone,
      email: user.email,
      bloodGroup: user.bloodGroup,
      allergies: user.allergies,
      healthNotes: user.healthNotes,
      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone
    }
  }
})
