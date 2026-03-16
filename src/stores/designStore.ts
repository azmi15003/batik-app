import { defineStore } from 'pinia'

export interface Motif {
  id: string
  name: string
  url: string
  category: 'heritage' | 'pattern' | 'unit'
}

export interface Palette {
  id: string
  name: string
  colors: string[]
  description: string
}

export const useDesignStore = defineStore('design', {
  state: () => ({
    motifs: [
      // Heritage Components
      { id: 'h1', name: 'Garuda Sawat', url: '/motifs/components/garuda.png', category: 'heritage' },
      { id: 'h2', name: 'Mega Mendung', url: '/motifs/components/megamendung.png', category: 'heritage' },
      
      // Full Patterns
      { id: 'p1', name: 'Classical Megamendung', url: '/motifs/megamendung.png', category: 'pattern' },
      { id: 'p2', name: 'Garuda Tiled', url: '/motifs/garudan.png', category: 'pattern' },
      { id: 'p3', name: 'Geometric Abstract', url: '/motifs/geometric.png', category: 'pattern' },
      { id: 'p4', name: 'Fractal Modern', url: '/motifs/fractal.png', category: 'pattern' },
      
      // SVG Units
      { id: 'u1', name: 'Kawung Unit', url: '/motifs/kawung.svg', category: 'unit' },
      { id: 'u2', name: 'Parang Unit', url: '/motifs/parang.svg', category: 'unit' },
      { id: 'u3', name: 'Truntum Unit', url: '/motifs/truntum.svg', category: 'unit' },
    ] as Motif[],
    palettes: [
      { 
        id: 'p1', 
        name: 'Terracotta Earth', 
        colors: ['#a66864', '#d89c97'], 
        description: 'Warm earth tones' 
      },
      { 
        id: 'p2', 
        name: 'Royal Indigo', 
        colors: ['#8c7c56', '#2b3a8c'], 
        description: 'Ocean and sand' 
      },
      { 
        id: 'p3', 
        name: 'Deep Berry', 
        colors: ['#4b1a1a', '#a63c4c'], 
        description: 'Vibrant forest fruits' 
      },
    ] as Palette[],
    colorHistory: [] as string[],
    canvasSize: { width: 800, height: 800 },
    backgroundColor: '#ffffff',
    currentDesign: null as any,
  }),
  actions: {
    setCanvasSize(width: number, height: number) {
      this.canvasSize = { width, height }
    },
    setBackgroundColor(color: string) {
      this.backgroundColor = color
      this.addToHistory(color)
    },
    addToHistory(color: string) {
      if (!this.colorHistory.includes(color)) {
        this.colorHistory.unshift(color)
        if (this.colorHistory.length > 8) this.colorHistory.pop()
      }
    },
    clearHistory() {
      this.colorHistory = []
    }
  }
})
