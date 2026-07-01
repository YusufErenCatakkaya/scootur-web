export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { province, district } = query
  
  const supabase = useSupabase()
  
  let dbQuery = supabase.from('ServiceShop').select('*')
  
  if (province) {
    dbQuery = dbQuery.eq('province', province)
  }
  
  if (district) {
    dbQuery = dbQuery.eq('district', district)
  }
  
  const { data: services, error } = await dbQuery
  
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  
  return { services: services || [] }
})
