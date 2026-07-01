<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-12 pb-24 lg:pt-24 lg:pb-32 flex flex-col items-center text-center">
      <!-- Background decorative elements -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-b from-scootur/20 to-transparent rounded-full blur-3xl -z-10 opacity-70"></div>
      
      <div class="max-w-4xl mx-auto px-4 relative z-10">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-scootur/20 text-scootur-dark font-medium text-sm mb-8 shadow-sm backdrop-blur-sm animate-fade-in-up">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-scootur opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-scootur"></span>
          </span>
          Scootur Beta Yayında!
        </div>
        
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
          Scooter Sürüşlerinde <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-scootur to-blue-500">
            Güvenliğin Yeni Adı
          </span>
        </h1>
        
        <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Acil durumlar için dijital sağlık profilinizi oluşturun, scooter'ınıza özel QR kodunuzu yapıştırın. Olası kazalarda saniyeler içinde resmi kaza tespit tutanağınızı PDF olarak hazırlayın.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NuxtLink to="/register" class="btn-primary text-lg px-8 py-4 w-full sm:w-auto flex items-center justify-center gap-2 group">
            Hemen Kayıt Ol
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
          <NuxtLink to="/login" class="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
            Sisteme Giriş
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Neden Scootur?</h2>
          <p class="text-gray-500 max-w-2xl mx-auto">Hayat kurtaran yenilikçi çözümlerle scooter deneyiminizi güvene alıyoruz.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="glass-card p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-t-scootur">
            <div class="w-14 h-14 bg-scootur/10 rounded-2xl flex items-center justify-center mb-6 text-scootur">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Hayat Kurtaran QR Profil</h3>
            <p class="text-gray-600 leading-relaxed">
              Kişisel sağlık bilgilerinizi, alerjilerinizi ve kan grubunuzu içeren profilinizi oluşturun. Çıktı alacağınız QR kodu scooter'ınıza yapıştırarak acil durumlarda ilk yardımcılara hayati bilgiler sunun.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="glass-card p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-t-blue-500">
            <div class="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Saniyeler İçinde Tutanak</h3>
            <p class="text-gray-600 leading-relaxed">
              Olası bir kaza anında stres yapmadan, adım adım sihirbazı kullanarak resmi formata uygun kaza tespit tutanağınızı dijital ortamda eksiksiz doldurun.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="glass-card p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-t-purple-500">
            <div class="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Resmi PDF Çıktısı</h3>
            <p class="text-gray-600 leading-relaxed">
              Oluşturduğunuz tutanakları tek tıkla resmi PDF formatında telefonunuza indirin, sigorta şirketleri veya yetkili mercilerle anında paylaşın.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Page metadata
useHead({
  title: 'Scootur | Güvenli Scooter Deneyimi',
  meta: [
    { name: 'description', content: 'Scootur ile kaza tespit tutanağı oluşturun ve acil durum sağlık QR kodunuzu yaratın.' }
  ]
})
</script>

<style scoped>
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}
</style>

