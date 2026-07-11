<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <div class="mb-8">
      <NuxtLink to="/reports" class="text-scootur hover:underline flex items-center gap-1 mb-2 text-sm font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Tutanaklarıma Dön
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900">Yeni Kaza Tutanağı</h1>
      <p class="text-gray-500 mt-1">Lütfen kaza bilgilerini eksiksiz ve doğru bir şekilde doldurun.</p>
    </div>

    <div class="glass-card p-8 animate-fade-in-up">
      <form @submit.prevent="submitReport" class="space-y-8">
        
        <!-- Genel Kaza Bilgileri -->
        <div>
          <h3 class="text-xl font-semibold border-b pb-2 mb-4 text-gray-800">1. Kaza Zamanı ve Yeri</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
              <input type="date" v-model="form.date" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Saat</label>
              <input type="time" v-model="form.time" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">İl</label>
              <select v-model="form.province" @change="onProvinceChange" required class="input-field bg-white">
                <option value="">İl Seçiniz</option>
                <option v-for="prov in provinces" :key="prov.id" :value="prov.name">{{ prov.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
              <select v-model="form.district" required class="input-field bg-white" :disabled="!form.province">
                <option value="">İlçe Seçiniz</option>
                <option v-for="dist in districts" :key="dist.id" :value="dist.name">{{ dist.name }}</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Mahalle ve Sokak / Açık Adres</label>
              <textarea v-model="form.neighborhood" rows="2" required class="input-field resize-none" placeholder="Örn: Caferağa Mah. Moda Cad. No: 15 önü"></textarea>
            </div>
          </div>
        </div>

        <!-- Araç Bilgileri -->
        <div>
          <h3 class="text-xl font-semibold border-b pb-2 mb-4 text-gray-800 flex items-center justify-between">
            2. Tarafların Bilgileri
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Araç A (Kendi Aracınız) -->
            <div class="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 class="font-medium text-scootur flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Taraf A (Sizin Scooter'ınız)
              </h4>
              <p class="text-xs text-gray-500 mb-2">Kimlik ve iletişim bilgileriniz profilinizden otomatik alınacaktır.</p>
              
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Scooter Seri No (Varsa)</label>
                <input type="text" v-model="form.formData.driverA_Plate" @input="form.formData.driverA_Plate = maskPlate($event.target.value)" class="input-field uppercase text-sm py-2" placeholder="Örn: 12345 veya Plaka" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Fatura Görseli (İsteğe Bağlı)</label>
                <div class="flex items-center gap-3">
                  <div v-if="invoicePreview" class="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                    <img :src="invoicePreview" class="w-full h-full object-cover" />
                    <button type="button" @click="removeInvoice" class="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity">Sil</button>
                  </div>
                  <label v-else class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                    Fatura Seç
                    <input type="file" accept="image/*" class="hidden" @change="handleInvoiceUpload" />
                  </label>
                </div>
              </div>
            </div>

            <!-- Araç B (Karşı Taraf) -->
            <div class="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
               <h4 class="font-medium text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                Taraf B (Araç, Yaya veya Scooter)
              </h4>
              
              <!-- 4- Sürücü Bilgileri -->
              <div class="border-b border-gray-200 pb-3 mb-3">
                <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sürücü Bilgileri</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Adı Soyadı</label>
                    <input type="text" v-model="form.formData.driverB_Name" @input="form.formData.driverB_Name = maskName($event.target.value)" class="input-field text-sm py-1.5" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">T.C. Kimlik No</label>
                    <input type="text" v-model="form.formData.driverB_TcNo" @input="form.formData.driverB_TcNo = maskTC($event.target.value)" maxlength="11" class="input-field text-sm py-1.5" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Sürücü Belge No. ve Sınıfı</label>
                    <input type="text" v-model="form.formData.driverB_License" class="input-field text-sm py-1.5" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Alındığı Yer (İl/İlçe)</label>
                    <input type="text" v-model="form.formData.driverB_LicensePlace" class="input-field text-sm py-1.5" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Adres</label>
                    <input type="text" v-model="form.formData.driverB_Address" class="input-field text-sm py-1.5" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Cep Telefonu</label>
                    <input type="tel" v-model="form.formData.driverB_Phone" @input="form.formData.driverB_Phone = maskPhone($event.target.value)" class="input-field text-sm py-1.5" />
                  </div>
                </div>
              </div>

              <!-- 5- Araç Bilgileri -->
              <div class="border-b border-gray-200 pb-3 mb-3">
                <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Araç Bilgileri</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="md:col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Marka ve Modeli</label>
                    <input type="text" v-model="form.formData.driverB_BrandModel" class="input-field text-sm py-1.5" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Plaka</label>
                    <input type="text" v-model="form.formData.driverB_Plate" @input="form.formData.driverB_Plate = maskPlate($event.target.value)" class="input-field text-sm py-1.5 uppercase" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Kullanım Şekli</label>
                    <input type="text" v-model="form.formData.driverB_Usage" class="input-field text-sm py-1.5" />
                  </div>
                </div>
              </div>

              <!-- 6- Trafik Sigortası -->
              <div>
                <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Trafik Sigortası Poliçe Bilgileri</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="md:col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Sigortalının Adı Soyadı</label>
                    <input type="text" v-model="form.formData.driverB_InsuranceName" class="input-field text-sm py-1.5" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Sigortalı T.C. / Vergi No</label>
                    <input type="text" v-model="form.formData.driverB_InsuranceTcNo" @input="form.formData.driverB_InsuranceTcNo = maskTC($event.target.value)" class="input-field text-sm py-1.5" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Sigorta Şirketinin Ünvanı</label>
                    <input type="text" v-model="form.formData.driverB_InsuranceCompany" class="input-field text-sm py-1.5" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Acente No</label>
                    <input type="text" v-model="form.formData.driverB_AgencyNo" @input="form.formData.driverB_AgencyNo = maskNumeric($event.target.value)" class="input-field text-sm py-1.5" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Poliçe No</label>
                    <input type="text" v-model="form.formData.driverB_PolicyNo" @input="form.formData.driverB_PolicyNo = maskNumeric($event.target.value)" class="input-field text-sm py-1.5" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Tramer Belge No</label>
                    <input type="text" v-model="form.formData.driverB_TramerNo" @input="form.formData.driverB_TramerNo = maskNumeric($event.target.value)" class="input-field text-sm py-1.5" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Poliçenin Başl.-Bitiş Tarihi</label>
                    <input type="text" v-model="form.formData.driverB_PolicyDates" class="input-field text-sm py-1.5" placeholder="Örn: 01.01.24 - 01.01.25" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Görgü Tanıkları -->
        <div>
          <div class="flex items-center justify-between border-b pb-2 mb-4">
            <h3 class="text-xl font-semibold text-gray-800">3. Görgü Tanıkları (Varsa)</h3>
            <button type="button" @click="addWitness" v-if="form.formData.witnesses.length < 3" class="text-sm text-scootur font-medium hover:underline">+ Tanık Ekle</button>
          </div>
          
          <div v-if="form.formData.witnesses.length === 0" class="text-sm text-gray-500 italic">
            Henüz görgü tanığı eklenmedi. Eğer olayı gören biri varsa yukarıdaki butondan ekleyebilirsiniz.
          </div>
          
          <div class="space-y-4">
            <div v-for="(witness, index) in form.formData.witnesses" :key="index" class="bg-white border border-gray-200 p-4 rounded-xl relative">
              <button type="button" @click="removeWitness(index)" class="absolute top-2 right-2 text-red-400 hover:text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Ad Soyad</label>
                  <input type="text" v-model="witness.name" @input="witness.name = maskName($event.target.value)" class="input-field text-sm py-2" placeholder="Tanık Adı" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Telefon</label>
                  <input type="tel" v-model="witness.phone" @input="witness.phone = maskPhone($event.target.value)" class="input-field text-sm py-2" placeholder="05XX..." />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Adres</label>
                  <input type="text" v-model="witness.address" class="input-field text-sm py-2" placeholder="İl/İlçe/Mahalle" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fotoğraf Yükleme -->
        <div>
          <h3 class="text-xl font-semibold border-b pb-2 mb-4 text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            4. Olay Yeri Fotoğrafları
          </h3>
          <p class="text-sm text-gray-600 mb-4">Kaza yeri veya hasar fotoğraflarını (en fazla 5 adet) ekleyebilirsiniz.</p>
          
          <div class="flex flex-wrap gap-4">
            <div v-for="(photo, index) in photos" :key="index" class="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
              <img :src="photo.preview" class="w-full h-full object-cover" />
              <button type="button" @click="removePhoto(index)" class="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                Kaldır
              </button>
            </div>
            
            <label v-if="photos.length < 5" class="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-scootur hover:text-scootur cursor-pointer transition-colors bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-xs font-medium">Fotoğraf Ekle</span>
              <input type="file" accept="image/*" multiple class="hidden" @change="handlePhotoUpload" />
            </label>
          </div>
        </div>

        <!-- Kaza Özeti ve Çizim -->
        <div>
          <h3 class="text-xl font-semibold border-b pb-2 mb-4 text-gray-800">5. Kazanın Oluş �?ekli ve Taslağı</h3>
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Taraf A'nın Beyanı (Siz)</label>
                <textarea v-model="form.formData.descriptionA" rows="4" required class="input-field resize-none" placeholder="Örn: Seyir halindeyken sağdan gelen araç dur levhasına uymayarak scooter'ıma yandan çarptı."></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Taraf B'nin Beyanı (Karşı Taraf)</label>
                <textarea v-model="form.formData.descriptionB" rows="4" class="input-field resize-none" placeholder="Örn: Kavşakta scooter aniden önüme çıktı, frene bassam da duramadım..."></textarea>
              </div>
            </div>
            
            <p class="text-xs text-gray-500 mt-4 mb-2">Aşağıdaki alanlara parmağınızla veya farenizle araçların çarpışma anını temsil eden basit çizimler yapabilirsiniz.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Canvas A -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-medium text-gray-700">Taraf A Çizimi</label>
                  <button type="button" @click="clearCanvas('A')" class="text-xs text-red-500 hover:text-red-700 font-medium">Temizle</button>
                </div>
                <div class="border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 overflow-hidden touch-none relative" style="height: 250px;">
                  <canvas 
                    ref="canvasRefA"
                    class="w-full h-full bg-transparent cursor-crosshair"
                    @mousedown="startDrawing($event, 'A')"
                    @mousemove="draw($event, 'A')"
                    @mouseup="stopDrawing('A')"
                    @mouseleave="stopDrawing('A')"
                    @touchstart.prevent="startDrawingTouch($event, 'A')"
                    @touchmove.prevent="drawTouch($event, 'A')"
                    @touchend.prevent="stopDrawing('A')"
                  ></canvas>
                </div>
              </div>
              <!-- Canvas B -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-medium text-gray-700">Taraf B Çizimi</label>
                  <button type="button" @click="clearCanvas('B')" class="text-xs text-red-500 hover:text-red-700 font-medium">Temizle</button>
                </div>
                <div class="border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 overflow-hidden touch-none relative" style="height: 250px;">
                  <canvas 
                    ref="canvasRefB"
                    class="w-full h-full bg-transparent cursor-crosshair"
                    @mousedown="startDrawing($event, 'B')"
                    @mousemove="draw($event, 'B')"
                    @mouseup="stopDrawing('B')"
                    @mouseleave="stopDrawing('B')"
                    @touchstart.prevent="startDrawingTouch($event, 'B')"
                    @touchmove.prevent="drawTouch($event, 'B')"
                    @touchend.prevent="stopDrawing('B')"
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Onay -->
        <div class="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input id="confirmation" type="checkbox" required class="w-4 h-4 text-scootur bg-white border-gray-300 rounded focus:ring-scootur cursor-pointer">
            </div>
            <div class="ml-3 text-sm">
              <label for="confirmation" class="font-medium text-yellow-800 cursor-pointer">
                Yukarıda beyan ettiğim bilgilerin tamamen doğru olduğunu ve resmi bir belge mahiyetinde işleneceğini 
                <button type="button" @click="openTermsModal" class="text-red-600 hover:underline">okudum, onaylıyorum.</button>
              </label>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <NuxtLink to="/reports" class="btn-secondary">İptal</NuxtLink>
          <button type="submit" class="btn-primary flex items-center gap-2" :disabled="loading">
            <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Tutanağı Oluştur ve Kaydet
          </button>
        </div>
      </form>
    </div>

    <!-- Hukuki Taahhütname Modalı -->
    <div v-if="showTermsModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="closeTermsModal"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col animate-fade-in-up">
        <div class="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 class="text-xl font-bold text-gray-900">Resmi Beyan ve Taahhütname</h3>
          <button @click="closeTermsModal" class="text-gray-400 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto flex-grow text-sm text-gray-600 leading-relaxed text-justify space-y-4">
          <p>İşbu kaza tespit tutanağında tarafımca beyan edilen tüm bilgilerin, şahsıma ait olduğunu ve olay anını yansıttığını, girilen TC Kimlik No, Ad-Soyad, adres ve ruhsat/ehliyet/sigorta bilgilerinin gerçeğe uygun olduğunu kabul, beyan ve taahhüt ederim.</p>
          <p>Karşı tarafa (Taraf B) ait olarak girilen bilgilerin olay yerinde karşılıklı teyit edilerek veya bizzat karşı tarafın rızasıyla doldurulduğunu, eksik veya yanıltıcı bilgi girilmesi halinde 5237 sayılı Türk Ceza Kanunu’nun "Resmi Belgede Sahtecilik" ve sair ilgili hükümlerince yasal sorumluluğun şahsıma ait olduğunu biliyorum.</p>
          <p>Formun gönderilmesiyle birlikte, tarafımca (Taraf A) veya Karşı Taraf (Taraf B) tarafından çizilen kroki, yüklenen resimler, kaza özeti ve sair dokümanların işbu poliçe işlemleri, hasar tespiti ve sigorta rücu süreçlerinde resmi delil niteliği taşıyacağını açık rızam ile kabul ederim.</p>
        </div>
        <div class="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button @click="closeTermsModal" class="btn-secondary py-2 px-6">Kapat</button>
          <button @click="acceptTerms" class="btn-primary py-2 px-6">Okudum ve Onaylıyorum</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

useHead({
  title: 'Yeni Tutanak | Scootur'
})

const router = useRouter()
const loading = ref(false)

const photos = ref([])
const invoicePreview = ref(null)

const provinces = ref([])
const districts = ref([])

// Canvas refs
const canvasRefA = ref(null)
const canvasRefB = ref(null)

const drawingState = ref({
  A: { isDrawing: false, hasSketch: false, ctx: null },
  B: { isDrawing: false, hasSketch: false, ctx: null }
})

const showTermsModal = ref(false)
const openTermsModal = () => { showTermsModal.value = true; document.body.style.overflow = 'hidden' }
const closeTermsModal = () => { showTermsModal.value = false; document.body.style.overflow = 'auto' }
const acceptTerms = () => {
  form.value.confirmation = true
  closeTermsModal()
}

const form = ref({
  date: new Date().toISOString().split('T')[0],
  time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
  province: '',
  district: '',
  neighborhood: '',
  address: '',
  confirmation: false,
  formData: {
    descriptionA: '',
    descriptionB: '',
    // Taraf B details
    driverB_Name: '',
    driverB_TcNo: '',
    driverB_License: '',
    driverB_LicensePlace: '',
    driverB_Address: '',
    driverB_Phone: '',
    driverB_BrandModel: '',
    driverB_Plate: '',
    driverB_Usage: '',
    driverB_InsuranceName: '',
    driverB_InsuranceTcNo: '',
    driverB_InsuranceCompany: '',
    driverB_AgencyNo: '',
    driverB_PolicyNo: '',
    driverB_TramerNo: '',
    driverB_PolicyDates: '',
    
    // Taraf A details
    driverA_Plate: '',
    invoiceBase64: null,
    sketchBase64: null,
    
    witnesses: [],
    photosBase64: []
  }
})

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token || token === 'null' || token === 'undefined') {
    router.push('/login')
    return
  }

  try {
    const res = await fetch('/cities.json')
    const data = await res.json()
    if (Array.isArray(data)) {
      provinces.value = data.sort((a,b) => a.name.localeCompare(b.name))
    }
  } catch(err) {
    console.error('İller yüklenemedi', err)
  }
  
  // Initialize canvases
  const initCanvas = (refName, side) => {
    const el = refName === 'A' ? canvasRefA.value : canvasRefB.value
    if (el) {
      const rect = el.parentElement.getBoundingClientRect()
      el.width = rect.width
      el.height = rect.height
      const ctx = el.getContext('2d')
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.strokeStyle = '#ef4444' // scootur red
      drawingState.value[side].ctx = ctx
    }
  }

  // Use a slight timeout to ensure DOM is fully rendered for accurate rect sizes
  setTimeout(() => {
    initCanvas('A', 'A')
    initCanvas('B', 'B')
  }, 100)
})

