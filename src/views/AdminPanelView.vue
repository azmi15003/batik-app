<script setup lang="ts">
import { ref } from 'vue'
import { 
  Package, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Menu,
  X,
} from 'lucide-vue-next'

const activeTab = ref('orders')
const isSidebarOpen = ref(false)

const orders = [
  { id: 'ORD-001', user: 'Azmi Farras', design: 'Batik Parang', total: 'Rp 315.000', status: 'Pending' },
  { id: 'ORD-002', user: 'Budi Santoso', design: 'Kawung Klasik', total: 'Rp 150.000', status: 'Processing' },
  { id: 'ORD-003', user: 'Siti Aminah', design: 'Truntum Biru', total: 'Rp 450.000', status: 'Shipped' },
]

const motifs = [
  { id: '1', name: 'Parang', usage: 124 },
  { id: '2', name: 'Truntum', usage: 89 },
  { id: '3', name: 'Kawung', usage: 210 },
]

const setActiveTab = (tab: string) => {
  activeTab.value = tab
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col lg:flex-row font-sans overflow-hidden">
    <!-- Admin Mobile Header -->
    <header class="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-[60]">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-[#3b4a8b] rounded-lg flex items-center justify-center text-white font-black">A</div>
        <span class="text-lg font-black tracking-tighter">Batik Admin</span>
      </div>
      <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 text-slate-500">
        <Menu v-if="!isSidebarOpen" class="w-6 h-6" />
        <X v-else class="w-6 h-6" />
      </button>
    </header>

    <!-- Admin Sidebar Drawer -->
    <aside 
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      class="fixed lg:relative inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm z-[70] transition-transform duration-300 ease-in-out"
    >
      <div class="h-16 hidden lg:flex items-center px-8 border-b border-slate-100 gap-3 shrink-0">
        <div class="w-8 h-8 bg-[#3b4a8b] rounded-lg flex items-center justify-center text-white font-black shadow-md">A</div>
        <span class="text-lg font-black text-slate-900 tracking-tighter">Batik Admin</span>
      </div>
      
      <nav class="flex-grow p-6 space-y-2">
        <button 
          @click="setActiveTab('orders')"
          :class="activeTab === 'orders' ? 'bg-[#3b4a8b]/10 text-[#3b4a8b] shadow-sm' : 'text-slate-500 hover:bg-slate-50'"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left"
        >
          <Package class="w-5 h-5" />
          Orders
        </button>
        <button 
          @click="setActiveTab('motifs')"
          :class="activeTab === 'motifs' ? 'bg-[#3b4a8b]/10 text-[#3b4a8b] shadow-sm' : 'text-slate-500 hover:bg-slate-50'"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left"
        >
          <ImageIcon class="w-5 h-5" />
          Manage Motifs
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 rounded-xl font-bold transition-all text-left">
          <Users class="w-5 h-5" />
          Users
        </button>
      </nav>
      
      <div class="p-6 border-t border-slate-100">
        <button class="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 rounded-xl font-bold transition-all text-left">
          <Settings class="w-5 h-5" />
          Settings
        </button>
      </div>
    </aside>

    <!-- Sidebar Overlay -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden"></div>

    <!-- Admin Main Content -->
    <main class="flex-grow flex flex-col overflow-hidden w-full">
      <header class="h-16 lg:h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 shrink-0">
        <h2 class="text-lg lg:text-xl font-black text-slate-900 capitalize tracking-tight">{{ activeTab }}</h2>
        <div class="flex items-center gap-3 lg:gap-4">
          <div class="relative hidden sm:block">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search..." class="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 ring-[#3b4a8b]/20 w-48 lg:w-64 shadow-sm" />
          </div>
          <button class="flex items-center gap-2 px-4 lg:px-6 py-2 bg-[#3b4a8b] text-white rounded-xl hover:bg-[#2d3a6d] transition-all shadow-lg active:scale-95 text-[10px] lg:text-sm font-black whitespace-nowrap">
            <Plus class="w-4 h-4" />
            <span class="hidden xs:inline">Add New</span>
          </button>
        </div>
      </header>
      
      <div class="flex-grow overflow-y-auto p-6 lg:p-10">
        <!-- Orders View (Responsive Table to Cards) -->
        <div v-if="activeTab === 'orders'" class="space-y-4">
          <!-- Desktop Table -->
          <div class="hidden md:block bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100 bg-slate-50/50">
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#3b4a8b]">Order ID</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="order in orders" :key="order.id" class="hover:bg-slate-50 transition-colors group">
                  <td class="px-8 py-6 font-black text-slate-900 tracking-tight">{{ order.id }}</td>
                  <td class="px-8 py-6 font-bold text-slate-600">{{ order.user }}</td>
                  <td class="px-8 py-6 text-[#3b4a8b] font-black tracking-tight">{{ order.total }}</td>
                  <td class="px-8 py-6">
                    <span 
                      class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-sm shadow-inner"
                      :class="{
                        'bg-orange-50 text-orange-600 border border-orange-100': order.status === 'Pending',
                        'bg-blue-50 text-blue-600 border border-blue-100': order.status === 'Processing',
                        'bg-green-50 text-green-600 border border-green-100': order.status === 'Shipped',
                      }"
                    >
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-8 py-6 flex items-center justify-center gap-2">
                    <button class="p-2.5 bg-white hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-slate-200 shadow-sm"><Edit3 class="w-4 h-4" /></button>
                    <button class="p-2.5 bg-white hover:bg-red-50 rounded-xl text-slate-300 hover:text-red-500 transition-all border border-slate-200 shadow-sm"><Trash2 class="w-4 h-4" /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div class="md:hidden space-y-4">
            <div 
              v-for="order in orders" 
              :key="order.id"
              class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-[#3b4a8b]">{{ order.id }}</span>
                <span 
                  class="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest"
                  :class="{
                    'bg-orange-50 text-orange-600': order.status === 'Pending',
                    'bg-blue-50 text-blue-600': order.status === 'Processing',
                    'bg-green-50 text-green-600': order.status === 'Shipped',
                  }"
                >
                  {{ order.status }}
                </span>
              </div>
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                <p class="font-bold text-slate-900">{{ order.user }}</p>
              </div>
              <div class="flex items-center justify-between pt-4 border-t border-slate-50">
                <div>
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                  <p class="font-black text-[#3b4a8b]">{{ order.total }}</p>
                </div>
                <div class="flex gap-2">
                  <button class="p-2.5 bg-slate-50 rounded-xl text-slate-400"><Edit3 class="w-4 h-4" /></button>
                  <button class="p-2.5 bg-red-50 rounded-xl text-red-400"><Trash2 class="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Motifs Grid -->
        <div v-if="activeTab === 'motifs'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          <div 
            v-for="motif in motifs" 
            :key="motif.id"
            class="bg-white border border-slate-200 rounded-[32px] p-6 lg:p-8 group hover:border-[#3b4a8b]/40 transition-all shadow-xl flex flex-col hover:-translate-y-1"
          >
            <div class="aspect-square bg-slate-50 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform shadow-inner border border-slate-100">
               <div class="w-16 h-16 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center text-slate-300 font-black text-2xl uppercase select-none">{{ motif.name[0] }}</div>
            </div>
            <h4 class="font-black text-slate-900 mb-1 tracking-tight">{{ motif.name }} Motif</h4>
            <p class="text-[10px] font-black text-[#c5a47e] uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">{{ motif.usage }} designs created</p>
            <div class="flex items-center gap-3 mt-auto pt-2">
              <button class="flex-grow py-3 bg-white hover:bg-slate-50 rounded-xl text-[10px] font-black tracking-[0.1em] transition-all text-slate-500 uppercase border border-slate-200 shadow-sm">Edit</button>
              <button class="p-3 bg-white hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-xl transition-all border border-slate-200 shadow-sm"><Trash2 class="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
