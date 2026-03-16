<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  orientation: 'horizontal' | 'vertical'
  size: number
  scale: number
  unitSize?: number // pixels per unit (e.g., 20px = 1cm)
}>()

const unitSize = props.unitSize || 40 // Default 40px = 1 unit

const ticks = computed(() => {
  const result = []
  const step = unitSize 
  const totalUnits = Math.ceil(props.size / (step * props.scale))
  
  for (let i = 0; i <= totalUnits; i++) {
    // Large tick (1 unit)
    result.push({
      pos: i * step * props.scale,
      label: i,
      type: 'major'
    })
    
    // Medium tick (0.5 unit)
    if (i < totalUnits) {
       result.push({
        pos: (i + 0.5) * step * props.scale,
        label: null,
        type: 'minor'
      })
    }
  }
  return result
})
</script>

<template>
  <div 
    class="ruler bg-slate-50 border-slate-200 select-none overflow-hidden"
    :class="orientation === 'horizontal' ? 'h-6 w-full border-b' : 'w-6 h-full border-r'"
  >
    <div class="relative w-full h-full">
      <div 
        v-for="(tick, idx) in ticks" 
        :key="idx"
        class="absolute bg-slate-300 transition-all duration-200"
        :class="[
          orientation === 'horizontal' ? 'bottom-0 w-px' : 'right-0 h-px',
          tick.type === 'major' ? (orientation === 'horizontal' ? 'h-3' : 'w-3') : (orientation === 'horizontal' ? 'h-1.5' : 'w-1.5')
        ]"
        :style="orientation === 'horizontal' ? { left: `${tick.pos}px` } : { top: `${tick.pos}px` }"
      >
      </div>
    </div>
  </div>
</template>

<style scoped>
.ruler {
  z-index: 20;
}
</style>
