import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import fs from 'node:fs'
import path from 'node:path'

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

  const supabase = useSupabase()

  const { data: report } = await supabase
    .from('AccidentReport')
    .select(`*, user:User(*)`)
    .eq('id', id)
    .single()

  if (!report) {
    throw createError({ statusCode: 404, statusMessage: 'Tutanak bulunamadı' })
  }

  if (report.userId !== payload.userId) {
    throw createError({ statusCode: 403, statusMessage: 'Bu işlem için yetkiniz yok' })
  }

  const formData = JSON.parse(report.formData)
  const user = report.user

  const wrapText = (text, maxLength) => {
    if (!text) return []
    const words = String(text).split(' ')
    const lines = []
    let currentLine = ''
    for (const word of words) {
      if ((currentLine + word).length > maxLength) {
        lines.push(currentLine.trim())
        currentLine = word + ' '
      } else {
        currentLine += word + ' '
      }
    }
    if (currentLine) lines.push(currentLine.trim())
    return lines
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try {
      const [year, month, day] = dateStr.split('-')
      if (year && month && day) {
        return `${day}.${month}.${year}`
      }
      return dateStr
    } catch {
      return dateStr
    }
  }

  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)

  const host = getRequestHost(event)
  const protocol = getRequestProtocol(event)
  
  // Use absolute URL to fetch the font from the static assets
  const fontUrl = `${protocol}://${host}/Roboto-Regular.ttf`
  let fontBytes
  try {
    const fontRes = await fetch(fontUrl)
    if (!fontRes.ok) throw new Error('Font bulunamadı')
    fontBytes = await fontRes.arrayBuffer()
  } catch (err) {
    // Fallback to local file system if fetch fails (e.g. during local dev edge cases)
    fontBytes = fs.readFileSync(path.resolve('./public/Roboto-Regular.ttf'))
  }
  
  const customFont = await pdfDoc.embedFont(fontBytes)

  const page = pdfDoc.addPage([595.28, 841.89]) // A4
  const { width, height } = page.getSize()

  const primaryColor = rgb(0.85, 0.15, 0.15)
  const headerBg = rgb(0.95, 0.95, 0.95)
  const borderColor = rgb(0.8, 0.8, 0.8)
  const textColor = rgb(0.15, 0.15, 0.15)
  const labelColor = rgb(0.4, 0.4, 0.4)

  const drawLabel = (text, x, y) => page.drawText(String(text), { x, y, size: 9, font: customFont, color: labelColor })
  const drawValue = (text, x, y) => page.drawText(String(text), { x, y, size: 10, font: customFont, color: textColor })
  
  const drawSectionHeader = (title, y) => {
    page.drawRectangle({ x: 30, y: y - 15, width: width - 60, height: 25, color: headerBg })
    page.drawRectangle({ x: 30, y: y - 15, width: width - 60, height: 25, borderColor, borderWidth: 1 })
    page.drawText(String(title), { x: 40, y: y - 8, size: 12, font: customFont, color: primaryColor })
  }

  // HEADER
  page.drawText('SCOOTUR', { x: 30, y: height - 50, size: 28, font: customFont, color: primaryColor })
  page.drawText('TRAFİK KAZASI TESPİT TUTANAĞI', { x: 30, y: height - 70, size: 14, font: customFont, color: textColor })
  
  page.drawRectangle({ x: width - 170, y: height - 70, width: 140, height: 35, borderColor, borderWidth: 1, color: headerBg })
  page.drawText('Tutanak ID:', { x: width - 160, y: height - 50, size: 8, font: customFont, color: labelColor })
  page.drawText(report.id.split('-')[0].toUpperCase(), { x: width - 160, y: height - 62, size: 10, font: customFont, color: textColor })

  // 1. KAZA BİLGİLERİ
  let currentY = height - 110
  drawSectionHeader('1. KAZA BİLGİLERİ', currentY)
  
  page.drawRectangle({ x: 30, y: currentY - 55, width: width - 60, height: 40, borderColor, borderWidth: 1 })
  drawLabel('Tarih/Saat:', 40, currentY - 35); drawValue(`${formatDate(report.date)} ${report.time}`, 120, currentY - 35)
  drawLabel('İl/İlçe:', width / 2, currentY - 35); drawValue(`${report.province || '-'} / ${report.district || '-'}`, width / 2 + 50, currentY - 35)
  drawLabel('Adres:', 40, currentY - 55); drawValue(report.address || '-', 120, currentY - 55)

  // 2. TARAFLAR
  currentY -= 90
  drawSectionHeader('2. TARAFLARIN BİLGİLERİ', currentY)
  
  const b2Top = currentY - 15
  const b2Height = 300
  page.drawRectangle({ x: 30, y: b2Top - b2Height, width: width - 60, height: b2Height, borderColor, borderWidth: 1 })
  page.drawLine({ start: { x: width / 2, y: b2Top }, end: { x: width / 2, y: b2Top - b2Height }, thickness: 1, color: borderColor })

  // TARAF A
  page.drawText('TARAF A (Scooter Sürücüsü)', { x: 40, y: b2Top - 20, size: 11, font: customFont, color: primaryColor })
  drawLabel('Sürücü Adı:', 40, b2Top - 40); drawValue(`${user.firstName} ${user.lastName}`, 120, b2Top - 40)
  drawLabel('T.C. Kimlik No:', 40, b2Top - 55); drawValue(user.tcNo, 120, b2Top - 55)
  drawLabel('Tel No:', 40, b2Top - 70); drawValue(user.phone, 120, b2Top - 70)
  drawLabel('Scooter Seri No:', 40, b2Top - 85); drawValue(formData.driverA_Plate || '-', 120, b2Top - 85)

  // TARAF B
  const rightX = width / 2 + 10
  page.drawText('TARAF B (Diğer Araç/Şahıs)', { x: rightX, y: b2Top - 20, size: 11, font: customFont, color: primaryColor })
  drawLabel('Ad Soyad:', rightX, b2Top - 40); drawValue(formData.driverB_Name || '-', rightX + 80, b2Top - 40)
  drawLabel('T.C. Kimlik:', rightX, b2Top - 55); drawValue(formData.driverB_TcNo || '-', rightX + 80, b2Top - 55)
  drawLabel('Tel No:', rightX, b2Top - 70); drawValue(formData.driverB_Phone || '-', rightX + 80, b2Top - 70)
  drawLabel('Ehliyet S/N:', rightX, b2Top - 85); drawValue(`${formData.driverB_LicenseClass || '-'}`, rightX + 80, b2Top - 85)
  drawLabel('Verildiği İlçe:', rightX, b2Top - 100); drawValue(formData.driverB_LicenseDistrict || '-', rightX + 80, b2Top - 100)
  drawLabel('Adres:', rightX, b2Top - 115); drawValue(formData.driverB_Address || '-', rightX + 80, b2Top - 115)
  
  page.drawLine({ start: { x: rightX, y: b2Top - 130 }, end: { x: width - 30, y: b2Top - 130 }, thickness: 1, color: rgb(0.9,0.9,0.9) })
  
  drawLabel('Marka/Model:', rightX, b2Top - 145); drawValue(formData.vehicleB_Brand || '-', rightX + 80, b2Top - 145)
  drawLabel('Plaka:', rightX, b2Top - 160); drawValue(formData.vehicleB_Plate || '-', rightX + 80, b2Top - 160)
  drawLabel('Kullanım Şekli:', rightX, b2Top - 175); drawValue(formData.vehicleB_Usage || '-', rightX + 80, b2Top - 175)

  page.drawLine({ start: { x: rightX, y: b2Top - 190 }, end: { x: width - 30, y: b2Top - 190 }, thickness: 1, color: rgb(0.9,0.9,0.9) })
  
  drawLabel('Sigortalı Adı:', rightX, b2Top - 205); drawValue(formData.insuranceB_Name || '-', rightX + 80, b2Top - 205)
  drawLabel('Sigorta T.C.:', rightX, b2Top - 220); drawValue(formData.insuranceB_TcNo || '-', rightX + 80, b2Top - 220)
  drawLabel('Sigorta Şirketi:', rightX, b2Top - 235); drawValue(formData.insuranceB_Company || '-', rightX + 80, b2Top - 235)
  drawLabel('Acente No:', rightX, b2Top - 250); drawValue(formData.insuranceB_AgencyNo || '-', rightX + 80, b2Top - 250)
  drawLabel('Poliçe No:', rightX, b2Top - 265); drawValue(formData.insuranceB_PolicyNo || '-', rightX + 80, b2Top - 265)
  drawLabel('TRAMER No:', rightX, b2Top - 280); drawValue(formData.insuranceB_TramerNo || '-', rightX + 80, b2Top - 280)
  drawLabel('Poliçe Tarihi:', rightX, b2Top - 295); drawValue(formData.insuranceB_Date ? formatDate(formData.insuranceB_Date) : '-', rightX + 80, b2Top - 295)

  // 3. GÖRGÜ TANIKLARI
  currentY -= 335
  drawSectionHeader('3. GÖRGÜ TANIKLARI', currentY)
  
  let witnessY = currentY - 35
  let witnessCount = formData.witnesses && Array.isArray(formData.witnesses) ? formData.witnesses.length : 0
  let witnessBoxHeight = witnessCount > 0 ? (witnessCount * 20) + 10 : 30
  
  page.drawRectangle({ x: 30, y: currentY - 15 - witnessBoxHeight, width: width - 60, height: witnessBoxHeight, borderColor, borderWidth: 1 })

  if (witnessCount > 0) {
    formData.witnesses.forEach((w, i) => {
      drawValue(`${i+1}. ${w.name || '-'} | Tel: ${w.phone || '-'} | Adres: ${w.address || '-'}`, 40, witnessY)
      witnessY -= 20
    })
  } else {
    drawValue('Görgü tanığı belirtilmedi.', 40, witnessY)
  }

  // 4. BEYANLAR VE ÖZET
  currentY -= (30 + witnessBoxHeight)
  drawSectionHeader('4. KAZA ÖZETİ VE BEYANLAR', currentY)
  
  const descLinesA = wrapText(formData.descriptionA || 'Beyan yok.', 95)
  const descLinesB = wrapText(formData.descriptionB || 'Beyan yok.', 95)
  
  const descHeightA = descLinesA.length * 15 + 25
  const descHeightB = descLinesB.length * 15 + 25
  const descBoxHeight = descHeightA + descHeightB
  
  page.drawRectangle({ x: 30, y: currentY - 15 - descBoxHeight, width: width - 60, height: descBoxHeight, borderColor, borderWidth: 1 })
  
  let descY = currentY - 35
  page.drawText('TARAF A BEYANI:', { x: 40, y: descY, size: 9, font: customFont, color: primaryColor })
  descY -= 15
  descLinesA.forEach(l => {
    drawValue(l, 40, descY)
    descY -= 15
  })
  
  descY -= 5
  page.drawLine({ start: { x: 30, y: descY + 10 }, end: { x: width - 30, y: descY + 10 }, thickness: 1, color: rgb(0.9,0.9,0.9) })
  page.drawText('TARAF B BEYANI:', { x: 40, y: descY, size: 9, font: customFont, color: primaryColor })
  descY -= 15
  descLinesB.forEach(l => {
    drawValue(l, 40, descY)
    descY -= 15
  })

  // İMZALAR
  const sigY = currentY - descBoxHeight - 60
  if (sigY > 30) {
    page.drawLine({ start: { x: 60, y: sigY + 20 }, end: { x: 200, y: sigY + 20 }, thickness: 1, color: borderColor })
    page.drawText('TARAF A İMZA', { x: 100, y: sigY, size: 10, font: customFont, color: labelColor })
    
    page.drawLine({ start: { x: width - 200, y: sigY + 20 }, end: { x: width - 60, y: sigY + 20 }, thickness: 1, color: borderColor })
    page.drawText('TARAF B İMZA', { x: width - 170, y: sigY, size: 10, font: customFont, color: labelColor })
  }

  // GÖRSEL EKLENTİ YARDIMCI FONKSİYONU
  const appendImagePage = async (url, title) => {
    try {
      const res = await fetch(url)
      if (!res.ok) return
      const arrayBuffer = await res.arrayBuffer()
      
      let image
      try {
        if (url.toLowerCase().includes('.png')) {
          image = await pdfDoc.embedPng(arrayBuffer)
        } else {
          image = await pdfDoc.embedJpg(arrayBuffer)
        }
      } catch (e) {
        try {
           image = await pdfDoc.embedJpg(arrayBuffer)
        } catch(e2) {
           image = await pdfDoc.embedPng(arrayBuffer)
        }
      }
      
      const imgPage = pdfDoc.addPage([595.28, 841.89])
      const { width: iw, height: ih } = imgPage.getSize()
      
      imgPage.drawText(String(title), { x: 40, y: ih - 50, size: 16, font: customFont, color: rgb(0.9, 0.2, 0.2) })
      imgPage.drawLine({ start: { x: 40, y: ih - 60 }, end: { x: iw - 40, y: ih - 60 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) })
      
      const maxWidth = iw - 80
      const maxHeight = ih - 150
      const imgDims = image.scaleToFit(maxWidth, maxHeight)
      
      imgPage.drawImage(image, {
        x: iw / 2 - imgDims.width / 2,
        y: ih / 2 - imgDims.height / 2 - 20,
        width: imgDims.width,
        height: imgDims.height
      })
    } catch (e) {
      console.error('Gorsel eklenemedi:', title, e)
    }
  }

  // EKLER
  if (formData.invoiceImage) {
    await appendImagePage(formData.invoiceImage, 'SCOOTUR - SCOOTER FATURA GÖRSELİ')
  }

  if (formData.sketchImage_A) {
    await appendImagePage(formData.sketchImage_A, 'SCOOTUR - ÇARPIŞMA TASLAĞI (TARAF A)')
  }

  if (formData.sketchImage_B) {
    await appendImagePage(formData.sketchImage_B, 'SCOOTUR - ÇARPIŞMA TASLAĞI (TARAF B)')
  }

  if (formData.photos && formData.photos.length > 0) {
    for (let i = 0; i < formData.photos.length; i++) {
      await appendImagePage(formData.photos[i], `SCOOTUR - OLAY YERİ FOTOĞRAFI (${i + 1})`)
    }
  }

  const pdfBytes = await pdfDoc.save()
  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="Kaza_Tutanagi_${report.date}.pdf"`)

  return pdfBytes
})
