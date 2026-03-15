<script setup lang="ts">
import { ref } from 'vue'
import { X, ZoomIn, ZoomOut, Maximize2, Info } from 'lucide-vue-next'

defineProps<{
  show: boolean
  imageUrl: string
}>()

defineEmits(['close'])

const scale = ref(1)
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const isInfoOpen = ref(false)

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  const delta = e.deltaY * -0.001
  const newScale = Math.min(Math.max(0.5, scale.value + delta), 4)
  scale.value = newScale
}

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  dragStart.value = { x: clientX - position.value.x, y: clientY - position.value.y }
}

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  position.value = {
    x: clientX - dragStart.value.x,
    y: clientY - dragStart.value.y
  }
}

const stopDrag = () => {
  isDragging.value = false
}

const resetZoom = () => {
  scale.value = 1
  position.value = { x: 0, y: 0 }
}

const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.2, 4)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.2, 0.5)
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" @click="$emit('close')"></div>
    
    <div class="relative bg-white w-full h-full lg:h-auto lg:max-w-6xl lg:rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 lg:zoom-in duration-300 border-slate-200 flex flex-col lg:max-h-[90vh]">
      <!-- Responsive Header -->
      <div class="flex items-center justify-between p-6 lg:p-8 border-b border-slate-100 shrink-0 z-10 bg-white/80 backdrop-blur">
        <div class="flex flex-col">
          <h3 class="text-xl lg:text-2xl font-black text-slate-900 leading-none">Fabric Preview</h3>
          <p class="text-[9px] lg:text-[10px] font-black text-[#3b4a8b] uppercase tracking-[0.2em] mt-2">realistic high-res output</p>
        </div>
        <div class="flex items-center gap-2 lg:gap-4">
          <!-- Tablet/Desktop Zoom -->
          <div class="hidden sm:flex items-center bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <button @click="zoomOut" class="p-3 hover:bg-slate-100 text-slate-500 transition-all border-r border-slate-200"><ZoomOut class="w-5 h-5" /></button>
            <div class="px-4 text-[10px] font-black text-slate-400 w-16 text-center">{{ Math.round(scale * 100) }}%</div>
            <button @click="zoomIn" class="p-3 hover:bg-slate-100 text-slate-500 transition-all border-l border-slate-200"><ZoomIn class="w-5 h-5" /></button>
          </div>
          <button @click="resetZoom" class="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-500 border border-slate-200 shadow-sm" title="Reset View"><Maximize2 class="w-5 h-5" /></button>
          <button @click="isInfoOpen = !isInfoOpen" class="lg:hidden p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-500 border border-slate-200 shadow-sm"><Info class="w-5 h-5" /></button>
          <button @click="$emit('close')" class="p-3 hover:bg-slate-50 rounded-2xl text-slate-400"><X class="w-6 h-6" /></button>
        </div>
      </div>
      
      <div class="flex-grow flex flex-col lg:flex-row overflow-hidden relative">
        <!-- Main Viewer -->
        <div 
          class="relative flex-grow bg-[#edf0f5] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
          @wheel="handleWheel"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="stopDrag"
          @mouseleave="stopDrag"
          @touchstart="startDrag"
          @touchmove="onDrag"
          @touchend="stopDrag"
        >
          <!-- Tiled Fabric -->
          <div 
            class="absolute inset-0 transition-transform duration-75 ease-out will-change-transform" 
            :style="{ 
              backgroundImage: `url(${imageUrl})`, 
              backgroundSize: `${150 * scale}px ${150 * scale}px`,
              backgroundRepeat: 'repeat',
              backgroundPosition: `${position.x}px ${position.y}px`
            }"
          >
            <!-- Overlay texture -->
            <div 
              class="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-multiply" 
              style="background-image: url('https://www.transparenttextures.com/patterns/natural-paper.png')"
            ></div>
            <div class="absolute inset-0 shadow-[inner_0_0_120px_rgba(0,0,0,0.03)] pointer-events-none"></div>
          </div>
          
          <!-- Mobile Controls Layer -->
          <div class="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
            <div class="hidden sm:block px-4 py-2 bg-white/40 backdrop-blur rounded-full text-[9px] font-black uppercase tracking-widest text-slate-600 border border-white/50">jBatik Simulation</div>
            <div class="sm:hidden flex items-center gap-1 bg-white/80 backdrop-blur p-1 rounded-xl pointer-events-auto border border-slate-200 shadow-xl">
               <button @click="zoomOut" class="p-3 text-slate-500 active:scale-90 transition-transform"><ZoomOut class="w-5 h-5" /></button>
               <button @click="zoomIn" class="p-3 text-slate-500 active:scale-90 transition-transform"><ZoomIn class="w-5 h-5" /></button>
            </div>
          </div>
        </div>
        
        <!-- Info Panel (Drawer on Mobile) -->
        <aside 
          :class="isInfoOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'"
          class="absolute lg:relative bottom-0 inset-x-0 lg:inset-auto lg:w-96 bg-white shrink-0 z-20 transition-transform duration-300 lg:border-l border-slate-200 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] lg:shadow-none rounded-t-[40px] lg:rounded-none flex flex-col max-h-[70%] lg:max-h-full"
        >
          <div class="flex-grow p-8 lg:p-10 overflow-y-auto space-y-8">
            <div class="lg:hidden w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-4" @click="isInfoOpen = false"></div>
            
            <div class="space-y-4">
              <h4 class="text-xl font-black text-slate-900 font-black">Specs Detail</h4>
              <p class="text-[13px] text-slate-500 font-bold leading-relaxed">
                Render simulasi ini menggunakan profile warna kain Cotton Primisima asli untuk hasil yang paling akurat sebelum naik cetak.
              </p>
            </div>
            
            <div class="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
                <span class="block text-[9px] font-black text-[#c5a47e] uppercase tracking-widest mb-1.5">Material</span>
                <span class="text-base font-black text-slate-800">Fine Cotton</span>
              </div>
              <div class="bg-indigo-50/30 p-6 rounded-3xl border border-indigo-100 shadow-sm">
                <span class="block text-[9px] font-black text-[#3b4a8b] uppercase tracking-widest mb-1.5">Simulation</span>
                <span class="text-base font-black text-slate-800">4x Precision</span>
              </div>
            </div>

            <p class="text-[11px] font-bold text-slate-400 italic">
              "Pastikan motif terlihat harmonis saat di-zoom. Desain Anda adalah warisan baru."
            </p>
          </div>
          
          <div class="p-8 lg:p-10 pt-0">
            <button @click="$emit('close')" class="w-full py-5 bg-[#313a5b] text-white font-black rounded-2xl shadow-xl shadow-[#313a5b]/10 hover:bg-[#3b4a8b] active:scale-95 transition-all text-xs lg:text-sm uppercase tracking-widest">
              Kembali Mendesain
            </button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-grab { cursor: grab; }
.cursor-grabbing { cursor: grabbing; }
</style>
