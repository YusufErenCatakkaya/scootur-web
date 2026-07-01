<template>
  <div class="min-h-screen flex flex-col bg-slate-50 font-sans text-gray-800">
    <header class="sticky top-0 z-50 glass-card rounded-none border-t-0 border-l-0 border-r-0 border-b border-gray-200 shadow-sm px-6 py-4 transition-all duration-300">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <NuxtLink to="/" class="text-2xl font-bold text-scootur flex items-center gap-2">
            <!-- Logo Placeholder (PNG) -->
            <img src="/logo.png" alt="Scootur Logo" class="h-12 w-auto object-contain" @error="$event.target.style.display='none'" />
          </NuxtLink>
        </div>
        
        <!-- Desktop Nav -->
        <nav class="hidden md:flex gap-6 items-center">
          <NuxtLink to="/" class="text-gray-600 hover:text-scootur font-medium transition-colors">Ana Sayfa</NuxtLink>
          <NuxtLink to="/services" class="text-gray-600 hover:text-scootur font-medium transition-colors">Servis Noktaları</NuxtLink>
          <NuxtLink v-if="isAuthenticated" to="/reports" class="text-gray-600 hover:text-scootur font-medium transition-colors">Tutanaklarım</NuxtLink>
          <NuxtLink v-if="isAuthenticated" to="/profile" class="text-gray-600 hover:text-scootur font-medium transition-colors">Profilim</NuxtLink>
          
          <div v-if="isAuthenticated" class="flex gap-3 ml-4 border-l pl-4 border-gray-200">
            <button @click="logout" class="btn-secondary py-2 px-4 text-sm font-semibold">Çıkış Yap</button>
            <NuxtLink to="/reports/new" class="btn-primary py-2 px-4 text-sm font-semibold shadow-sm hover:shadow-md">Yeni Tutanak</NuxtLink>
          </div>
          <div v-else class="flex gap-3 ml-4 border-l pl-4 border-gray-200">
            <NuxtLink to="/login" class="btn-secondary py-2 px-4 text-sm font-semibold">Giriş Yap</NuxtLink>
            <NuxtLink to="/register" class="btn-primary py-2 px-4 text-sm font-semibold shadow-sm hover:shadow-md">Kayıt Ol</NuxtLink>
          </div>
        </nav>
        
        <!-- Mobile Menu Button -->
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden text-gray-700 hover:text-scootur focus:outline-none transition-transform duration-300" :class="{ 'rotate-90': isMobileMenuOpen }">
          <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Nav -->
      <transition name="mobile-menu">
        <div v-if="isMobileMenuOpen" class="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-100 flex flex-col animate-slide-down">
          <div class="px-6 py-6 flex flex-col gap-5">
            <NuxtLink to="/" @click="isMobileMenuOpen = false" class="text-gray-800 text-lg font-semibold hover:text-scootur flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Ana Sayfa
            </NuxtLink>
            <NuxtLink to="/services" @click="isMobileMenuOpen = false" class="text-gray-800 text-lg font-semibold hover:text-scootur flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Servis Noktaları
            </NuxtLink>
            <NuxtLink v-if="isAuthenticated" to="/reports" @click="isMobileMenuOpen = false" class="text-gray-800 text-lg font-semibold hover:text-scootur flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Tutanaklarım
            </NuxtLink>
            <NuxtLink v-if="isAuthenticated" to="/profile" @click="isMobileMenuOpen = false" class="text-gray-800 text-lg font-semibold hover:text-scootur flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profilim
            </NuxtLink>
            
            <hr class="border-gray-100 my-2" />
            
            <div v-if="isAuthenticated" class="flex flex-col gap-3">
              <NuxtLink to="/reports/new" @click="isMobileMenuOpen = false" class="btn-primary text-center py-3 text-base w-full shadow-md font-bold">Yeni Tutanak Oluştur</NuxtLink>
              <button @click="logout(); isMobileMenuOpen = false" class="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors font-semibold text-center py-3 text-base w-full">Çıkış Yap</button>
            </div>
            <div v-else class="flex flex-col gap-3">
              <NuxtLink to="/register" @click="isMobileMenuOpen = false" class="btn-primary text-center py-3 text-base w-full shadow-md font-bold">Kayıt Ol</NuxtLink>
              <NuxtLink to="/login" @click="isMobileMenuOpen = false" class="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors font-semibold text-center py-3 text-base w-full">Giriş Yap</NuxtLink>
            </div>
          </div>
        </div>
      </transition>
    </header>

    <main class="flex-grow container mx-auto px-4 py-8 max-w-7xl">
      <slot />
    </main>

    <footer class="bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm mt-auto">
      <div class="container mx-auto px-4">
        <p>&copy; {{ new Date().getFullYear() }} Scootur. Tüm hakları saklıdır.</p>
        <div class="flex flex-wrap justify-center gap-4 mt-4">
          <NuxtLink to="/user-agreement" class="hover:text-scootur transition-colors">Kullanıcı Sözleşmesi</NuxtLink>
          <NuxtLink to="/kvkk" class="hover:text-scootur transition-colors">KVKK Metni</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-scootur transition-colors">İletişim</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isAuthenticated = ref(false)
const isMobileMenuOpen = ref(false)

const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    isAuthenticated.value = !!token && token !== 'null' && token !== 'undefined'
  }
}

onMounted(() => {
  checkAuth()
  // Listen for custom login/logout events to update UI instantly without reload
  window.addEventListener('auth-change', checkAuth)
})

onUnmounted(() => {
  window.removeEventListener('auth-change', checkAuth)
})

// Close mobile menu on route change
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})

const logout = () => {
  localStorage.removeItem('token')
  isAuthenticated.value = false
  window.dispatchEvent(new Event('auth-change'))
  router.push('/')
}
</script>

<style scoped>
/* Fallback CSS if logo loads, hide the SVG */
img[src="/logo.png"]:not([style*="display: none"]) + .logo-fallback {
  display: none;
}
</style>

