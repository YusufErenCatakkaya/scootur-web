<template>
  <div class="max-w-3xl mx-auto py-12 px-4">
    <div class="glass-card p-8 animate-fade-in-up">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Bize Ulaşın</h1>
        <p class="text-gray-500">Öneri, şikayet veya iş birliği için lütfen formu doldurun.</p>
      </div>

      <div v-if="successMessage" class="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 mb-6 text-center font-medium">
        {{ successMessage }}
      </div>

      <form v-else @submit.prevent="submitForm" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız</label>
            <input type="text" v-model="form.name" @input="form.name = maskName($event.target.value)" required class="input-field" placeholder="Ad Soyad" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">E-posta Adresiniz</label>
            <input type="email" v-model="form.email" required class="input-field" placeholder="ornek@mail.com" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Konu</label>
          <input type="text" v-model="form.subject" required class="input-field" placeholder="Mesajınızın konusu" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
          <textarea v-model="form.message" required rows="5" class="input-field resize-none" placeholder="Detaylı mesajınızı buraya yazabilirsiniz..."></textarea>
        </div>

        <button type="submit" class="btn-primary w-full py-4 flex justify-center items-center gap-2" :disabled="loading">
          <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          {{ loading ? 'Gönderiliyor...' : 'Mesajı Gönder' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

useHead({
  title: 'İletişim | Scootur'
})

const loading = ref(false)
const successMessage = ref('')

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitForm = async () => {
  loading.value = true
  successMessage.value = ''
  
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: form.value
    })
    
    successMessage.value = 'Mesajınız başarıyla iletildi. En kısa sürede size dönüş yapacağız!'
    form.value = { name: '', email: '', subject: '', message: '' }
  } catch (error) {
    alert(error.data?.statusMessage || 'Mesaj gönderilirken bir hata oluştu.')
  } finally {
    loading.value = false
  }
}
</script>

