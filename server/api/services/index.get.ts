export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const province = query.province as string
  const district = query.district as string

  if (!province || !district) {
    throw createError({ statusCode: 400, statusMessage: 'İl ve İlçe parametreleri zorunludur.' })
  }

  const supabase = useSupabase()

  const { data: shops, error } = await supabase
    .from('ServiceShop')
    .select('id, name, province, district, address, phone')
    .eq('province', province)
    .eq('district', district)
    .order('name', { ascending: true })

  if (error) {
    console.error('Service shops fetch error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Servis noktaları getirilirken bir hata oluştu.' })
  }

  return { shops }
})
