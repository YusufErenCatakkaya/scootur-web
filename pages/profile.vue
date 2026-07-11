<template>
  <div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-scootur"></div>
    </div>
    
    <div v-else-if="user" class="grid md:grid-cols-3 gap-8">
      
      <!-- Profile Information -->
      <div class="md:col-span-2 space-y-6 overflow-hidden">
        
        <!-- View Mode -->
        <div v-if="!isEditing" class="space-y-6">
          <!-- Navigation Tabs -->
          <div class="flex border-b border-gray-200 mb-4 overflow-x-auto hide-scrollbar w-full">
            <button @click="activeTab = 'personal'" :class="['py-3 px-4 sm:px-6 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors', activeTab === 'personal' ? 'border-scootur text-scootur' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300']">
              <span class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Kişisel Bilgiler
              </span>
            </button>
            <button @click="activeTab = 'health'" :class="['py-3 px-4 sm:px-6 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors', activeTab === 'health' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300']">
              <span class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                Sağlık ve Acil Durum
              </span>
            </button>
          </div>

          <div v-if="activeTab === 'personal'" class="glass-card p-4 sm:p-6 animate-fade-in-up">
            <div class="flex justify-between items-center border-b pb-4 mb-4">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Kişisel Bilgiler</h2>
              <button @click="isEditing = true" class="text-scootur text-sm font-semibold hover:underline flex items-center gap-1 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Düzenle
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p class="text-sm text-gray-500">Ad Soyad</p>
                <p class="font-medium text-lg break-words">{{ user.firstName }} {{ user.lastName }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Doğum Tarihi</p>
                <p class="font-medium break-words">{{ user.birthDate || 'Belirtilmedi' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">T.C. Kimlik No</p>
                <p class="font-medium break-words">{{ user.tcNo }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Telefon</p>
                <p class="font-medium break-words">{{ user.phone }}</p>
              </div>
              <div class="col-span-1 sm:col-span-2">
                <p class="text-sm text-gray-500">E-posta</p>
                <p class="font-medium break-all">{{ user.email }}</p>
              </div>
            </div>
            <div class="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex flex-col sm:flex-row items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500 shrink-0 sm:mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <h4 class="font-semibold text-blue-900 text-sm">Kaza anında hazırlıklı olun!</h4>
                <p class="text-blue-800 text-sm mt-1">İlk yardım ekiplerinin sizinle veya yakınlarınızla hemen iletişime geçebilmesi için Sağlık ve Acil Durum bilgilerinizi doldurmayı unutmayın.</p>
                <button @click="activeTab = 'health'" class="mt-2 text-blue-700 font-bold text-sm hover:underline">Sağlık Bilgilerimi Gör &rarr;</button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'health'" class="glass-card p-4 sm:p-6 animate-fade-in-up">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-4 mb-4 border-red-100 gap-3">
              <h2 class="text-xl sm:text-2xl font-bold text-red-600 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Acil Durum Profiliniz
              </h2>
              <button @click="isEditing = true; activeTab = 'health'" class="text-red-500 text-sm font-semibold hover:underline flex items-center gap-1 self-start sm:self-auto shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Düzenle
              </button>
            </div>
            
            <div class="mb-4 pb-4 border-b border-red-100">
              <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Acil Durumda Ulaşılacak Kişi</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p class="text-sm text-gray-500">Ad Soyad</p>
                  <p class="font-medium break-words">{{ user.emergencyContactName || 'Belirtilmedi' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Telefon</p>
                  <p class="font-medium break-words">{{ user.emergencyContactPhone || 'Belirtilmedi' }}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Sağlık Bilgileri</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p class="text-sm text-gray-500">Kan Grubu</p>
                  <p class="font-bold text-xl text-red-500">{{ formatBloodGroup(user.bloodGroup) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Alerjiler</p>
                  <div class="flex flex-wrap gap-2 mt-1">
                    <span v-for="(alg, idx) in parsedAllergies" :key="idx" class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">{{ alg }}</span>
                    <span v-if="parsedAllergies.length === 0" class="font-medium text-gray-700">Yok</span>
                  </div>
                </div>
                <div class="col-span-1 sm:col-span-2">
                  <p class="text-sm text-gray-500">Kronik Rahatsızlıklar / Notlar</p>
                  <p class="font-medium bg-red-50 p-3 rounded-lg border border-red-100 mt-1 break-words">
                    {{ user.healthNotes || 'Herhangi bir sağlık notu bulunmuyor.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="glass-card p-4 sm:p-6 animate-fade-in-up">
          <div class="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar w-full">
            <button @click="activeTab = 'personal'" :class="['py-3 px-4 sm:px-6 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors', activeTab === 'personal' ? 'border-scootur text-scootur' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300']">
              Kişisel Bilgileri Düzenle
            </button>
            <button @click="activeTab = 'health'" :class="['py-3 px-4 sm:px-6 font-semibold text-sm border-b-2 whitespace-nowrap transition-colors', activeTab === 'health' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300']">
              Sağlık ve Acil Durum Bilgileri
            </button>
          </div>

          <form @submit.prevent="saveProfile" class="space-y-4">
            
            <div v-show="activeTab === 'personal'" class="animate-fade-in-up">
              <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">Kişisel Bilgileriniz</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Adınız</label>
                  <input type="text" v-model="editForm.firstName" @input="editForm.firstName = maskName($event.target.value)" required class="input-field" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Soyadınız</label>
                  <input type="text" v-model="editForm.lastName" @input="editForm.lastName = maskName($event.target.value)" required class="input-field" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
                  <input type="date" v-model="editForm.birthDate" required class="input-field" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input type="text" v-model="editForm.phone" @input="editForm.phone = maskPhone($event.target.value)" required class="input-field" />
                </div>
              </div>
            </div>
            
            <div v-show="activeTab === 'health'" class="animate-fade-in-up">
              <div class="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
                <h3 class="text-lg font-bold text-red-700 mb-1">Acil Durum Kişisi</h3>
                <p class="text-sm text-red-600 mb-4">Kaza anında QR okutulduğunda ilk yardım ekiplerinin göreceği ve hemen arayabileceği bir yakınınızın bilgisini giriniz.</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Yakınınızın Adı Soyadı</label>
                    <input type="text" v-model="editForm.emergencyContactName" @input="editForm.emergencyContactName = maskName($event.target.value)" class="input-field bg-white" placeholder="Örn: Ayşe Yılmaz" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Yakınınızın Telefonu</label>
                    <input type="tel" v-model="editForm.emergencyContactPhone" @input="editForm.emergencyContactPhone = maskPhone($event.target.value)" class="input-field bg-white" placeholder="05XX XXX XX XX" />
                  </div>
                </div>
              </div>

              <div class="bg-white p-4 rounded-xl border border-gray-200">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Sağlık Durumunuz</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kan Grubu</label>
                    <select v-model="editForm.bloodGroup" class="input-field bg-white w-full">
                      <option value="">Seçiniz</option>
                      <option value="A Rh+">A Rh+</option>
                      <option value="A Rh-">A Rh-</option>
                      <option value="B Rh+">B Rh+</option>
                      <option value="B Rh-">B Rh-</option>
                      <option value="AB Rh+">AB Rh+</option>
                      <option value="AB Rh-">AB Rh-</option>
                      <option value="0 Rh+">0 Rh+</option>
                      <option value="0 Rh-">0 Rh-</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Alerjileriniz</label>
                    <div class="flex gap-2 mb-2 w-full">
                      <input type="text" v-model="newAllergy" @keyup.enter.prevent="addAllergy" class="input-field flex-grow py-1 min-w-0" placeholder="Yazın ve + ya basın..." />
                      <button type="button" @click="addAllergy" class="btn-primary px-3 shadow-md shrink-0">+</button>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="(alg, idx) in editForm.allergiesList" :key="idx" class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium flex items-center gap-1">
                        {{ alg }}
                        <button type="button" @click="removeAllergy(idx)" class="text-red-900 hover:text-red-500 font-bold ml-1">&times;</button>
                      </span>
                      <span v-if="editForm.allergiesList.length === 0" class="text-xs text-gray-400 font-medium mt-1">Henüz alerji eklenmedi.</span>
                    </div>
                  </div>
                  <div class="col-span-1 sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kronik Rahatsızlıklar / Sağlık Notları</label>
                    <textarea v-model="editForm.healthNotes" rows="2" class="input-field resize-none bg-white w-full" placeholder="Varsa lütfen belirtin. Yoksa boş bırakabilirsiniz."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t mt-6">
              <button type="button" @click="cancelEdit" class="btn-secondary w-full sm:w-auto">İptal</button>
              <button type="submit" class="btn-primary shadow-md font-bold w-full sm:w-auto" :disabled="saving">
                {{ saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}
              </button>
            </div>
          </form>
        </div>

      </div>

      <!-- QR Code Section -->
      <div class="glass-card p-4 sm:p-6 flex flex-col items-center text-center animate-fade-in-up border-t-4 border-t-scootur h-fit w-full overflow-hidden" style="animation-delay: 0.3s">
        <h2 class="text-xl font-bold text-gray-900 mb-2">Scooter Sticker'ınız</h2>
        <p class="text-sm text-gray-500 mb-6">Bu QR kodu PDF olarak indirip scooter'ınızın arkasına yapıştırabilirsiniz.</p>
        
        <div class="bg-white p-4 rounded-2xl shadow-inner border border-gray-100 mb-6" id="qr-sticker">
          <div class="text-xs font-bold text-red-500 mb-2 uppercase tracking-wider">ACİL DURUM QR KODU</div>
          <div id="qr-wrapper">
            <qrcode-vue :value="qrCodeUrl" :size="200" level="H" class="mx-auto" render-as="canvas" />
          </div>
          <div class="mt-3 text-sm font-semibold text-gray-800">{{ user.firstName }} {{ user.lastName[0] }}.</div>
        </div>

        <button @click="downloadQRPdf" class="btn-primary w-full flex justify-center items-center gap-2" :disabled="generatingPdf">
          <svg v-if="generatingPdf" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {{ generatingPdf ? 'PDF Hazırlanıyor...' : "Sticker'ı PDF Olarak İndir" }}
        </button>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import { PDFDocument, rgb } from 'pdf-lib'

useHead({
  title: 'Profilim | Scootur'
})

const router = useRouter()
const user = ref(null)
const loading = ref(true)
const isEditing = ref(false)
const saving = ref(false)
const generatingPdf = ref(false)
const activeTab = ref('personal')

const editForm = ref({
  firstName: '',
  lastName: '',
  birthDate: '',
  phone: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  bloodGroup: '',
  allergiesList: [],
  healthNotes: ''
})

const newAllergy = ref('')

const parsedAllergies = computed(() => {
  if (!user.value || !user.value.allergies) return []
  try {
    const parsed = JSON.parse(user.value.allergies)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return user.value.allergies.split(',').map(a => a.trim()).filter(a => a)
  }
})

const addAllergy = () => {
  if (newAllergy.value.trim()) {
    editForm.value.allergiesList.push(newAllergy.value.trim())
    newAllergy.value = ''
  }
}

const removeAllergy = (idx) => {
  editForm.value.allergiesList.splice(idx, 1)
}

const qrCodeUrl = computed(() => {
  if (!user.value) return ''
  return `${window.location.origin}/emergency/${user.value.id}`
})

const fetchProfile = async () => {
  const token = localStorage.getItem('token')
  if (!token || token === 'null' || token === 'undefined') {
    router.push('/login')
    return
  }

  try {
    const response = await $fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    user.value = response.user
    
    let initAllergies = []
    try {
      if (user.value.allergies) {
        initAllergies = JSON.parse(user.value.allergies)
        if (!Array.isArray(initAllergies)) initAllergies = []
      }
    } catch (e) {
      initAllergies = user.value.allergies ? user.value.allergies.split(',').map(a => a.trim()).filter(a => a) : []
    }

    // Fill edit form
    editForm.value = {
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      birthDate: user.value.birthDate || '',
      phone: user.value.phone,
      emergencyContactName: user.value.emergencyContactName || '',
      emergencyContactPhone: user.value.emergencyContactPhone || '',
      bloodGroup: user.value.bloodGroup || '',
      allergiesList: initAllergies,
      healthNotes: user.value.healthNotes || ''
    }
  } catch (error) {
    if (error.response?.status === 401 || error.status === 401 || error.statusCode === 401) {
      localStorage.removeItem('token')
      window.dispatchEvent(new Event('auth-change'))
    }
    router.push('/login')
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfile)

const cancelEdit = () => {
  isEditing.value = false
  newAllergy.value = ''
  
  let initAllergies = []
  try {
    if (user.value.allergies) {
      initAllergies = JSON.parse(user.value.allergies)
      if (!Array.isArray(initAllergies)) initAllergies = []
    }
  } catch (e) {
    initAllergies = user.value.allergies ? user.value.allergies.split(',').map(a => a.trim()).filter(a => a) : []
  }

  // Reset form to current user values
  editForm.value = {
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    birthDate: user.value.birthDate || '',
    phone: user.value.phone,
    emergencyContactName: user.value.emergencyContactName || '',
    emergencyContactPhone: user.value.emergencyContactPhone || '',
    bloodGroup: user.value.bloodGroup || '',
    allergiesList: initAllergies,
    healthNotes: user.value.healthNotes || ''
  }
}

const saveProfile = async () => {
  saving.value = true
  const token = localStorage.getItem('token')
  
  // Serialize allergiesList back to string before saving
  const payload = { ...editForm.value }
  payload.allergies = JSON.stringify(payload.allergiesList)
  delete payload.allergiesList

  try {
    await $fetch('/api/auth/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    })
    await fetchProfile() // Refresh data
    isEditing.value = false
  } catch (error) {
    alert(error.data?.statusMessage || 'Profil güncellenirken bir hata oluştu.')
  } finally {
    saving.value = false
  }
}

const formatBloodGroup = (bg) => {
  if (!bg) return 'Belirtilmedi'
  if (bg.includes('Rh')) return bg
  return bg.replace('+', ' Rh+').replace('-', ' Rh-').replace('O', '0')
}

const downloadQRPdf = async () => {
  generatingPdf.value = true
  try {
    // 1. Get QR Code as image (Data URL) from the canvas element
    const canvas = document.querySelector('#qr-wrapper canvas')
    if (!canvas) throw new Error("QR kod bulunamadı")
    const qrImageBytes = canvas.toDataURL('image/png')
    
    // 2. Create a new PDF document using pdf-lib
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4 Size in points
    const { width, height } = page.getSize()
    
    // 3. Embed the QR Code image
    const qrImage = await pdfDoc.embedPng(qrImageBytes)
    const qrDims = qrImage.scale(1.5) // Scale up slightly
    
    // 4. Draw content to the PDF page
    page.drawText('SCOOTUR ACIL DURUM QR STICKER', {
      x: width / 2 - 150,
      y: height - 100,
      size: 18,
      color: rgb(0.8, 0.1, 0.1) // Red color
    })
    
    page.drawText('Bu QR kodu scooterinizin arkasina yapistirin.', {
      x: width / 2 - 145,
      y: height - 130,
      size: 12,
      color: rgb(0.3, 0.3, 0.3)
    })
    
    // Draw QR image centered
    page.drawImage(qrImage, {
      x: width / 2 - qrDims.width / 2,
      y: height - 150 - qrDims.height,
      width: qrDims.width,
      height: qrDims.height
    })
    
    // Draw User Name under QR
    page.drawText(`Kullanici: ${user.value.firstName} ${user.value.lastName[0]}.`, {
      x: width / 2 - 50,
      y: height - 180 - qrDims.height,
      size: 14,
      color: rgb(0, 0, 0)
    })
    
    // 5. Serialize PDF and Trigger Download
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Scootur_QR_${user.value.firstName}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
  } catch (err) {
    console.error(err)
    alert('PDF oluşturulurken bir hata oluştu.')
  } finally {
    generatingPdf.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}
</style>

