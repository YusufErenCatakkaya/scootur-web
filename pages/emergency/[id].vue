<template>
  <div class="min-h-screen bg-gradient-to-br from-red-600 via-rose-700 to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Design Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-black/20 rounded-full blur-3xl"></div>
    </div>

    <div class="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up z-10 border border-white/20">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-50 to-white px-6 py-10 text-center border-b border-red-100 relative">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
        <div class="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(239,68,68,0.2)] border-4 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 class="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Acil Durum Profili</h1>
        <p class="text-red-500 font-semibold text-sm uppercase tracking-widest">İlk Yardım İçindir</p>
      </div>

      <!-- Content -->
      <div v-if="pending" class="p-16 flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-red-600"></div>
      </div>
      
      <div v-else-if="error" class="p-10 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-500 font-medium">Kullanıcı profili bulunamadı veya bir hata oluştu.</p>
      </div>

      <div v-else class="p-8 space-y-8">
        <div class="text-center">
          <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Sürücü Kimliği</p>
          <p class="text-3xl font-black text-gray-900">{{ user.firstName }} {{ user.lastName }}</p>
          <div class="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-gray-100 rounded-full">
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            <p v-if="user.birthDate" class="text-sm text-gray-700 font-semibold">{{ calculateAge(user.birthDate) }} Yaşında</p>
          </div>
        </div>

        <!-- Acil Durum Kişisi -->
        <div v-if="user.emergencyContactName || user.emergencyContactPhone" class="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-100 shadow-sm text-center">
          <p class="text-xs text-green-800 font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Acil Durumda Aranacak Kişi
          </p>
          <p class="text-xl font-bold text-gray-900 break-words">{{ user.emergencyContactName || 'Belirtilmedi' }}</p>
          <a v-if="user.emergencyContactPhone" :href="`tel:${user.emergencyContactPhone}`" class="inline-block mt-3 px-6 py-2 bg-green-500 text-white rounded-full font-bold shadow-md hover:bg-green-600 transition-colors break-words max-w-full text-center">
            Hemen Ara:<br/>{{ user.emergencyContactPhone }}
          </a>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl border border-gray-100 text-center shadow-sm">
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Kan Grubu</p>
            <p class="text-4xl font-black text-red-600">{{ formatBloodGroup(user.bloodGroup) }}</p>
          </div>
          <div class="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl border border-gray-100 text-center flex flex-col justify-center shadow-sm overflow-hidden">
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Alerji</p>
            <p class="text-xl font-extrabold text-gray-800 break-words max-w-full overflow-hidden">{{ parsedAllergies }}</p>
          </div>
        </div>

        <div class="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-bl-full opacity-50"></div>
          <p class="text-xs text-red-800 font-bold uppercase tracking-wider mb-3 flex items-center gap-2 relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Önemli Sağlık Notları
          </p>
          <p class="text-gray-800 font-medium leading-relaxed relative z-10 break-words max-w-full">
            {{ user.healthNotes || 'Kullanıcının belirttiği özel bir sağlık notu bulunmamaktadır.' }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 p-5 text-center border-t border-gray-100">
        <p class="text-xs font-bold text-gray-400 tracking-wider">POWERED BY SCOOTUR</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

definePageMeta({
  layout: false // Hide default navbar/footer for emergency page
})

useHead({
  title: 'Acil Durum Profili | Scootur'
})

const route = useRoute()
const userId = route.params.id

const { data: user, pending, error } = useFetch(`/api/emergency/${userId}`)

const parsedAllergies = computed(() => {
  if (!user.value || !user.value.allergies) return 'Yok'
  try {
    const parsed = JSON.parse(user.value.allergies)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed.join(', ') : 'Yok'
  } catch (e) {
    return user.value.allergies
  }
})

const formatBloodGroup = (bg) => {
  if (!bg) return '?'
  if (bg.includes('Rh')) return bg
  return bg.replace('+', ' Rh+').replace('-', ' Rh-').replace('O', '0')
}

const calculateAge = (birthDate) => {
  if (!birthDate) return '?'
  const diffMs = Date.now() - new Date(birthDate).getTime()
  const ageDt = new Date(diffMs)
  return Math.abs(ageDt.getUTCFullYear() - 1970)
}
</script>

<style scoped>
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(20px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
