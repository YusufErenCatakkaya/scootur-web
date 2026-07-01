<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <!-- Hero Section -->
    <div class="text-center mb-12 animate-fade-in-up">
      <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h1 class="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Scooter Servis Noktaları</h1>
      <p class="text-lg text-gray-500 max-w-2xl mx-auto">
        Kaza sonrası tamir, rutin bakım veya yedek parça ihtiyacınız için size en yakın anlaşmalı scooter servislerini bulun.
      </p>
    </div>

    <!-- Search / Filter Card -->
    <div class="glass-card p-6 md:p-8 mb-10 max-w-3xl mx-auto animate-fade-in-up" style="animation-delay: 0.1s">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Bulunduğunuz İl</label>
          <div class="relative">
            <select v-model="selectedProvince" @change="onProvinceChange" class="input-field bg-white appearance-none pl-4 pr-10 py-3 w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-medium">
              <option value="">İl Seçiniz</option>
              <option v-for="prov in provinces" :key="prov.id" :value="prov.name">{{ prov.name }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Bulunduğunuz İlçe</label>
          <div class="relative">
            <select v-model="selectedDistrict" :disabled="!selectedProvince" class="input-field bg-white appearance-none pl-4 pr-10 py-3 w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-medium disabled:opacity-50 disabled:bg-gray-100">
              <option value="">İlçe Seçiniz</option>
              <option v-for="dist in districts" :key="dist.id" :value="dist.name">{{ dist.name }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-6 flex justify-center">
        <button @click="searchShops" :disabled="!selectedProvince || !selectedDistrict || loading" class="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Servis Bul
        </button>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="searched">
      <div v-if="shops.length === 0 && !loading" class="text-center py-16 animate-fade-in-up">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-xl font-bold text-gray-800 mb-2">Sonuç Bulunamadı</h3>
        <p class="text-gray-500">Seçtiğiniz <b>{{ selectedProvince }} / {{ selectedDistrict }}</b> bölgesinde henüz anlaşmalı bir servis noktamız bulunmuyor.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(shop, index) in shops" :key="shop.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group animate-fade-in-up" :style="{ animationDelay: (index * 0.1) + 's' }">
          <div class="p-6 flex-grow">
            <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2 leading-tight">{{ shop.name }}</h3>
            
            <div class="space-y-3 mt-4">
              <div class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="text-sm text-gray-600 leading-relaxed">{{ shop.address }}</p>
              </div>
              <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p class="text-sm text-gray-600 font-medium">{{ shop.phone || 'Telefon bulunmuyor' }}</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 p-4 border-t border-gray-100 flex gap-3">
            <a v-if="shop.phone" :href="`tel:${shop.phone.replace(/\s+/g, '')}`" class="flex-1 py-2.5 px-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg text-center text-sm transition-colors flex items-center justify-center gap-2">
              Ara
            </a>
            <a :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name + ' ' + shop.province + ' ' + shop.district)}`" target="_blank" class="flex-[2] py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center text-sm transition-colors flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Yol Tarifi Al
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

useHead({
  title: 'Servis Noktaları | Scootur'
})

const provinces = ref([])
const districts = ref([])
const selectedProvince = ref('')
const selectedDistrict = ref('')

const shops = ref([])
const loading = ref(false)
const searched = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('/cities.json')
    const data = await res.json()
    if (Array.isArray(data)) {
      provinces.value = data.sort((a,b) => a.name.localeCompare(b.name))
    }
  } catch(err) {
    console.error('İller yüklenemedi', err)
  }
})

const onProvinceChange = () => {
  const province = provinces.value.find(p => p.name === selectedProvince.value)
  if (province) {
    districts.value = province.districts.sort((a,b) => a.name.localeCompare(b.name))
  } else {
    districts.value = []
  }
  selectedDistrict.value = ''
  searched.value = false
}

const searchShops = async () => {
  if (!selectedProvince.value || !selectedDistrict.value) return
  
  loading.value = true
  searched.value = true
  
  try {
    const response = await $fetch('/api/services', {
      query: {
        province: selectedProvince.value,
        district: selectedDistrict.value
      }
    })
    shops.value = response.shops || []
  } catch (error) {
    console.error('Fetch error:', error)
    alert('Servis noktaları alınırken bir hata oluştu.')
    shops.value = []
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}
</style>