const onProvinceChange = () => {
  const province = provinces.value.find(p => p.name === form.value.province)
  if (province) {
    districts.value = province.districts.sort((a,b) => a.name.localeCompare(b.name))
  } else {
    districts.value = []
  }
  form.value.district = ''
}

const addWitness = () => {
  if (form.value.formData.witnesses.length < 3) {
    form.value.formData.witnesses.push({ name: '', phone: '', address: '' })
  }
}

const removeWitness = (index) => {
  form.value.formData.witnesses.splice(index, 1)
}

const handlePhotoUpload = (e) => {
  const files = e.target.files
  if (!files || files.length === 0) return
  
  const remainingSlots = 5 - photos.value.length
  const filesToProcess = Array.from(files).slice(0, remainingSlots)

  filesToProcess.forEach(file => {
    if (file.size > 2 * 1024 * 1024) {
      alert(`${file.name} boyutu 2MB'tan büyük olduğu için eklenmedi.`)
      return
    }

    const reader = new FileReader()
    reader.onload = (evt) => {
      const base64Data = evt.target.result
      photos.value.push({ preview: base64Data })
      form.value.formData.photosBase64.push(base64Data)
    }
    reader.readAsDataURL(file)
  })
  
  // clear input value so same files can be selected again if needed
  e.target.value = ''
}

