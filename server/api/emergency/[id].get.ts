export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID required' })
  }

  const supabase = useSupabase()

  const { data: user } = await supabase
    .from('User')
    .select('id, firstName, lastName, birthDate, bloodGroup, allergies, healthNotes, emergencyContactName, emergencyContactPhone')
    .eq('id', id)
    .single()

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'Kullanıcı bulunamadı.' })
  }

  // Only return health-related data (public for emergency responders)
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    birthDate: user.birthDate,
    bloodGroup: user.bloodGroup,
    allergies: user.allergies,
    healthNotes: user.healthNotes,
    emergencyContactName: user.emergencyContactName,
    emergencyContactPhone: user.emergencyContactPhone
  }
})
