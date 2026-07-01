import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'E-posta ve şifre gereklidir.' })
  }

  const supabase = useSupabase()

  const { data: user } = await supabase
    .from('User')
    .select('*')
    .eq('email', email)
    .single()

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Kullanıcı bulunamadı.' })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Hatalı şifre.' })
  }

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
