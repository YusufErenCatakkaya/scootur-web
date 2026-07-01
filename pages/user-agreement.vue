<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <div class="glass-card p-8 animate-fade-in-up">
      <div class="flex items-center gap-4 mb-8 pb-4 border-b">
        <NuxtLink to="/register" class="text-gray-400 hover:text-scootur transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900">Kullanıcı Sözleşmesi</h1>
      </div>
      
      <div class="prose max-w-none text-gray-600 leading-relaxed space-y-6">
        <p class="font-medium text-gray-800">SCOOTUR KULLANICI SÖZLE�?MESİ VE KULLANIM KO�?ULLARI</p>
        
        <h3 class="text-xl font-semibold text-gray-800">1. Taraflar</h3>
        <p>İşbu sözleşme, Scootur platformunu kullanan gerçek kişiler ("Kullanıcı") ile platformun sahibi Scootur Yönetimi arasında akdedilmiştir.</p>
        
        <h3 class="text-xl font-semibold text-gray-800">2. Sözleşmenin Konusu</h3>
        <p>Kullanıcının platform üzerinden kaza tutanağı oluşturabilmesi, acil durum bilgilerinin sağlık ekipleri tarafından qr kod vasıtasıyla görüntülenebilmesi ve sistemin kullanım şartlarının belirlenmesidir.</p>
        
        <h3 class="text-xl font-semibold text-gray-800">3. Kullanıcının Yükümlülükleri</h3>
        <p>Kullanıcı, sisteme girdiği her türlü bilginin (T.C. kimlik numarası, kaza saati, kaza yeri, görgü tanığı bilgileri vb.) doğru ve eksiksiz olduğunu beyan eder. Yanlış veya yanıltıcı bilgi verilmesinden doğacak hukuki ve cezai sorumluluk tamamen kullanıcıya aittir.</p>
        
        <h3 class="text-xl font-semibold text-gray-800">4. Kaza Tutanakları Hakkında</h3>
        <p>Platformumuz üzerinden oluşturulan PDF çıktılar, yasal süreçlerde delil olarak kullanılabilmekle birlikte, resmi merciler tarafından ek evrak (polis/jandarma raporu vb.) talep edilebilir. Sistemin oluşturduğu evrak dijital bir kopyadır.</p>
      </div>

      <div class="mt-12 flex justify-center">
        <NuxtLink to="/register" class="btn-primary">Kayıt Ekranına Dön</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Kullanıcı Sözleşmesi | Scootur'
})
</script>

