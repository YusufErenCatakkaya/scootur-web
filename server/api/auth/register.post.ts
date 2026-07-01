import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { 
    firstName, lastName, birthDate, tcNo, phone, email, password,
    emergencyContactName, emergencyContactPhone, agreements
  } = body

  // Validate agreements
  if (!agreements?.kvkk || !agreements?.user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kullanıcı sözleşmesi ve KVKK onayı zorunludur.'
    })
  }

  if (!firstName || !lastName || !birthDate || !tcNo || !phone || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Lütfen tüm zorunlu alanları doldurun.'
    })
  }

  const supabase = useSupabase()

  // Check if user exists
  const { data: existingUser } = await supabase
    .from('User')
    .select('id')
    .or(`tcNo.eq.${tcNo},email.eq.${email},phone.eq.${phone}`)
    .single()

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bu TC Kimlik No, E-posta veya Telefon zaten kayıtlı.'
    })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  const { data: user, error } = await supabase
    .from('User')
    .insert({
      firstName,
      lastName,
      birthDate,
      tcNo,
      phone,
      email,
      password: hashedPassword,
      emergencyContactName,
      emergencyContactPhone
    })
    .select()
    .single()

  if (error || !user) {
    throw createError({ statusCode: 500, statusMessage: 'Kayıt olurken bir hata oluştu: ' + error?.message })
  }

  // Generate token
  const token = generateToken(user.id)

  return {
    success: true,
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  }
})
