export const maskTC = (val) => {
  if (!val) return ''
  return String(val).replace(/\D/g, '').slice(0, 11)
}

export const maskPhone = (val) => {
  if (!val) return ''
  return String(val).replace(/\D/g, '').slice(0, 11)
}

export const maskPlate = (val) => {
  if (!val) return ''
  return String(val).replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase().slice(0, 15)
}

export const maskNumeric = (val) => {
  if (!val) return ''
  return String(val).replace(/\D/g, '')
}

export const maskName = (val) => {
  if (!val) return ''
  // Rakamları ve özel karakterleri engelle (Boşluk ve Türkçe karakterler serbest)
  return String(val).replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, '')
}