const removePhoto = (index) => {
  photos.value.splice(index, 1)
  form.value.formData.photosBase64.splice(index, 1)
}

const handleInvoiceUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  if (file.size > 2 * 1024 * 1024) {
    alert('Fatura görseli en fazla 2MB olmalıdır.')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    invoicePreview.value = e.target.result
    form.value.formData.invoiceBase64 = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeInvoice = () => {
  invoicePreview.value = null
  form.value.formData.invoiceBase64 = null
}

// Canvas Drawing logic
const getCoordinates = (e, side) => {
  const el = side === 'A' ? canvasRefA.value : canvasRefB.value
  if (!el) return { x: 0, y: 0 }
  const rect = el.getBoundingClientRect()
  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    }
  }
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

const startDrawing = (e, side) => {
  const state = drawingState.value[side]
  if (!state.ctx) return
  state.isDrawing = true
  state.hasSketch = true
  const coords = getCoordinates(e, side)
  state.ctx.beginPath()
  state.ctx.moveTo(coords.x, coords.y)
}

const startDrawingTouch = (e, side) => {
  startDrawing(e, side)
}

const draw = (e, side) => {
  const state = drawingState.value[side]
  if (!state.isDrawing || !state.ctx) return
  const coords = getCoordinates(e, side)
  state.ctx.lineTo(coords.x, coords.y)
  state.ctx.stroke()
}

