<template>
  <div class="max-w-4xl mx-auto py-8">
    <div class="flex justify-between items-center mb-8 animate-fade-in-up">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Tutanaklarım</h1>
        <p class="text-gray-500 mt-1">Geçmiş kaza tutanaklarınızı görüntüleyin ve PDF olarak indirin.</p>
      </div>
      <NuxtLink to="/reports/new" class="btn-primary flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Yeni Tutanak Oluştur
      </NuxtLink>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-scootur"></div>
    </div>
    
    <div v-else-if="reports.length === 0" class="glass-card p-12 text-center animate-fade-in-up" style="animation-delay: 0.1s">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-xl font-medium text-gray-900 mb-2">Henüz Tutanak Yok</h3>
      <p class="text-gray-500 mb-6">Sistemde kayıtlı bir kaza tutanağınız bulunmamaktadır.</p>
      <NuxtLink to="/reports/new" class="btn-primary inline-flex">Hemen Oluştur</NuxtLink>
    </div>

    <div v-else class="grid gap-6">
      <div v-for="(report, index) in reports" :key="report.id" 
           class="glass-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center animate-fade-in-up" 
           :style="{ animationDelay: (index * 0.1) + 's' }">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wide">
              Kaza Kaydı
            </span>
            <span class="text-sm font-medium text-gray-500 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ report.date }} - {{ report.time }}
            </span>
          </div>
          <h3 class="text-lg font-bold text-gray-900 line-clamp-1">{{ report.address }}</h3>
          <p class="text-gray-600 text-sm line-clamp-2 mt-1 max-w-2xl">{{ report.description }}</p>
        </div>
        
        <div class="mt-4 sm:mt-0 flex flex-wrap gap-2 shrink-0 ml-4">
          <NuxtLink :to="`/reports/${report.id}/edit`" class="btn-secondary flex items-center gap-2 text-gray-700 hover:text-gray-900 border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Düzenle
          </NuxtLink>
          <button @click="downloadPDF(report.id)" class="btn-secondary flex items-center gap-2 text-scootur border-scootur/30 hover:bg-scootur hover:text-white group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            PDF İndir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

useHead({
  title: 'Tutanaklarım | Scootur'
})

const router = useRouter()
const reports = ref([])
const loading = ref(true)

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token || token === 'null' || token === 'undefined') {
    router.push('/login')
    return
  }

  try {
    const response = await $fetch('/api/reports', {
      headers: { Authorization: `Bearer ${token}` }
    })
    reports.value = response.reports
  } catch (error) {
    console.error('Failed to fetch reports', error)
    if (error.response?.status === 401 || error.status === 401 || error.statusCode === 401) {
      localStorage.removeItem('token')
      window.dispatchEvent(new Event('auth-change'))
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
})

const downloadPDF = async (id) => {
  const token = localStorage.getItem('token')
  try {
    const response = await $fetch(`/api/reports/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    })
    
    // Create blob link to download
    const url = window.URL.createObjectURL(response)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Kaza_Tutanagi_${id.substring(0,6)}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    alert('PDF oluşturulurken bir hata oluştu.')
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

