<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-vue-next'

const router = useRouter()

const categories = [
  { id: 'scarf', name: 'Scarf', description: 'Square or rectangular fabric for versatile styling.' },
  { id: 'bandana', name: 'Bandana', description: 'Small square fabric, perfect for hair accessories.' },
  { id: 'hijab', name: 'Hijab', description: 'Elegant and breathable fabric specifically for hijabs.' },
]

const products = [
  { id: 'p1', category: 'scarf', name: 'Cotton Silk Scarf', size: '100cm x 100cm', price: 'Rp 250.000', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800' },
  { id: 'p2', category: 'scarf', name: 'Premium Voile Scarf', size: '115cm x 115cm', price: 'Rp 180.000', image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&q=80&w=800' },
  { id: 'p3', category: 'bandana', name: 'Mini Bandana', size: '50cm x 50cm', price: 'Rp 75.000', image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=800' },
  { id: 'p4', category: 'hijab', name: 'Basic Voile Hijab', size: '110cm x 110cm', price: 'Rp 120.000', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=800' },
]

const recentDesigns = [
  { id: 'r1', name: 'Megamendung Premium', date: '01/01/2026, 18:43', image: '/src/assets/motifs/megamendung.png' },
  { id: 'r2', name: 'Fractal Azure', date: '02/01/2026, 10:15', image: '/src/assets/motifs/fractal.png' }
]

const selectedCategory = ref('scarf')
const selectedProduct = ref<any>(null)
const showModal = ref(false)
const isSidebarOpen = ref(false)

const filteredProducts = computed(() => {
  return products.filter(p => p.category === selectedCategory.value)
})

const openProduct = (product: any) => {
  selectedProduct.value = product
  showModal.value = true
}

const startDesigning = () => {
  router.push('/design')
}
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fa] flex flex-col lg:flex-row text-slate-800">
    <!-- Mobile Sidebar Toggle -->
    <div class="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <span class="text-xl font-black text-[#3b4a8b]">Product Specs</span>
      <button @click="isSidebarOpen = !isSidebarOpen" class="flex items-center gap-2 text-sm font-bold text-slate-500">
        {{ categories.find(c => c.id === selectedCategory)?.name }}
        <ChevronRight :class="isSidebarOpen ? 'rotate-90' : ''" class="w-4 h-4 transition-transform" />
      </button>
    </div>

    <!-- Sidebar -->
    <aside 
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      class="fixed lg:relative inset-y-0 left-0 w-[300px] sm:w-[340px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-50 transition-transform duration-300 ease-in-out"
    >
      <div class="p-8 lg:p-10 lg:pt-16 h-full overflow-y-auto">
        <div class="flex items-center justify-between lg:block mb-8 lg:mb-0">
          <h2 class="text-2xl lg:text-3xl font-black text-slate-900 mb-2 lg:mb-4">Make (explain)</h2>
          <button @click="isSidebarOpen = false" class="lg:hidden p-2 text-slate-400">
            <ChevronLeft class="w-6 h-6" />
          </button>
        </div>
        <p class="text-xs text-slate-500 leading-relaxed font-medium mb-10 lg:mb-12">
          Choose a fabric template to start your batik design journey. Each fabric is premium quality and ready for your creativity.
        </p>

        <nav class="space-y-3 lg:space-y-4">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            @click="selectedCategory = cat.id; isSidebarOpen = false"
            :class="selectedCategory === cat.id ? 'bg-[#3b4a8b] text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'"
            class="w-full h-24 lg:h-32 rounded-2xl lg:rounded-3xl p-5 lg:p-6 text-left transition-all relative overflow-hidden group border border-slate-200/50 shadow-sm"
          >
            <span class="text-base lg:text-lg font-black relative z-10">{{ cat.name }}</span>
            <div v-if="selectedCategory === cat.id" class="absolute right-5 lg:right-6 top-1/2 -translate-y-1/2 w-1.5 lg:w-2 h-1.5 lg:h-2 bg-[#c5a47e] rounded-full"></div>
          </button>
        </nav>

        <div class="mt-12 lg:mt-16">
          <h2 class="text-2xl lg:text-3xl font-black text-slate-900 mb-2 lg:mb-4 capitalize">{{ selectedCategory }} (explain)</h2>
          <p class="text-[10px] lg:text-xs text-slate-500 leading-relaxed font-medium">
            {{ categories.find(c => c.id === selectedCategory)?.description }}
          </p>
        </div>
      </div>
    </aside>

    <!-- Sidebar Overlay (Mobile) -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"></div>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <header class="hidden lg:flex h-20 bg-white/80 backdrop-blur px-12 items-center justify-between z-10 border-b border-slate-200">
        <div class="flex items-center gap-4 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button class="px-8 py-2 bg-white text-[#3b4a8b] shadow-sm rounded-lg text-xs font-black">Make</button>
          <button class="px-8 py-2 text-slate-500 hover:text-slate-900 rounded-lg text-xs font-black transition-all">Learn Batik</button>
        </div>
        
        <button @click="router.push('/dashboard')" class="px-10 py-2.5 bg-[#3b4a8b] hover:bg-[#2d3a6d] text-white rounded-xl text-xs font-black transition-all shadow-md">
          Sign In
        </button>
      </header>

      <div class="flex-grow overflow-y-auto p-6 sm:p-10 lg:p-12 lg:pt-0">
        <h1 class="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-200 mb-8 lg:mb-12 tracking-tighter select-none">Batik</h1>

        <section class="mb-12 lg:mb-16">
          <h3 class="text-[10px] lg:text-sm font-black text-slate-400 uppercase tracking-widest mb-6 lg:mb-8">Choose from our template</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div 
              v-for="product in filteredProducts" 
              :key="product.id"
              @click="openProduct(product)"
              class="group cursor-pointer"
            >
              <div class="aspect-square bg-white rounded-2xl lg:rounded-3xl border border-slate-200 mb-3 lg:mb-4 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#3b4a8b]/40 shadow-sm">
                 <img :src="product.image" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <p class="text-center text-[10px] lg:text-xs font-black text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-widest px-2 truncate">{{ product.name }}</p>
            </div>
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-6 lg:mb-8">
            <h3 class="text-[10px] lg:text-sm font-black text-slate-400 uppercase tracking-widest">Recent Designs</h3>
            <button class="text-[10px] font-black text-[#c5a47e] uppercase tracking-widest lg:hidden">View All</button>
          </div>
          <div class="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            <div 
              v-for="recent in recentDesigns" 
              :key="recent.id"
              class="shrink-0 w-36 sm:w-48 group cursor-pointer"
            >
              <div class="aspect-square bg-white rounded-2xl lg:rounded-3xl border border-slate-200 mb-3 lg:mb-4 flex items-center justify-center overflow-hidden transition-all hover:border-[#3b4a8b]/40 shadow-sm">
                 <div class="w-full h-full flex items-center justify-center bg-slate-50 p-6 lg:p-8">
                   <img :src="recent.image" class="w-full h-full object-contain opacity-40 group-hover:opacity-80 transition-opacity" />
                 </div>
              </div>
              <p class="text-[9px] lg:text-[10px] font-black text-slate-700 uppercase tracking-wider px-1 truncate">{{ recent.name }}</p>
              <p class="text-[8px] lg:text-[9px] font-bold text-slate-400 mt-0.5 px-1">{{ recent.date }}</p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Detailed Product Modal (Full screen on mobile) -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 lg:scale-95 translate-y-full lg:translate-y-0"
      enter-to-class="opacity-100 lg:scale-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 lg:scale-100 translate-y-0"
      leave-to-class="opacity-0 lg:scale-95 translate-y-full lg:translate-y-0"
    >
      <div v-if="showModal && selectedProduct" class="fixed inset-0 z-[100] flex items-end lg:items-center justify-center lg:p-12">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showModal = false"></div>
        
        <div class="relative bg-white w-full h-[90%] lg:h-auto lg:max-w-5xl rounded-t-[40px] lg:rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-slate-200 animate-in">
           <!-- Close Button -->
           <button 
            @click="showModal = false"
            class="absolute top-6 right-6 lg:top-8 lg:right-8 p-2 lg:p-3 bg-white/80 lg:bg-slate-50 backdrop-blur rounded-xl lg:rounded-2xl text-slate-400 hover:text-slate-600 z-50 transition-all border border-slate-200 shadow-sm"
           >
             <X class="w-5 h-5 lg:w-6 h-6" />
           </button>

           <!-- Left: Preview -->
           <div class="w-full lg:w-1/2 h-[40%] lg:h-[600px] shrink-0 bg-slate-50 relative overflow-hidden flex items-center justify-center">
              <img :src="selectedProduct.image" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
           </div>

           <!-- Right: Details -->
           <div class="flex-grow p-8 lg:p-12 flex flex-col overflow-y-auto">
              <div class="flex-grow">
                <h2 class="text-2xl lg:text-4xl font-black text-slate-900 mb-1 lg:mb-2 leading-tight">{{ selectedProduct.name }}</h2>
                <p class="text-base lg:text-xl font-bold text-[#c5a47e] mb-6 lg:mb-8">{{ selectedProduct.category }}</p>

                <div class="space-y-6 lg:space-y-8">
                  <div class="grid grid-cols-2 lg:block gap-4">
                    <div>
                      <h4 class="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 lg:mb-3">Standard Size</h4>
                      <p class="text-sm lg:text-xl font-bold text-slate-700 border-b border-slate-100 pb-3 lg:pb-4">{{ selectedProduct.size }}</p>
                    </div>
                    <div>
                      <h4 class="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 lg:mb-3">Material</h4>
                      <p class="text-sm lg:text-xl font-bold text-slate-700 border-b border-slate-100 pb-3 lg:pb-4">Premium Cotton</p>
                    </div>
                  </div>

                  <div>
                    <h4 class="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 lg:mb-3">Description</h4>
                    <p class="text-[11px] lg:text-sm text-slate-500 leading-relaxed font-medium">
                      High-quality fabric optimized for digital batik printing. Soft, durable, and maintains color vibrancy after multiple washes. Perfect for daily wear or formal accessories.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Fixed Footer in Modal on Mobile -->
              <div class="mt-8 lg:mt-12 flex items-center justify-between pt-6 border-t border-slate-50">
                 <div class="flex flex-col">
                   <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
                   <p class="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">{{ selectedProduct.price }}</p>
                 </div>
                 <button 
                  @click="startDesigning"
                  class="px-8 lg:px-12 py-3.5 lg:py-5 bg-[#3b4a8b] hover:bg-[#2d3a6d] text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-200 active:scale-95 flex items-center gap-2 text-xs lg:text-sm uppercase tracking-widest"
                 >
                   Make it!
                 </button>
              </div>
           </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
