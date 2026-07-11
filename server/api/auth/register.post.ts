import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  let { 
    firstName, lastName, birthDate, tcNo, phone, email, password,
    emergencyContactName, emergencyContactPhone, agreements
  } = body

  // Sanitize inputs
  if (tcNo) tcNo = String(tcNo).replace(/\D/g, '')
  if (phone) phone = String(phone).replace(/\D/g, '')
  if (email) email = String(email).trim().toLowerCase()

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
  
  if (tcNo.length !== 11) {
    throw createError({ statusCode: 400, statusMessage: 'TC Kimlik No 11 haneli olmalıdır.' })
  }

  // Password Rules Validation
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  if (password.length < 8 || !hasUpperCase || !hasLowerCase || !hasNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Şifreniz kurallara uymuyor (En az 8 karakter, büyük harf, küçük harf ve rakam içermelidir).'
    })
  }

  const supabase = useSupabase()

  // Check if user exists
  const { data: existingUsers } = await supabase
    .from('User')
    .select('id')
    .or(`tcNo.eq.${tcNo},email.eq.${email},phone.eq.${phone}`)
    .limit(1)

  if (existingUsers && existingUsers.length > 0) {
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
