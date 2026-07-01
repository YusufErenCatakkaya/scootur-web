export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
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
  const { date, time, province, district, address, formData } = body
  const description = formData?.descriptionA || 'Beyan Yok'

  if (!date || !time || !address) {
    throw createError({ statusCode: 400, statusMessage: 'Lütfen zorunlu alanları doldurun.' })
  }

  const supabase = useSupabase()

  // First, verify the report belongs to the user
  const { data: existingReport } = await supabase
    .from('AccidentReport')
    .select('userId, formData')
    .eq('id', id)
    .single()

  if (!existingReport) {
    throw createError({ statusCode: 404, statusMessage: 'Tutanak bulunamadı' })
  }
  
  if (existingReport.userId !== payload.userId) {
    throw createError({ statusCode: 403, statusMessage: 'Bu işlem için yetkiniz yok' })
  }

  let uploadedPhotos = formData.photos || []
  
  // Upload new base64 photos if they exist
  if (formData && formData.photosBase64 && formData.photosBase64.length > 0) {
    for (let i = 0; i < formData.photosBase64.length; i++) {
      const base64Str = formData.photosBase64[i]
      const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      
      if (matches && matches.length === 3) {
        const mimeType = matches[1]
        const buffer = Buffer.from(matches[2], 'base64')
        const ext = mimeType.split('/')[1] || 'jpg'
        const fileName = `${payload.userId}_${Date.now()}_${i}.${ext}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('accident-photos')
          .upload(fileName, buffer, {
            contentType: mimeType,
            upsert: false
          })

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from('accident-photos')
            .getPublicUrl(uploadData.path)
            
          if (publicUrlData && publicUrlData.publicUrl) {
            uploadedPhotos.push(publicUrlData.publicUrl)
          }
        }
      }
    }
    
    // Clean up base64 payload to save DB space
    delete formData.photosBase64
  }
  formData.photos = uploadedPhotos

  // Upload Invoice Image if new base64 exists
  if (formData && formData.invoiceBase64) {
    const base64Str = formData.invoiceBase64
    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    if (matches && matches.length === 3) {
      const mimeType = matches[1]
      const buffer = Buffer.from(matches[2], 'base64')
      const ext = mimeType.split('/')[1] || 'jpg'
      const fileName = `${payload.userId}_${Date.now()}_invoice.${ext}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('accident-photos')
        .upload(fileName, buffer, { contentType: mimeType, upsert: false })

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage.from('accident-photos').getPublicUrl(uploadData.path)
        if (publicUrlData && publicUrlData.publicUrl) {
          formData.invoiceImage = publicUrlData.publicUrl
        }
      }
    }
    delete formData.invoiceBase64
  }

  const uploadSketch = async (base64Str, suffix) => {
    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    if (matches && matches.length === 3) {
      const mimeType = matches[1]
      const buffer = Buffer.from(matches[2], 'base64')
      const ext = mimeType.split('/')[1] || 'jpg'
      const fileName = `${payload.userId}_${Date.now()}_sketch_${suffix}.${ext}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('accident-photos')
        .upload(fileName, buffer, { contentType: mimeType, upsert: false })

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage.from('accident-photos').getPublicUrl(uploadData.path)
        if (publicUrlData && publicUrlData.publicUrl) {
          return publicUrlData.publicUrl
        }
      }
    }
    return null
  }

  // Upload Sketch Image A if exists
  if (formData && formData.sketchBase64_A) {
    formData.sketchImage_A = await uploadSketch(formData.sketchBase64_A, 'A')
    delete formData.sketchBase64_A
  }

  // Upload Sketch Image B if exists
  if (formData && formData.sketchBase64_B) {
    formData.sketchImage_B = await uploadSketch(formData.sketchBase64_B, 'B')
    delete formData.sketchBase64_B
  }

  const { data: report, error } = await supabase
    .from('AccidentReport')
    .update({
      date,
      time,
      province,
      district,
      address,
      description,
      formData: JSON.stringify(formData || {})
    })
    .eq('id', id)
    .select()
    .single()

  if (error || !report) {
    throw createError({ statusCode: 500, statusMessage: 'Tutanak güncellenemedi: ' + error?.message })
  }

  return { success: true, report }
})
