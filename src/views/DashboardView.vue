<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import { 
  LogOut, 
  Plus, 
  Search, 
  Clock, 
  ChevronRight,
  Menu,
  X
} from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const isSidebarOpen = ref(false)

const designs = [
  { id: '1', name: 'Batik Parang Modern', date: '14 Mar 2026', status: 'Draft', preview: '/src/assets/motifs/parang.svg' },
  { id: '2', name: 'Truntum Biru', date: '12 Mar 2026', status: 'Ordered', preview: '/src/assets/motifs/truntum.svg' },
  { id: '3', name: 'Kawung Klasik', date: '10 Mar 2026', status: 'Completed', preview: '/src/assets/motifs/kawung.svg' },
]

onMounted(async () => {
  await authStore.fetchUser()
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fa] flex flex-col lg:flex-row text-slate-800">
    <!-- Mobile Header -->
    <header class="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
      <span class="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#3b4a8b] to-[#1a202c]">Batik</span>
      <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 text-slate-500">
        <Menu v-if="!isSidebarOpen" class="w-6 h-6" />
        <X v-else class="w-6 h-6" />
      </button>
    </header>

    <!-- Sidebar / Mobile Menu -->
    <aside 
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      class="fixed lg:relative inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-[60] transition-transform duration-300 ease-in-out lg:top-0"
    >
      <div class="h-16 hidden lg:flex items-center px-8 border-b border-slate-100">
        <span class="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#3b4a8b] to-[#1a202c]">Batik</span>
      </div>
      
      <nav class="flex-grow p-6 lg:p-8 space-y-2">
        <button class="w-full flex items-center gap-3 px-4 py-3 bg-[#3b4a8b]/10 text-[#3b4a8b] rounded-xl font-bold">
          <Clock class="w-5 h-5" />
          Dashboard
        </button>
        <button @click="router.push('/products')" class="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-semibold transition-colors">
          <Plus class="w-5 h-5" />
          Desain Baru
        </button>
      </nav>
      
      <div class="p-6 lg:p-8 border-t border-slate-100 bg-slate-50 lg:bg-transparent">
        <div v-if="authStore.user" class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-white lg:bg-slate-100 rounded-full flex items-center justify-center text-[#3b4a8b] font-black shadow-inner border border-slate-200">
            {{ authStore.user.email?.[0].toUpperCase() }}
          </div>
          <div class="overflow-hidden">
            <p class="text-sm font-bold text-slate-900 truncate">{{ authStore.user.user_metadata.full_name || 'User' }}</p>
            <p class="text-[10px] text-slate-500 truncate">{{ authStore.user.email }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors">
          <LogOut class="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Overlay -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden"></div>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col overflow-hidden w-full">
      <header class="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 shrink-0">
        <h2 class="text-lg lg:text-xl font-black text-slate-900">My Designs</h2>
        <div class="flex items-center gap-4">
          <div class="relative hidden sm:block">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Cari..." class="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 ring-[#3b4a8b]/20 w-48 lg:w-64 transition-all" />
          </div>
          <button @click="router.push('/products')" class="p-2 sm:hidden text-[#3b4a8b] bg-[#3b4a8b]/10 rounded-xl">
             <Plus class="w-5 h-5" />
          </button>
        </div>
      </header>
      
      <div class="flex-grow overflow-y-auto p-6 lg:p-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
          <div 
            @click="router.push('/products')"
            class="group bg-white rounded-3xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-[#3b4a8b]/40 hover:bg-[#3b4a8b]/5 transition-all cursor-pointer shadow-sm"
          >
            <div class="w-14 h-14 lg:w-16 h-16 bg-slate-50 text-[#3b4a8b] rounded-full flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-90 shadow-sm border border-slate-100">
              <Plus class="w-7 h-7 lg:w-8 h-8" />
            </div>
            <div>
              <p class="font-black text-slate-900">Mulai Desain Baru</p>
              <p class="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">Create from scratch</p>
            </div>
          </div>
          
          <div 
            v-for="design in designs" 
            :key="design.id"
            class="group bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden hover:border-[#3b4a8b]/30 transition-all hover:-translate-y-1"
          >
            <div class="aspect-[16/10] sm:aspect-[4/3] bg-slate-50 p-6 flex items-center justify-center relative overflow-hidden border-b border-slate-100">
              <img :src="design.preview" class="w-20 h-20 lg:w-24 lg:h-24 group-hover:scale-125 transition-transform duration-500 opacity-60 group-hover:opacity-100" />
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur border border-slate-100 px-3 py-1 rounded-full text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-[#3b4a8b] shadow-sm">
                {{ design.status }}
              </div>
            </div>
            <div class="p-5 lg:p-6">
              <div class="flex items-center justify-between mb-1 lg:mb-2">
                <h4 class="font-black text-sm lg:text-base text-slate-900 truncate pr-4">{{ design.name }}</h4>
                <ChevronRight class="w-4 h-4 text-slate-300" />
              </div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{{ design.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
