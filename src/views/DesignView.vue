<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { Canvas, loadSVGFromURL, util, FabricImage, filters } from 'fabric'
import { useRouter } from 'vue-router'
import { useDesignStore } from '../stores/designStore'
import { 
  Trash2, RotateCw, RotateCcw, 
  X,
  ZoomIn, ZoomOut, Maximize,
  Home, Palette as PaletteIcon, Layout, Library
} from 'lucide-vue-next'
import VisualPreview from '../components/VisualPreview.vue'

const designStore = useDesignStore()
const router = useRouter()
const canvasEl = ref<HTMLCanvasElement | null>(null)
const canvasContainer = ref<HTMLElement | null>(null)
let fabricCanvas: Canvas | null = null

const showPreview = ref(false)
const previewImage = ref('')
const activePanel = ref('libs')
const colorMode = ref('motif')
const isMobileMenuOpen = ref(false)

const handlePreview = () => {
  if (fabricCanvas) {
    previewImage.value = fabricCanvas.toDataURL({
      format: 'png',
      quality: 0.8,
      multiplier: 1
    })
    showPreview.value = true
  }
}

const canvasSizes = [
  { name: 'S (100x100)', width: 600, height: 600 },
  { name: 'M (150x100)', width: 900, height: 600 },
  { name: 'L (200x100)', width: 1200, height: 600 },
]

const selectedSize = ref(canvasSizes[0])

const resizeCanvas = () => {
  if (!fabricCanvas || !canvasContainer.value) return
  
  const container = canvasContainer.value
  const scale = Math.min(
    (container.clientWidth - 48) / selectedSize.value.width,
    (container.clientHeight - 48) / selectedSize.value.height,
    1
  )
  
  const wrapper = document.querySelector('.canvas-container') as HTMLElement
  if (wrapper) {
    wrapper.style.transform = `scale(${scale})`
  }
}

