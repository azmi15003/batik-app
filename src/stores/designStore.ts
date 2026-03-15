import { defineStore } from 'pinia'

export interface Motif {
  id: string
  name: string
  url: string
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
      { id: '1', name: 'Megamendung', url: '/src/assets/motifs/megamendung.png' },
      { id: '2', name: 'Garudan', url: '/src/assets/motifs/garudan.png' },
      { id: '3', name: 'Geometric', url: '/src/assets/motifs/geometric.png' },
      { id: '4', name: 'Fractal', url: '/src/assets/motifs/fractal.png' },
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
