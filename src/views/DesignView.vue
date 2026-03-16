<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { Canvas, loadSVGFromURL, util, FabricImage, filters } from 'fabric'
import { useRouter } from 'vue-router'
import { useDesignStore } from '../stores/designStore'
import VisualPreview from '../components/VisualPreview.vue'
import TechnicalRuler from '../components/TechnicalRuler.vue'
import { 
  Trash2, RotateCw, RotateCcw, 
  X,
  Maximize,
  Home, Palette as PaletteIcon, Layout, Library,
  Settings2, Move, Info,
  Eraser, Minus, Plus,
  Menu as MenuIcon, ChevronRight
} from 'lucide-vue-next'

const designStore = useDesignStore()
const router = useRouter()
const canvasEl = ref<HTMLCanvasElement | null>(null)
const canvasContainer = ref<HTMLElement | null>(null)
let fabricCanvas: Canvas | null = null

// Active Object Properties
const activeProps = ref({
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  opacity: 1
})
const hasActiveObject = ref(false)

const showPreview = ref(false)
const previewImage = ref('')
const activePanel = ref('libs')
const colorMode = ref('motif')
const isMobileMenuOpen = ref(false)

const handlePreview = () => {
  if (fabricCanvas) {
    previewImage.value = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 3
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

    fabricCanvas.on('selection:created', (e) => updateActiveProps(e.selected[0]))
    fabricCanvas.on('selection:updated', (e) => updateActiveProps(e.selected[0]))
    fabricCanvas.on('selection:cleared', () => hasActiveObject.value = false)
    fabricCanvas.on('object:moving', (e) => updateActiveProps(e.target))
    fabricCanvas.on('object:scaling', (e) => updateActiveProps(e.target))
    fabricCanvas.on('object:rotating', (e) => updateActiveProps(e.target))

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

const updateActiveProps = (obj: any) => {
  if (!obj) return
  hasActiveObject.value = true
  activeProps.value = {
    x: Math.round(obj.left),
    y: Math.round(obj.top),
    scale: Number(obj.scaleX.toFixed(2)),
    rotation: Math.round(obj.angle),
    opacity: Number(obj.opacity.toFixed(2))
  }
}

const setObjProp = (prop: string, value: number) => {
  if (!fabricCanvas) return
  const obj = fabricCanvas.getActiveObject()
  if (!obj) return
  
  if (prop === 'x') obj.set('left', value)
  if (prop === 'y') obj.set('top', value)
  if (prop === 'rotation') obj.rotate(value)
  if (prop === 'scale') {
    obj.set('scaleX', value)
    obj.set('scaleY', value)
  }
  if (prop === 'opacity') obj.set('opacity', value)
  
  fabricCanvas.renderAll()
  updateActiveProps(obj)
}

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

const addMotif = async (motif: any) => {
  if (!fabricCanvas) return

  try {
    let obj: any
    if (motif.url.toLowerCase().endsWith('.svg')) {
      const { objects, options } = await loadSVGFromURL(motif.url)
      const validObjects = objects.filter((o): o is any => o !== null)
      obj = util.groupSVGElements(validObjects, options)
    } else {
      obj = await FabricImage.fromURL(motif.url)
      
      // Intelligent scaling based on category
      if (motif.category === 'pattern') {
        obj.scaleToWidth(fabricCanvas.width!)
      } else if (motif.category === 'heritage') {
        obj.scaleToWidth(250) // Components are smaller
      } else {
        obj.scaleToWidth(150) // Units are smallest
      }
    }
    
    obj.set({
      left: fabricCanvas.width! / 2,
      top: fabricCanvas.height! / 2,
      originX: 'center',
      originY: 'center',
      borderColor: '#3b4a8b',
      cornerColor: '#3b4a8b',
      cornerStyle: 'circle',
      transparentCorners: false,
      padding: 10
    })
    
    fabricCanvas.add(obj)
    fabricCanvas.setActiveObject(obj)
    fabricCanvas.renderAll()
    if (window.innerWidth < 1024) activePanel.value = ''
  } catch (err) {
    console.error('Error loading motif:', err)
  }
}

const getCategoryTitle = (cat: string) => {
  switch(cat) {
    case 'heritage': return 'Heritage Components'
    case 'pattern': return 'Full Patterns'
    case 'unit': return 'Classic Units'
    default: return 'Other Assets'
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
          <button @click="clearCanvas" class="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all border-r border-slate-200" title="Clear Canvas"><Eraser class="w-4 h-4" /></button>
          <button class="p-2 hover:bg-white text-slate-400 hover:text-indigo-600 transition-all border-r border-slate-200" title="Zoom Out"><Minus class="w-4 h-4" /></button>
          <button class="p-2 hover:bg-white text-slate-400 hover:text-indigo-600 transition-all border-r border-slate-200" title="Zoom In"><Plus class="w-4 h-4" /></button>
          <button class="p-2 hover:bg-white text-slate-400 hover:text-indigo-600 transition-all border-r border-slate-200" title="Reset Zoom"><Maximize class="w-4 h-4" /></button>
          <button class="p-2 hover:bg-white text-slate-400 hover:text-slate-600 transition-all border-r border-slate-200" title="Undo"><RotateCcw class="w-4 h-4" /></button>
          <button class="p-2 hover:bg-white text-slate-400 hover:text-slate-600 transition-all" title="Redo"><RotateCw class="w-4 h-4" /></button>
        </div>
        
        <button @click="handlePreview" class="px-4 lg:px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] lg:text-xs font-black transition-all shadow-lg active:scale-95 uppercase tracking-widest flex items-center gap-2">
          <span>Make it Real</span>
          <Maximize class="w-3.5 h-3.5" />
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
      <!-- Side Panels: Heritage Libs -->
      <transition 
        enter-active-class="transition ease-out duration-300 transform"
        enter-from-class="-translate-x-full lg:opacity-0"
        enter-to-class="translate-x-0 lg:opacity-100"
        leave-active-class="transition ease-in duration-200 transform"
        leave-from-class="translate-x-0 lg:opacity-100"
        leave-to-class="-translate-x-full lg:opacity-0"
      >
        <aside v-if="activePanel !== ''" class="fixed lg:relative inset-y-0 left-0 w-full lg:w-[380px] z-[70] lg:z-40 p-0 lg:p-4 bg-white lg:bg-transparent">
          <div class="bg-white/95 backdrop-blur-xl h-full flex flex-col overflow-hidden lg:rounded-3xl lg:border lg:border-slate-200 shadow-2xl lg:shadow-none">
            <!-- Motif Library Panel -->
            <div v-if="activePanel === 'libs'" class="flex flex-col h-full overflow-hidden">
               <div class="p-6 lg:p-8 pb-4 flex items-center justify-between shrink-0 border-b border-slate-100/50">
                  <div>
                    <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest">Motif Library</h3>
                    <p class="text-[8px] font-bold text-[#c5a47e] uppercase tracking-[0.2em] mt-1">Heritage Assets</p>
                  </div>
                  <button @click="activePanel = ''" class="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><X class="w-5 h-5" /></button>
               </div>
               <div class="flex-grow overflow-y-auto p-6 lg:p-8 pt-4 space-y-6">
                <div v-for="category in ['heritage', 'unit', 'pattern']" :key="category" class="space-y-4">
                  <div class="flex items-center gap-2">
                    <span class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{{ getCategoryTitle(category) }}</span>
                    <div class="flex-grow h-px bg-slate-100"></div>
                  </div>
                  <div class="grid grid-cols-2 gap-3 pb-2">
                    <div 
                      v-for="motif in designStore.motifs.filter(m => m.category === category)" 
                      :key="motif.id"
                      @click="addMotif(motif)"
                      class="aspect-square bg-slate-50 border border-slate-100 p-4 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-indigo-600/30 hover:bg-white hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div class="w-12 h-12 flex items-center justify-center">
                        <img :src="motif.url" class="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-100" />
                      </div>
                      <span class="text-[7px] font-black uppercase text-center tracking-widest text-slate-400 group-hover:text-slate-900 truncate w-full px-1">{{ motif.name }}</span>
                    </div>
                  </div>
                </div>
               </div>
            </div>
            <!-- Color Panel -->
            <div v-if="activePanel === 'color'" class="flex flex-col h-full overflow-hidden">
               <div class="p-6 lg:p-8 pb-4 shrink-0 flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest">Color Catalogue</h3>
                    <div class="flex items-center gap-1 mt-4 bg-slate-50 p-1 rounded-xl border border-slate-200">
                      <button @click="colorMode = 'motif'" :class="colorMode === 'motif' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'" class="px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all">Motif</button>
                      <button @click="colorMode = 'latar'" :class="colorMode === 'latar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'" class="px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all">Latar</button>
                    </div>
                  </div>
                  <button @click="activePanel = ''" class="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><X class="w-5 h-5" /></button>
               </div>
               
               <div class="flex-grow overflow-y-auto p-6 lg:p-8 pt-2 space-y-4">
                  <div 
                    v-for="palette in designStore.palettes" 
                    :key="palette.id"
                    @click="applyPalette(palette.colors)"
                    class="bg-slate-50 hover:bg-white border border-slate-100 p-4 rounded-2xl flex gap-4 cursor-pointer group transition-all"
                  >
                    <div class="flex shrink-0 shadow-sm rounded-lg overflow-hidden border border-white">
                       <div v-for="(color, i) in palette.colors" :key="i" class="w-6 h-10 group-hover:scale-110 transition-transform" :style="{ backgroundColor: color }"></div>
                    </div>
                    <div class="flex flex-col justify-center">
                      <h4 class="text-[10px] font-black text-slate-900 group-hover:text-indigo-600">{{ palette.name }}</h4>
                      <p class="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{{ palette.description }}</p>
                    </div>
                  </div>
               </div>

               <div class="p-6 lg:p-8 bg-slate-50 border-t border-slate-100">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4">Recent Colors</span>
                  <div class="flex flex-wrap gap-2">
                    <div 
                      v-for="color in designStore.colorHistory" 
                      :key="color"
                      @click="applyPalette([color])"
                      class="w-8 h-8 rounded-xl border border-white cursor-pointer hover:scale-110 transition-all"
                      :style="{ backgroundColor: color }"
                    ></div>
                  </div>
               </div>
            </div>

            <!-- Layout Panel -->
            <div v-if="activePanel === 'layout'" class="flex flex-col h-full overflow-hidden">
               <div class="p-6 lg:p-8 pb-4 shrink-0 flex items-center justify-between">
                  <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest">Canvas Scale</h3>
                  <button @click="activePanel = ''" class="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><X class="w-5 h-5" /></button>
               </div>
               <div class="flex-grow overflow-y-auto p-6 lg:p-8 pt-2 space-y-3">
                  <button 
                    v-for="size in canvasSizes" :key="size.name"
                    @click="selectedSize = size"
                    :class="selectedSize.name === size.name ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-slate-50 text-slate-400'"
                    class="w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left"
                  >
                    <div>
                      <p class="text-[11px] font-black">{{ size.name }}</p>
                      <p class="text-[8px] font-bold opacity-60 uppercase mt-0.5">{{ size.width }}x{{ size.height }} PX</p>
                    </div>
                    <div v-if="selectedSize.name === size.name" class="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  </button>
               </div>
            </div>
          </div>
        </aside>
      </transition>

      <!-- Main Pro Workspace -->
      <section class="flex-grow flex flex-col relative overflow-hidden bg-slate-100">
        <!-- Rulers Layout Wrapper -->
        <div class="flex-grow flex flex-col">
          <!-- Horizontal Ruler -->
          <div class="flex shrink-0">
            <div class="w-6 h-6 bg-slate-50 border-r border-b border-slate-200 shrink-0 flex items-center justify-center"><div class="w-1 h-1 rounded-full bg-slate-300"></div></div>
            <TechnicalRuler 
              orientation="horizontal" 
              :size="selectedSize.width" 
              :scale="1" 
              class="flex-grow"
            />
          </div>
          
          <div class="flex flex-grow relative overflow-hidden">
            <!-- Vertical Ruler -->
            <TechnicalRuler 
              orientation="vertical" 
              :size="selectedSize.height" 
              :scale="1" 
              class="shrink-0"
            />
            
            <!-- Technical Canvas Area -->
            <div ref="canvasContainer" class="flex-grow flex items-center justify-center p-12 bg-slate-200/50 relative overflow-hidden">
              <div class="absolute inset-0 opacity-[0.05]" style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 40px 40px;"></div>
              
              <!-- Canvas Wrapper -->
              <div class="relative bg-white shadow-2xl rounded-sm ring-1 ring-slate-300 overflow-hidden canvas-container transition-transform">
                <canvas ref="canvasEl"></canvas>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Property Sheet (Pro Sidebar Right) -->
      <aside class="hidden xl:flex w-[300px] bg-white border-l border-slate-200 flex-col shadow-inner">
        <div class="p-6 border-b border-slate-100 bg-slate-50/50">
           <div class="flex items-center gap-2 mb-1">
             <Settings2 class="w-4 h-4 text-indigo-600" />
             <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Property Sheet</h3>
           </div>
           <p class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Instance Inspector</p>
        </div>
        
        <div class="flex-grow overflow-y-auto">
          <!-- Selection Details -->
          <div v-if="hasActiveObject" class="p-6 space-y-6">
            <!-- Transform Section -->
            <div class="space-y-4">
               <div class="flex items-center gap-2">
                 <div class="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                 <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Transform</span>
               </div>
               <div class="grid grid-cols-2 gap-3">
                 <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span class="block text-[8px] font-black text-slate-400 mb-1">X POS</span>
                    <input type="number" v-model="activeProps.x" @input="setObjProp('x', activeProps.x)" class="bg-transparent text-xs font-black w-full outline-none" />
                 </div>
                 <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span class="block text-[8px] font-black text-slate-400 mb-1">Y POS</span>
                    <input type="number" v-model="activeProps.y" @input="setObjProp('y', activeProps.y)" class="bg-transparent text-xs font-black w-full outline-none" />
                 </div>
                 <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span class="block text-[8px] font-black text-slate-400 mb-1">SCALE</span>
                    <input type="number" step="0.1" v-model="activeProps.scale" @input="setObjProp('scale', activeProps.scale)" class="bg-transparent text-xs font-black w-full outline-none" />
                 </div>
                 <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span class="block text-[8px] font-black text-slate-400 mb-1">ROTATE</span>
                    <input type="number" v-model="activeProps.rotation" @input="setObjProp('rotation', activeProps.rotation)" class="bg-transparent text-xs font-black w-full outline-none" />
                 </div>
               </div>
            </div>

            <!-- Appearance Section -->
            <div class="space-y-4">
               <div class="flex items-center gap-2">
                 <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                 <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Appearance</span>
               </div>
               <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <div class="flex items-center justify-between mb-4">
                    <span class="text-[8px] font-black text-slate-400">OPACITY</span>
                    <span class="text-[10px] font-black text-indigo-600">{{ Math.round(activeProps.opacity * 100) }}%</span>
                 </div>
                 <input type="range" min="0" max="1" step="0.1" v-model="activeProps.opacity" @input="setObjProp('opacity', activeProps.opacity)" class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
               </div>
            </div>

            <!-- Actions -->
            <div class="grid grid-cols-2 gap-2 pt-4">
              <button @click="rotateSelected" class="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-all border border-slate-100">
                <RotateCw class="w-5 h-5 mb-2" />
                <span class="text-[8px] font-black uppercase">Rotate 90</span>
              </button>
              <button @click="deleteSelected" class="flex flex-col items-center justify-center p-4 bg-red-50 rounded-2xl hover:bg-red-100 text-red-400 transition-all border border-red-100">
                <Trash2 class="w-5 h-5 mb-2" />
                <span class="text-[8px] font-black uppercase tracking-widest">Delete</span>
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="h-full flex flex-col items-center justify-center p-8 text-center opacity-40">
             <div class="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 border border-slate-200">
               <Move class="w-8 h-8 text-slate-400" />
             </div>
             <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">No Element Selected</p>
             <p class="text-[9px] font-bold text-slate-400 mt-2">Select an object to edit its properties</p>
          </div>
        </div>

        <!-- Global Stats Footer -->
        <div class="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
           <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
              <span>Canvas Status</span>
              <span class="text-emerald-500 flex items-center gap-1"><div class="w-1 h-1 rounded-full bg-emerald-500"></div> Optimized</span>
           </div>
           <div class="bg-indigo-600 text-white p-3 rounded-xl flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Info class="w-3 h-3" />
                <span class="text-[8px] font-black uppercase tracking-widest">Auto-saved</span>
              </div>
              <span class="text-[8px] font-black">12:30 PM</span>
           </div>
        </div>
      </aside>
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