onMounted(() => {
  if (canvasEl.value) {
    fabricCanvas = new Canvas(canvasEl.value, {
      width: selectedSize.value.width,
      height: selectedSize.value.height,
      backgroundColor: designStore.backgroundColor
    })

    fabricCanvas.on('object:moving', (options) => {
      const grid = 20
      if (options.target) {
        options.target.set({
          left: Math.round(options.target.left! / grid) * grid,
          top: Math.round(options.target.top! / grid) * grid
        })
      }
    })
    
    window.addEventListener('resize', resizeCanvas)
    setTimeout(resizeCanvas, 100)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
})

watch(selectedSize, (newSize) => {
  if (fabricCanvas) {
    fabricCanvas.setDimensions({ width: newSize.width, height: newSize.height })
    fabricCanvas.renderAll()
    resizeCanvas()
  }
})

watch(() => designStore.backgroundColor, (newColor) => {
  if (fabricCanvas) {
    fabricCanvas.set({ backgroundColor: newColor })
    fabricCanvas.renderAll()
  }
})

const addMotif = async (url: string) => {
  if (!fabricCanvas) return

  try {
    let obj: any
    if (url.toLowerCase().endsWith('.svg')) {
      const { objects, options } = await loadSVGFromURL(url)
      const validObjects = objects.filter((o): o is any => o !== null)
      obj = util.groupSVGElements(validObjects, options)
    } else {
      obj = await FabricImage.fromURL(url)
      // Base scale for images to fit well
      obj.scaleToWidth(300)
    }
    
    obj.set({
      left: fabricCanvas.width! / 2,
      top: fabricCanvas.height! / 2,
      originX: 'center',
      originY: 'center'
    })
    
    fabricCanvas.add(obj)
    fabricCanvas.setActiveObject(obj)
    fabricCanvas.renderAll()
    if (window.innerWidth < 1024) activePanel.value = ''
  } catch (err) {
    console.error('Error loading motif:', err)
  }
}

const applyPalette = (colors: string[]) => {
  if (!fabricCanvas) return

  const activeObjects = fabricCanvas.getActiveObjects()
  
  if (colorMode.value === 'motif') {
    if (activeObjects.length > 0) {
      activeObjects.forEach(obj => {
        if ((obj as any)._objects) {
          // Vector SVG Group
          (obj as any)._objects.forEach((innerObj: any, idx: number) => {
            innerObj.set('fill', colors[idx % colors.length])
          })
        } else if (obj instanceof FabricImage) {
          // Image Motif (New Batik Patterns)
          const color = colors[0]
          // @ts-ignore
          const filter = new filters.BlendColor({
            color: color,
            mode: 'multiply'
          })
          obj.filters = [filter]
          obj.applyFilters()
        } else {
          // Regular Vector Object
          obj.set('fill', colors[0])
        }
      })
      fabricCanvas.renderAll()
      designStore.addToHistory(colors[0])
    }
  } else {
    designStore.setBackgroundColor(colors[0])
  }
}

const deleteSelected = () => {
  if (fabricCanvas) {
    const activeObjects = fabricCanvas.getActiveObjects()
    fabricCanvas.remove(...activeObjects as any)
    fabricCanvas.discardActiveObject()
    fabricCanvas.renderAll()
  }
}

const rotateSelected = () => {
  if (fabricCanvas) {
    const obj = fabricCanvas.getActiveObject()
    if (obj) {
      obj.rotate((obj.angle || 0) + 90)
      fabricCanvas.renderAll()
    }
  }
}

const clearCanvas = () => {
  if (fabricCanvas && confirm('Hapus semua desain?')) {
    fabricCanvas.clear()
    fabricCanvas.set({ backgroundColor: designStore.backgroundColor })
    fabricCanvas.renderAll()
  }
}

const togglePanel = (panel: string) => {
  if (activePanel.value === panel) {
    activePanel.value = ''
  } else {
    activePanel.value = panel
  }
}
</script>

<template>
  <div class="h-screen flex flex-col bg-[#f0f2f5] overflow-hidden text-slate-800 font-sans">
    <!-- Top Nav: Responsive -->
    <header class="h-14 lg:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0 z-50 shadow-sm">
      <div class="flex items-center gap-2 lg:gap-4 font-black">
        <button @click="router.push('/products')" class="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-500 hover:text-[#3b4a8b]">
          <Home class="w-4 h-4" />
          <span class="hidden sm:inline text-[10px] uppercase tracking-widest">Back</span>
        </button>
        <div class="hidden sm:block h-6 w-px bg-slate-200"></div>
        <span class="text-sm lg:text-lg tracking-tighter text-[#3b4a8b]">Batik Studio</span>
      </div>

      <!-- Desktop Toolbar -->
      <div class="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
        <button @click="togglePanel('libs')" :class="activePanel === 'libs' ? 'bg-white text-[#3b4a8b] shadow-sm' : 'text-slate-400 hover:text-slate-600'" class="px-3 lg:px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2">
          <Library class="w-3.5 h-3.5" />
          Library
        </button>
        <button @click="togglePanel('color')" :class="activePanel === 'color' ? 'bg-white text-[#3b4a8b] shadow-sm' : 'text-slate-400 hover:text-slate-600'" class="px-3 lg:px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2">
          <PaletteIcon class="w-3.5 h-3.5" />
          Colors
        </button>
        <button @click="togglePanel('layout')" :class="activePanel === 'layout' ? 'bg-white text-[#3b4a8b] shadow-sm' : 'text-slate-400 hover:text-slate-600'" class="px-3 lg:px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2">
          <Layout class="w-3.5 h-3.5" />
          Canvas
        </button>
      </div>

      <div class="flex items-center gap-2 lg:gap-4">
        <div class="hidden sm:flex items-center bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
          <button class="p-2 hover:bg-white text-slate-400 hover:text-[#3b4a8b] transition-all border-r border-slate-200" title="Undo"><RotateCcw class="w-4 h-4" /></button>
          <button class="p-2 hover:bg-white text-slate-400 hover:text-[#3b4a8b] transition-all" title="Redo"><RotateCw class="w-4 h-4" /></button>
        </div>
        
        <button @click="handlePreview" class="px-4 lg:px-8 py-2 bg-[#313a5b] hover:bg-[#3b4a8b] text-white rounded-xl text-[10px] lg:text-xs font-black transition-all shadow-lg active:scale-95 uppercase tracking-widest">
          Make it!
        </button>

        <!-- Mobile Menu Toggle -->
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 text-slate-500">
          <MenuIcon class="w-6 h-6" />
        </button>
      </div>
    </header>

    <!-- Mobile Drawer -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden fixed inset-x-0 bottom-0 bg-white z-[60] p-6 rounded-t-[32px] shadow-2xl border-t border-slate-200 flex flex-col gap-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-black uppercase tracking-widest text-slate-400">Workspace Tools</span>
          <button @click="isMobileMenuOpen = false" class="p-2 text-slate-400"><X class="w-5 h-5" /></button>
        </div>
        <button @click="togglePanel('libs'); isMobileMenuOpen = false" class="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-black text-slate-700">
          <div class="flex items-center gap-3"><Library class="w-5 h-5 text-[#3b4a8b]" /> Motif Library</div>
          <ChevronRight class="w-4 h-4" />
        </button>
        <button @click="togglePanel('color'); isMobileMenuOpen = false" class="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-black text-slate-700">
          <div class="flex items-center gap-3"><PaletteIcon class="w-5 h-5 text-[#3b4a8b]" /> Color Palette</div>
          <ChevronRight class="w-4 h-4" />
        </button>
        <button @click="togglePanel('layout'); isMobileMenuOpen = false" class="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-black text-slate-700">
          <div class="flex items-center gap-3"><Layout class="w-5 h-5 text-[#3b4a8b]" /> Canvas Size</div>
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </transition>
    <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"></div>

    <main class="flex-grow flex flex-col lg:flex-row relative overflow-hidden">
      <!-- Side Panels: Adjusted for Mobile -->
      <transition 
        enter-active-class="transition ease-out duration-300 transform"
        enter-from-class="-translate-x-full lg:-translate-x-full lg:opacity-0"
        enter-to-class="translate-x-0 lg:opacity-100"
        leave-active-class="transition ease-in duration-200 transform"
        leave-from-class="translate-x-0 lg:opacity-100"
        leave-to-class="-translate-x-full lg:-translate-x-full lg:opacity-0"
      >
        <aside v-if="activePanel !== ''" class="fixed lg:absolute inset-y-0 left-0 w-full lg:w-[420px] z-[70] lg:z-40 p-0 lg:p-6 bg-white lg:bg-transparent">
          <div class="bg-white lg:bg-white/95 lg:backdrop-blur-xl h-full flex flex-col overflow-hidden lg:rounded-[32px] lg:shadow-2xl lg:shadow-slate-900/10 lg:border lg:border-slate-200 shadow-xl">
            <!-- Header for Mobile Panel -->
            <div class="lg:hidden p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
               <button @click="activePanel = ''" class="p-2 text-slate-400 hover:text-slate-600"><ChevronLeft class="w-6 h-6" /></button>
               <span class="text-sm font-black uppercase tracking-widest text-slate-900">{{ activePanel }}</span>
               <div class="w-10"></div>
            </div>

            <!-- Libs Panel -->
            <div v-if="activePanel === 'libs'" class="flex flex-col h-full">
              <div class="p-6 lg:p-8 pb-4 flex items-center justify-between shrink-0">
                <div>
                  <h3 class="text-lg lg:text-xl font-black text-slate-900">Motif Library</h3>
                  <p class="text-[9px] lg:text-[10px] font-black text-[#c5a47e] uppercase tracking-[0.2em] mt-1">Heritage Assets</p>
                </div>
                <button @click="activePanel = ''" class="hidden lg:block p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><X class="w-5 h-5" /></button>
              </div>
              <div class="flex-grow overflow-y-auto p-6 lg:p-8 pt-2 grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-2 gap-4">
                <div 
                  v-for="motif in designStore.motifs" 
                  :key="motif.id"
                  @click="addMotif(motif.url)"
                  class="aspect-square bg-slate-50 hover:bg-white rounded-[20px] lg:rounded-[24px] border border-slate-100 p-4 lg:p-6 flex flex-col items-center justify-center gap-2 lg:gap-3 transition-all cursor-pointer group hover:shadow-xl hover:border-[#3b4a8b]/20"
                >
                  <img :src="motif.url" class="w-16 lg:w-20 h-16 lg:h-20 group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100" />
                  <span class="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 text-center truncate w-full">{{ motif.name }}</span>
                </div>
              </div>
            </div>

            <!-- Color Panel -->
            <div v-if="activePanel === 'color'" class="flex flex-col h-full">
              <div class="p-6 lg:p-8 pb-4 shrink-0">
                <div class="flex items-center justify-between mb-6 lg:mb-8">
                  <div class="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 shadow-inner">
                    <button 
                      @click="colorMode = 'motif'"
                      :class="colorMode === 'motif' ? 'bg-white text-[#3b4a8b] shadow-sm' : 'text-slate-400'"
                      class="px-4 lg:px-5 py-1.5 rounded-lg text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Motif
                    </button>
                    <button 
                      @click="colorMode = 'latar'"
                      :class="colorMode === 'latar' ? 'bg-white text-[#3b4a8b] shadow-sm' : 'text-slate-400'"
                      class="px-4 lg:px-5 py-1.5 rounded-lg text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Latar
                    </button>
                  </div>
                  <button @click="activePanel = ''" class="hidden lg:block p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><X class="w-5 h-5" /></button>
                </div>
                <h3 class="text-lg lg:text-xl font-black text-slate-900 mb-4 lg:mb-6">Color Catalogue</h3>
              </div>

              <div class="flex-grow overflow-y-auto px-6 lg:px-8 space-y-4">
                <div 
                  v-for="palette in designStore.palettes" 
                  :key="palette.id"
                  @click="applyPalette(palette.colors)"
                  class="bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-100 transition-all cursor-pointer group flex gap-4 lg:gap-5 hover:shadow-lg hover:border-[#3b4a8b]/20"
                >
                  <div class="flex shrink-0 shadow-sm rounded-lg overflow-hidden border border-white">
                     <div 
                      v-for="(color, i) in palette.colors" 
                      :key="i"
                      class="w-8 lg:w-10 h-12 lg:h-16 transition-transform group-hover:scale-110"
                      :style="{ backgroundColor: color }"
                     ></div>
                  </div>
                  <div class="flex flex-col justify-center overflow-hidden">
                    <h4 class="text-[11px] lg:text-xs font-black text-slate-900 group-hover:text-[#3b4a8b] transition-colors truncate">{{ palette.name }}</h4>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1 line-clamp-1">{{ palette.description }}</p>
                  </div>
                </div>
              </div>

              <div class="p-6 lg:p-8 bg-slate-50 border-t border-slate-100 shrink-0">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Colors</span>
                  <button @click="designStore.clearHistory" class="text-[8px] lg:text-[9px] font-black text-[#c5a47e] uppercase">Clear</button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <div 
                    v-for="color in designStore.colorHistory" 
                    :key="color"
                    @click="applyPalette([color])"
                    class="w-8 lg:w-9 h-8 lg:h-9 rounded-xl border border-white cursor-pointer hover:scale-110 transition-transform shadow-sm"
                    :style="{ backgroundColor: color }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Layout/Size Panel -->
            <div v-if="activePanel === 'layout'" class="flex flex-col h-full overflow-hidden">
              <div class="p-6 lg:p-8 flex flex-col h-full">
                <div class="hidden lg:flex items-center justify-between mb-8 shrink-0">
                  <h3 class="text-lg font-black text-slate-900 uppercase tracking-tight">Product Canvas</h3>
                  <button @click="activePanel = ''" class="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><X class="w-5 h-5" /></button>
                </div>
                
                <div class="space-y-3 lg:space-y-4 flex-grow overflow-y-auto pr-2">
                  <button 
                    v-for="size in canvasSizes" :key="size.name"
                    @click="selectedSize = size"
                    :class="selectedSize.name === size.name ? 'border-[#3b4a8b] bg-[#3b4a8b]/5 text-[#3b4a8b] ring-2 ring-[#3b4a8b]/10' : 'border-slate-100 bg-slate-50 text-slate-400'"
                    class="w-full flex items-center justify-between p-5 lg:p-6 rounded-2xl border transition-all text-left shadow-sm"
                  >
                    <div>
                      <p class="text-xs lg:text-sm font-black">{{ size.name }}</p>
                      <p class="text-[9px] lg:text-[10px] font-bold opacity-60 uppercase mt-1">{{ size.width }}x{{ size.height }} PX</p>
                    </div>
                    <div v-if="selectedSize.name === size.name" class="w-2.5 lg:w-3 h-2.5 lg:h-3 bg-[#3b4a8b] rounded-full shadow-lg shadow-[#3b4a8b]/30"></div>
                  </button>
                </div>

                <div class="mt-8 lg:mt-12 bg-white p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] text-white shadow-2xl relative overflow-hidden group shrink-0">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <p class="text-[9px] lg:text-[10px] font-black text-[#c5a47e] uppercase tracking-[0.2em] mb-3">Order Specs</p>
                  <div class="flex items-baseline text-[#313a5b] gap-2 mb-6 text-xl lg:text-2xl font-black">
                    <span>Rp 315.000</span>
                    <span class="text-[9px] lg:text-[10px] text-slate-500 font-bold uppercase tracking-widest">/ meter</span>
                  </div>
                  <button @click="router.push('/checkout')" class="w-full py-4 bg-[#313a5b] text-white font-black rounded-xl lg:rounded-2xl hover:bg-[#d4b58f] transition-all active:scale-95 shadow-lg shadow-[#c5a47e]/10 uppercase tracking-widest text-[10px] lg:text-xs">
                    Confirm & Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </transition>

      <!-- Main Canvas Area -->
      <section ref="canvasContainer" class="flex-grow flex items-center justify-center p-4 lg:p-12 relative overflow-hidden bg-[#e0e3e9]">
        <!-- Grid Background -->
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(#3b4a8b 1px, transparent 1px); background-size: 32px 32px;"></div>

        <!-- Float Toolbar: Optimized for touch -->
        <div class="absolute top-6 lg:top-8 flex items-center bg-white/90 backdrop-blur-xl border border-slate-200 px-3 lg:px-4 py-1.5 lg:py-2 rounded-2xl shadow-2xl gap-2 lg:gap-3 z-30 animate-in slide-in-from-top-4">
          <button @click="rotateSelected" class="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100" title="Rotate"><RotateCw class="w-4.5 lg:w-5 h-4.5 lg:h-5" /></button>
          <button @click="deleteSelected" class="p-2.5 hover:bg-red-50 text-red-400 rounded-xl transition-all border border-transparent hover:border-red-100" title="Delete"><Trash2 class="w-4.5 lg:w-5 h-4.5 lg:h-5" /></button>
          <div class="w-px h-5 lg:h-6 bg-slate-200 mx-1"></div>
          <button @click="clearCanvas" class="px-2 lg:px-4 py-1 lg:py-2 text-[9px] lg:text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest">Reset</button>
        </div>

        <!-- Canvas Wrapper for scaling -->
        <div class="relative bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden border border-slate-200 origin-center transition-transform duration-300 canvas-container">
          <canvas ref="canvasEl"></canvas>
        </div>

        <!-- Canvas Controls (Bottom Right on Desktop, Bottom Left on Mobile) -->
        <div class="absolute bottom-6 left-6 md:left-auto md:right-8 lg:bottom-10 lg:right-10 flex md:flex-col bg-white border border-slate-200 rounded-xl lg:rounded-2xl shadow-2xl overflow-hidden z-30">
          <button class="p-3 lg:p-3.5 hover:bg-slate-50 text-slate-400 hover:text-[#3b4a8b] transition-all"><ZoomIn class="w-5 h-5" /></button>
          <button class="p-3 lg:p-3.5 hover:bg-slate-50 text-slate-400 hover:text-[#3b4a8b] transition-all border-l md:border-l-0 md:border-t border-slate-100"><ZoomOut class="w-5 h-5" /></button>
          <button @click="resizeCanvas" class="p-3 lg:p-3.5 hover:bg-slate-50 text-slate-400 hover:text-[#3b4a8b] border-l md:border-l-0 md:border-t border-slate-100 transition-all"><Maximize class="w-4.5 h-4.5" /></button>
        </div>

        <!-- Mobile Hint -->
        <div class="absolute bottom-6 right-6 md:hidden p-3 bg-white/80 rounded-full border border-slate-200 shadow-lg text-[#3b4a8b] animate-bounce">
           <Library class="w-5 h-5" @click="togglePanel('libs')" />
        </div>
      </section>
    </main>

    <VisualPreview 
      :show="showPreview" 
      :image-url="previewImage" 
      @close="showPreview = false" 
    />
  </div>
</template>

<style scoped>
.canvas-container {
  will-change: transform;
}
/* Ensure fabric canvas handles don't cause scroll */
:deep(.canvas-container) {
  margin: 0 !important;
}
</style>
