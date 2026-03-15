<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Palette, 
  Layers, 
  ArrowRight, 
  Sparkles,
  ImageIcon,
  Menu,
  X
} from 'lucide-vue-next'

const router = useRouter()
const isMenuOpen = ref(false)

const startDesigning = () => {
  router.push('/products')
}

const features = [
  {
    icon: Sparkles,
    title: 'Generative Batik',
    description: 'Create unique patterns using advanced mathematics and traditional philosophy.'
  },
  {
    icon: Palette,
    title: 'Smart Colorizer',
    description: 'Apply high-resolution batik palettes curated by traditional artists.'
  },
  {
    icon: Layers,
    title: 'Infinite Layouts',
    description: 'Drag, drop, and scale motifs on an infinite digital fabric canvas.'
  }
]
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fa] overflow-x-hidden selection:bg-[#3b4a8b]/10 selection:text-[#3b4a8b]">
    <!-- Abstract Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute -top-[10%] -right-[10%] w-[80%] lg:w-[60%] h-[60%] bg-[#3b4a8b]/5 rounded-full blur-[80px] lg:blur-[120px]"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[70%] lg:w-[50%] h-[50%] bg-[#c5a47e]/5 rounded-full blur-[70px] lg:blur-[100px]"></div>
    </div>

    <!-- Navigation -->
    <nav class="relative z-50 h-20 lg:h-24 px-6 lg:px-16 flex items-center justify-between border-b border-slate-200/50 backdrop-blur-md bg-white/60 sticky top-0">
      <div class="flex items-center gap-2 lg:gap-3">
        <div class="w-8 h-8 lg:w-10 h-10 bg-[#3b4a8b] rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg shadow-[#3b4a8b]/20">
          <Sparkles class="w-4 h-4 lg:w-5 h-5 text-white" />
        </div>
        <span class="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter">Batik</span>
      </div>

      <!-- Nav links removed for simplification -->
      <div class="hidden lg:flex items-center gap-10"></div>

      <div class="flex items-center gap-4">
        <button @click="router.push('/dashboard')" class="hidden sm:block px-6 lg:px-8 py-2.5 lg:py-3 bg-white text-slate-700 font-black rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all uppercase tracking-widest text-[9px] lg:text-[10px]">
          Sign in
        </button>
        <!-- Mobile Menu Toggle -->
        <button @click="isMenuOpen = !isMenuOpen" class="lg:hidden p-2 text-slate-900">
          <Menu v-if="!isMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Menu Overlay -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div v-if="isMenuOpen" class="absolute top-20 left-0 right-0 bg-white border-b border-slate-200 p-6 flex flex-col gap-6 lg:hidden shadow-xl z-50">
          <!-- Navigation links removed -->
          <button @click="router.push('/dashboard')" class="w-full py-4 bg-slate-50 text-slate-900 font-black rounded-xl border border-slate-200 uppercase tracking-widest text-[10px]">
             Sign in
          </button>
        </div>
      </transition>
    </nav>

    <!-- Hero Section -->
    <main class="relative z-10 px-6 lg:px-16 pt-16 lg:pt-32 pb-24 lg:pb-32 max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
        <div class="w-full lg:w-3/5 space-y-8 lg:space-y-10 text-center lg:text-left">
          <div class="inline-flex items-center gap-3 px-4 lg:px-5 py-2 lg:py-2.5 bg-[#3b4a8b]/5 border border-[#3b4a8b]/10 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-[#3b4a8b] shadow-sm animate-fade-in">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3b4a8b] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-[#3b4a8b]"></span>
            </span>
            Future of Indonesian Heritage
          </div>
          
          <h1 class="text-4xl sm:text-5xl lg:text-8xl font-black text-slate-900 leading-[1.1] lg:leading-[1.05] tracking-tight">
            Desain Batik <br class="hidden sm:block"/> 
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-[#3b4a8b] to-[#1a202c]">Eksklusif Anda</span>
          </h1>

          <p class="text-lg lg:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Platform desain batik digital pertama yang menggabungkan filosofi tradisional dengan teknologi generatif modern.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-5 pt-4 lg:pt-8 w-full max-w-md mx-auto lg:mx-0">
            <button 
              @click="startDesigning"
              class="group w-full sm:w-auto px-8 lg:px-12 py-4 lg:py-6 bg-[#3b4a8b] text-white font-black rounded-2xl lg:rounded-[2rem] shadow-2xl shadow-[#3b4a8b]/20 hover:shadow-[#3b4a8b]/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] lg:text-xs"
            >
              Mulai Desain Sekarang
              <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button class="w-full sm:w-auto px-8 lg:px-10 py-4 lg:py-6 text-slate-500 font-black hover:text-[#3b4a8b] transition-colors uppercase tracking-widest text-[10px] lg:text-xs flex items-center justify-center gap-2">
              <ImageIcon class="w-5 h-5" />
              Lihat Galeri
            </button>
          </div>
        </div>

        <!-- Preview Mockup: Hidden on small mobile or redesigned -->
        <div class="w-full lg:w-2/5 flex items-center justify-center mt-12 lg:mt-0">
          <div class="relative w-full max-w-[280px] sm:max-w-md">
            <div class="absolute inset-0 bg-gradient-to-tr from-[#3b4a8b] to-[#c5a47e] rounded-[2rem] lg:rounded-[3rem] rotate-6 scale-95 opacity-20 blur-xl lg:blur-2xl"></div>
            <div class="relative bg-white border border-slate-200 lg:p rounded-[2rem] lg:rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
               <img src="/src/assets/motifs/megamendung.png" class="w-full aspect-square object-cover rounded-2xl lg:rounded-[2rem]" />
            </div>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <section class="mt-32 lg:mt-40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <div 
          v-for="feature in features" 
          :key="feature.title"
          class="group p-8 lg:p-10 bg-white border border-slate-200/60 rounded-[2rem] lg:rounded-[3rem] hover:border-[#3b4a8b]/40 transition-all hover:shadow-2xl hover:shadow-[#3b4a8b]/5 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <div class="w-14 h-14 lg:w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 lg:mb-8 border border-white group-hover:bg-[#3b4a8b] group-hover:text-white transition-all shadow-inner">
            <component :is="feature.icon" class="w-7 h-7 lg:w-8 h-8 transition-transform group-hover:scale-110" />
          </div>
          <h3 class="text-xl lg:text-2xl font-black text-slate-900 mb-3 lg:mb-4 tracking-tight">{{ feature.title }}</h3>
          <p class="text-sm lg:text-base text-slate-500 font-bold leading-relaxed">{{ feature.description }}</p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 px-6 lg:px-16 py-12 lg:py-16 border-t border-slate-200 bg-white flex flex-col items-center gap-6 lg:gap-8">
       <div class="flex items-center gap-3 grayscale opacity-30">
        <Sparkles class="w-4 h-4 lg:w-5 h-5 text-slate-900" />
        <span class="text-lg lg:text-xl font-black text-slate-900">Batik</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-slow {
  animation: bounce-slow 4s infinite ease-in-out;
}
</style>
