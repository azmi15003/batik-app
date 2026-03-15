import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: true,
  }),
  actions: {
    async fetchUser() {
      this.loading = true
      const { data } = await supabase.auth.getUser()
      this.user = data.user
      this.loading = false
    },
    async loginWithGoogle() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
    },
    async logout() {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      this.user = null
    }
  }
})
