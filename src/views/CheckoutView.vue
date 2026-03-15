<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, CreditCard, Truck, ShieldCheck, CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const isProcessing = ref(false)
const isSuccess = ref(false)

const handlePayment = () => {
  isProcessing.value = true
  // Mock payment process
  setTimeout(() => {
    isProcessing.value = false
    isSuccess.value = true
  }, 2000)
}
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 lg:p-12 text-slate-800">
    <div class="max-w-6xl mx-auto">
      <header class="flex items-center justify-between mb-8 lg:mb-12">
        <button @click="router.back()" class="flex items-center gap-2 text-slate-400 hover:text-[#3b4a8b] font-black transition-colors text-xs lg:text-sm uppercase tracking-widest">
          <ArrowLeft class="w-4 lg:w-5 h-4 lg:h-5" />
          <span class="hidden xs:inline">Kembali</span>
        </button>
        <span class="text-lg lg:text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#3b4a8b] to-[#1a202c]">Batik</span>
        <div class="w-10 lg:hidden"></div>
      </header>

      <div v-if="!isSuccess" class="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <!-- Main Form -->
        <div class="flex-grow space-y-6 lg:space-y-8 order-2 lg:order-1">
          <section class="bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-200">
            <div class="flex items-center gap-4 mb-6 lg:mb-8">
              <div class="w-10 h-10 bg-[#3b4a8b]/10 text-[#3b4a8b] rounded-xl flex items-center justify-center border border-[#3b4a8b]/10 shadow-inner">
                <Truck class="w-5 h-5" />
              </div>
              <h3 class="text-lg lg:text-xl font-black text-slate-900">Alamat Pengiriman</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
              <div class="space-y-2">
                <label class="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Lengkap</label>
                <input type="text" placeholder="Azmi Farras" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-[#3b4a8b]/20 outline-none text-sm lg:text-base text-slate-900 font-medium shadow-sm transition-all" />
              </div>
              <div class="space-y-2">
                <label class="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nomor HP</label>
                <input type="text" placeholder="08123456789" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-[#3b4a8b]/20 outline-none text-sm lg:text-base text-slate-900 font-medium shadow-sm transition-all" />
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Alamat Lengkap</label>
                <textarea rows="3" placeholder="Jl. Batik No. 123, Bandung" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-[#3b4a8b]/20 outline-none text-sm lg:text-base text-slate-900 font-medium shadow-sm transition-all"></textarea>
              </div>
            </div>
          </section>

          <section class="bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-200">
            <div class="flex items-center gap-4 mb-6 lg:mb-8">
              <div class="w-10 h-10 bg-[#c5a47e]/10 text-[#c5a47e] rounded-xl flex items-center justify-center border border-[#c5a47e]/10 shadow-inner">
                <CreditCard class="w-5 h-5" />
              </div>
              <h3 class="text-lg lg:text-xl font-black text-slate-900">Metode Pembayaran</h3>
            </div>
            
            <div class="p-5 lg:p-6 rounded-2xl border-2 border-[#3b4a8b]/30 bg-[#3b4a8b]/5 flex items-center justify-between group pointer-events-none shadow-sm">
              <div class="flex items-center gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" class="h-5 lg:h-6" />
                <div>
                  <p class="font-black text-sm lg:text-base text-slate-800">QRIS Instan</p>
                  <p class="text-[9px] lg:text-[10px] text-slate-500 uppercase tracking-widest font-black">Pembayaran otomatis</p>
                </div>
              </div>
              <div class="w-5 h-5 bg-[#3b4a8b] rounded-full flex items-center justify-center shadow-lg">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </section>
        </div>

        <!-- Order Summary: Sticky on desktop, first on mobile -->
        <div class="w-full lg:w-96 shrink-0 order-1 lg:order-2">
          <div class="bg-white rounded-3xl p-6 lg:p-8 shadow-2xl border border-slate-200 lg:sticky lg:top-12">
            <h3 class="text-base lg:text-lg font-black text-slate-900 mb-6 underline decoration-[#c5a47e] decoration-4 underline-offset-4">Ringkasan Pesanan</h3>
            
            <div class="space-y-4 mb-8">
              <div class="flex items-center justify-between text-xs lg:text-sm">
                <span class="text-slate-400 font-black uppercase tracking-widest text-[9px] lg:text-[10px]">Material (2m)</span>
                <span class="font-black text-slate-800">Rp 300.000</span>
              </div>
              <div class="flex items-center justify-between text-xs lg:text-sm">
                <span class="text-slate-400 font-black uppercase tracking-widest text-[9px] lg:text-[10px]">Pengiriman</span>
                <span class="font-black text-slate-800">Rp 15.000</span>
              </div>
              <div class="h-px bg-slate-50"></div>
              <div class="flex items-center justify-between pt-2">
                <span class="font-black text-slate-900 uppercase tracking-tighter text-sm lg:text-base">Grand Total</span>
                <span class="text-xl lg:text-2xl font-black text-[#313a5b]">Rp 315.000</span>
              </div>
            </div>

            <button 
              @click="handlePayment"
              :disabled="isProcessing"
              class="w-full py-4 lg:py-5 bg-[#313a5b] text-white font-black rounded-2xl shadow-xl hover:bg-[#3b4a8b] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-xs lg:text-sm uppercase tracking-widest"
            >
              <span v-if="!isProcessing">Bayar Sekarang</span>
              <span v-else class="flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Proses...
              </span>
            </button>
            
            <p class="mt-6 flex items-center justify-center gap-2 text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
              <ShieldCheck class="w-3 h-3 text-green-600" />
              Verified Transaction
            </p>
          </div>
        </div>
      </div>

      <!-- Success State -->
      <div v-else class="max-w-md mx-auto bg-white rounded-[40px] p-8 lg:p-12 text-center shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-500">
        <div class="w-16 lg:w-20 h-16 lg:h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 shadow-inner border border-green-100">
          <CheckCircle2 class="w-8 lg:w-10 h-8 lg:h-10" />
        </div>
        <h3 class="text-2xl lg:text-3xl font-black text-slate-900 mb-2 font-black">Yeay! Terbayar.</h3>
        <p class="text-slate-500 text-xs lg:text-sm mb-10 leading-relaxed font-black px-4 uppercase tracking-wider">Desain Anda sedang masuk antrean cetak.</p>
        
        <div class="space-y-4">
          <button @click="router.push('/dashboard')" class="w-full py-4 lg:py-5 bg-[#313a5b] text-white font-black rounded-2xl hover:bg-[#3b4a8b] transition-all shadow-xl text-xs lg:text-sm uppercase tracking-widest">
            Ke Dashboard
          </button>
          <button @click="router.push('/')" class="w-full py-4 text-slate-400 font-black hover:text-slate-900 transition-colors uppercase tracking-widest text-[9px] lg:text-[10px]">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
