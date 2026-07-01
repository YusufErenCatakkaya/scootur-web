<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <div class="glass-card p-8 animate-fade-in-up">
      <div class="flex items-center gap-4 mb-8 pb-4 border-b">
        <NuxtLink to="/register" class="text-gray-400 hover:text-scootur transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900">KVKK Aydınlatma Metni</h1>
      </div>
      
      <div class="prose max-w-none text-gray-600 leading-relaxed space-y-6">
        <p class="font-medium text-gray-800">SCOOTUR ELEKTRONİK İLETİ�?İM VE BİLGİ SİSTEMLERİ Kİ�?İSEL VERİLERİN KORUNMASI AYDINLATMA METNİ</p>
        
        <h3 class="text-xl font-semibold text-gray-800">1. Veri Sorumlusu</h3>
        <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla Scootur ("�?irket") tarafından aşağıda açıklanan kapsamda işlenebilecektir.</p>
        
        <h3 class="text-xl font-semibold text-gray-800">2. Kişisel Verilerin Hangi Amaçla İşleneceği</h3>
        <p>Toplanan kişisel verileriniz, kaza tutanaklarının yasal çerçevede oluşturulabilmesi, taraflar arası uyuşmazlıkların giderilebilmesi için delil niteliği taşıması, acil durumlarda sağlık ekipleriyle elzem bilgilerin (kan grubu, alerji) paylaşılabilmesi amacıyla işlenmektedir.</p>
        
        <h3 class="text-xl font-semibold text-gray-800">3. Kişisel Verilerin Aktarılması</h3>
        <p>Kişisel verileriniz; kanuni yükümlülüklerimizin yerine getirilmesi amacıyla yetkili kamu kurum ve kuruluşlarına, acil durumlarda sağlık profesyonellerine (sadece ilgili sağlık bilgileri) aktarılabilecektir.</p>
        
        <h3 class="text-xl font-semibold text-gray-800">4. Haklarınız</h3>
        <p>KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, eksik veya yanlış işlenmişse düzeltilmesini isteme haklarına sahipsiniz.</p>
      </div>

      <div class="mt-12 flex justify-center">
        <NuxtLink to="/register" class="btn-primary">Kayıt Ekranına Dön</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'KVKK Aydınlatma Metni | Scootur'
})
</script>

