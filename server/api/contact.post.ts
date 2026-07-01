export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, subject, message } = body

  if (!name || !email || !subject || !message) {
    throw createError({ statusCode: 400, statusMessage: 'Lütfen tüm alanları doldurun.' })
  }

  const supabase = useSupabase()

  const { error } = await supabase
    .from('ContactMessage')
    .insert({
      name,
      email,
      subject,
      message
    })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Mesajınız gönderilemedi. Lütfen tekrar deneyin.' })
  }

  return { success: true }
})
