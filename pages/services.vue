<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <div class="text-center mb-10 animate-fade-in-up">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Servis Noktaları</h1>
      <p class="text-gray-600 max-w-2xl mx-auto text-lg">
        Size en yakın yetkili ve güvenilir scooter tamir ve bakım merkezlerini bulabilir, yol tarifi alabilirsiniz.
      </p>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-fade-in-up" style="animation-delay: 0.1s">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">İl</label>
          <select v-model="selectedProvince" @change="onProvinceChange" class="input-field bg-white">
            <option value="">Tüm İller</option>
            <option v-for="prov in provinces" :key="prov.name" :value="prov.name">{{ prov.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">İlçe</label>
          <select v-model="selectedDistrict" @change="fetchServices" :disabled="!selectedProvince" class="input-field bg-white disabled:opacity-50 disabled:bg-gray-50">
            <option value="">Tüm İlçeler</option>
            <option v-for="dist in districts" :key="dist.name" :value="dist.name">{{ dist.name }}</option>
          </select>
        </div>
        <div>
          <button @click="resetFilters" class="btn-secondary w-full py-3 h-auto font-medium text-gray-600">Filtreleri Temizle</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-scootur"></div>
    </div>

    <div v-else-if="services.length === 0" class="text-center py-16 px-4 glass-card animate-fade-in-up" style="animation-delay: 0.2s">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 class="text-2xl font-semibold text-gray-800 mb-2">Servis Bulunamadı</h3>
      <p class="text-gray-500">Seçtiğiniz bölgede henüz kayıtlı bir servis noktası bulunmuyor.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(shop, index) in services" :key="shop.id" 
           class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group animate-fade-in-up"
           :style="{ animationDelay: (0.1 + index * 0.05) + 's' }">
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900 group-hover:text-scootur transition-colors">{{ shop.name }}</h3>
          <div class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-3">
            {{ shop.province }}
          </div>
        </div>
        
        <div class="space-y-3 mb-6 flex-grow">
          <div class="flex items-start gap-3 text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span><strong class="font-medium text-gray-800">{{ shop.district }}</strong>, {{ shop.address }}</span>
          </div>
          
          <div class="flex items-center gap-3 text-sm text-gray-600" v-if="shop.phone">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a :href="`tel:${shop.phone}`" class="hover:text-scootur font-medium">{{ shop.phone }}</a>
          </div>
        </div>
        
        <a :href="getMapsLink(shop)" target="_blank" class="w-full flex items-center justify-center gap-2 btn-primary py-3 rounded-xl shadow-md hover:shadow-lg font-semibold mt-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clip-rule="evenodd" />
          </svg>
          Yol Tarifi Al
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

useHead({
  title: 'Servis Noktaları | Scootur'
})

const loading = ref(true)
const services = ref([])
const provinces = ref([])
const districts = ref([])

const selectedProvince = ref('')
const selectedDistrict = ref('')

const fetchCities = async () => {
  try {
    const res = await fetch('/cities.json')
    const data = await res.json()
    if (Array.isArray(data)) {
      provinces.value = data.sort((a,b) => a.name.localeCompare(b.name))
    }
  } catch(err) {
    console.error('İller yüklenemedi', err)
  }
}

const onProvinceChange = () => {
  const province = provinces.value.find(p => p.name === selectedProvince.value)
  if (province) {
    districts.value = province.districts.sort((a,b) => a.name.localeCompare(b.name))
  } else {
    districts.value = []
  }
  selectedDistrict.value = ''
  fetchServices()
}

const fetchServices = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (selectedProvince.value) params.append('province', selectedProvince.value)
    if (selectedDistrict.value) params.append('district', selectedDistrict.value)
    
    const { services: data } = await $fetch(`/api/services?${params.toString()}`)
    services.value = data
  } catch (error) {
    console.error('Servisler yüklenemedi:', error)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  selectedProvince.value = ''
  selectedDistrict.value = ''
  districts.value = []
  fetchServices()
}

const getMapsLink = (shop) => {
  const query = `${shop.name} ${shop.address} ${shop.district} ${shop.province}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

onMounted(async () => {
  await fetchCities()
  await fetchServices()
})
</script>

<style scoped>
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
  opacity: 0;
}
</style>