const drawTouch = (e, side) => {
  draw(e, side)
}

const stopDrawing = (side) => {
  const state = drawingState.value[side]
  if (!state.ctx) return
  state.isDrawing = false
  state.ctx.closePath()
}

const clearCanvas = (side) => {
  const el = side === 'A' ? canvasRefA.value : canvasRefB.value
  const state = drawingState.value[side]
  if (!el || !state.ctx) return
  state.ctx.clearRect(0, 0, el.width, el.height)
  state.hasSketch = false
}

const submitReport = async () => {
  loading.value = true
  const token = localStorage.getItem('token')
  
  // Adresi birleştir
  form.value.address = `${form.value.province}, ${form.value.district}, ${form.value.neighborhood}`
  
  // Çizimleri yakala
  const getCanvasData = (el) => {
    if (!el) return null
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = el.width
    tempCanvas.height = el.height
    const tempCtx = tempCanvas.getContext('2d')
    tempCtx.fillStyle = '#ffffff'
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
    tempCtx.drawImage(el, 0, 0)
    return tempCanvas.toDataURL('image/jpeg', 0.8)
  }

  if (drawingState.value['A'].hasSketch && canvasRefA.value) {
    form.value.formData.sketchBase64_A = getCanvasData(canvasRefA.value)
  }
  if (drawingState.value['B'].hasSketch && canvasRefB.value) {
    form.value.formData.sketchBase64_B = getCanvasData(canvasRefB.value)
  }
  
  try {
    await $fetch('/api/reports', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form.value
    })
    
    router.push('/reports')
  } catch (error) {
    if (error.response?.status === 401 || error.status === 401 || error.statusCode === 401) {
      localStorage.removeItem('token')
      window.dispatchEvent(new Event('auth-change'))
      router.push('/login')
    } else {
      alert(error.data?.statusMessage || 'Tutanak kaydedilirken bir hata oluştu.')
    }
  } finally {
    loading.value = false
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

