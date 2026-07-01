<template>
  <div class="max-w-3xl mx-auto w-full pt-8 pb-24">
    <div class="glass-card p-8 animate-fade-in-up">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Hesap Oluşturun</h1>
        <p class="text-gray-500">Güvenli sürüşler için Scootur'e katılın</p>
      </div>

      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- Kimlik Bilgileri -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Kimlik ve İletişim Bilgileri</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Adınız</label>
              <input type="text" v-model="form.firstName" required class="input-field" placeholder="Örn: Ahmet" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Soyadınız</label>
              <input type="text" v-model="form.lastName" required class="input-field" placeholder="Örn: Yılmaz" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihiniz</label>
              <input type="date" v-model="form.birthDate" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">T.C. Kimlik No</label>
              <input type="text" v-model="form.tcNo" required pattern="^[0-9]{11}$" maxlength="11" class="input-field" placeholder="11 Haneli T.C. Kimlik No" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Telefon Numarası</label>
              <input type="tel" v-model="form.phone" required pattern="^05[0-9]{9}$" maxlength="11" class="input-field" placeholder="05XX XXX XX XX" title="Lütfen başında sıfır olacak şekilde 11 haneli telefon numaranızı giriniz (Örn: 05321234567)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
              <input type="email" v-model="form.email" required class="input-field" placeholder="ornek@mail.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Şifre Belirleyin</label>
              <input type="password" v-model="form.password" required minlength="8" class="input-field" placeholder="Şifreniz" />
            </div>
          </div>
          
          <!-- Şifre Güçlülük Kuralları -->
          <div class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 flex flex-wrap gap-x-4 gap-y-2">
            <div :class="['text-xs font-medium flex items-center gap-1', passwordRules.length ? 'text-green-600' : 'text-gray-500']">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" v-if="passwordRules.length" />
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" v-else />
              </svg>
              En az 8 karakter
            </div>
            <div :class="['text-xs font-medium flex items-center gap-1', passwordRules.uppercase ? 'text-green-600' : 'text-gray-500']">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" v-if="passwordRules.uppercase" />
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" v-else />
              </svg>
              Büyük & Küçük Harf
            </div>
            <div :class="['text-xs font-medium flex items-center gap-1', passwordRules.number ? 'text-green-600' : 'text-gray-500']">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" v-if="passwordRules.number" />
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" v-else />
              </svg>
              En az 1 Rakam
            </div>
          </div>
        </div>

        <!-- Acil Durum Bilgileri -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            Acil Durum Kişisi (Kaza Anında Aranacak Yakınınız)
          </h3>
          <p class="text-xs text-gray-500 mb-4">* Bu bilgiler kaza anında ilk yardım yapan kişilerin size hızlıca yardımcı olabilmesi için QR kodunuzda yer alacaktır.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Yakınınızın Adı Soyadı</label>
              <input type="text" v-model="form.emergencyContactName" required class="input-field" placeholder="Örn: Ayşe Yılmaz" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Yakınınızın Telefonu</label>
              <input type="tel" v-model="form.emergencyContactPhone" required class="input-field" placeholder="05XX XXX XX XX" />
            </div>
          </div>
        </div>

        <!-- Sözleşmeler -->
        <div class="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input id="kvkk" type="checkbox" v-model="form.kvkk" required class="w-4 h-4 text-scootur bg-white border-gray-300 rounded focus:ring-scootur cursor-pointer">
            </div>
            <div class="ml-3 text-sm">
              <label for="kvkk" class="font-medium text-gray-700 cursor-pointer">
                <button type="button" @click="openModal('kvkk')" class="text-scootur hover:underline">KVKK Aydınlatma Metnini</button> okudum ve onaylıyorum.
              </label>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input id="agreement" type="checkbox" v-model="form.userAgreement" required class="w-4 h-4 text-scootur bg-white border-gray-300 rounded focus:ring-scootur cursor-pointer">
            </div>
            <div class="ml-3 text-sm">
              <label for="agreement" class="font-medium text-gray-700 cursor-pointer">
                <button type="button" @click="openModal('agreement')" class="text-scootur hover:underline">Kullanıcı Sözleşmesini</button> okudum ve kabul ediyorum.
              </label>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          class="btn-primary w-full text-lg py-4 flex justify-center items-center gap-2"
          :disabled="loading"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Hesap Oluşturuluyor...' : 'Hesabımı Oluştur ve Kaydet' }}
        </button>
      </form>
    </div>

    <!-- Text Modal -->
    <div v-if="activeModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col animate-fade-in-up">
        <div class="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 class="text-xl font-bold text-gray-900">
            {{ activeModal === 'kvkk' ? 'KVKK Aydınlatma Metni' : 'Kullanıcı Sözleşmesi' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto flex-grow whitespace-pre-line text-sm text-gray-600 leading-relaxed">
          {{ activeModal === 'kvkk' ? kvkkText : userAgreementText }}
        </div>
        <div class="p-6 border-t border-gray-100 flex justify-end">
          <button @click="closeModal" class="btn-primary py-2 px-6">Anladım, Kapat</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { kvkkText, userAgreementText } from '~/utils/agreements'

useHead({
  title: 'Kayıt Ol | Scootur'
})

const router = useRouter()
const loading = ref(false)
const activeModal = ref(null)

const openModal = (type) => {
  activeModal.value = type
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  activeModal.value = null
  document.body.style.overflow = 'auto'
}

const form = ref({
  firstName: '',
  lastName: '',
  birthDate: '',
  tcNo: '',
  phone: '',
  email: '',
  password: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  kvkk: false,
  userAgreement: false
})

const passwordRules = computed(() => {
  const p = form.value.password || ''
  return {
    length: p.length >= 8,
    uppercase: /[A-Z]/.test(p) && /[a-z]/.test(p),
    number: /[0-9]/.test(p)
  }
})

const submitForm = async () => {
  loading.value = true
  try {
    const { token } = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        ...form.value,
        agreements: {
          kvkk: form.value.kvkk,
          user: form.value.userAgreement
        }
      }
    })
    
    if (token) {
      localStorage.setItem('token', token)
      window.location.href = '/profile'
    }
  } catch (error) {
    alert(error.data?.statusMessage || 'Kayıt sırasında bir hata oluştu. Bilgilerinizi kontrol edip tekrar deneyin.')
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

