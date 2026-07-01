<template>
  <div class="max-w-md mx-auto w-full pt-12 pb-24">
    <div class="glass-card p-8 animate-fade-in-up">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Hoş Geldiniz</h1>
        <p class="text-gray-500">Scootur hesabınıza giriş yapın</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required 
            class="input-field" 
            placeholder="ornek@mail.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">�?ifre</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            required 
            class="input-field" 
            placeholder="••••••••"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              id="remember-me" 
              name="remember-me" 
              type="checkbox" 
              class="h-4 w-4 text-scootur focus:ring-scootur border-gray-300 rounded cursor-pointer" 
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900 cursor-pointer">
              Beni hatırla
            </label>
          </div>

          <!-- <div class="text-sm">
            <a href="#" class="font-medium text-scootur hover:text-scootur-dark">
              �?ifremi unuttum
            </a>
          </div> -->
        </div>

        <button 
          type="submit" 
          class="btn-primary w-full flex justify-center items-center gap-2"
          :disabled="loading"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
        </button>
      </form>

      <div class="mt-8 text-center text-sm text-gray-600">
        Hesabınız yok mu? 
        <NuxtLink to="/register" class="font-medium text-scootur hover:text-scootur-dark ml-1">
          Ücretsiz Kayıt Olun
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

useHead({
  title: 'Giriş Yap | Scootur'
})

const form = ref({
  email: '',
  password: ''
})
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    })
    
    localStorage.setItem('token', response.token)
    window.dispatchEvent(new Event('auth-change'))
    window.location.href = '/profile'
  } catch (error) {
    alert(error.data?.statusMessage || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out forwards;
}
</style>

