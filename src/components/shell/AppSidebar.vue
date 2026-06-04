<script setup lang="ts">
import Icon from '@/components/icons/Icon.vue'
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";

const router = useRouter()
const authStore = useAuthStore()

function onLogout() {
  authStore.logout()
  router.push({name: 'login'})
}
interface NavItem {
  to: string
  label: string
  ico: string
  badge?: number
  warn?: boolean
}

// Stub badges — wired to real data in block 3+.
const counts = { invReplace: 0, toBuy: 0 }

const gestion: NavItem[] = [
  { to: '/planning', label: 'Planning', ico: 'calendar' },
  { to: '/inventaire', label: 'Inventaire', ico: 'box', badge: counts.invReplace, warn: true },
  { to: '/courses', label: 'Courses', ico: 'cart', badge: counts.toBuy, warn: true },
]
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-mark">
        <div class="brand-glyph" style="color: #a9c9a0">
          <Icon name="leaf" :size="20" />
        </div>
        <div>
          <div class="brand-name">Les Marmottes</div>
          <div class="brand-sub">Villard-de-Lans</div>
        </div>
        <button @click="onLogout">Logout</button>
      </div>
    </div>

    <nav class="nav">
      <div class="nav-label">Gestion</div>
      <RouterLink
        v-for="item in gestion"
        :key="item.to"
        v-slot="{ navigate, isActive }"
        :to="item.to"
        custom
      >
        <button class="nav-item" :class="{ active: isActive }" @click="navigate">
          <Icon :name="item.ico" :size="18" class="nav-ico" />
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="badge" :class="{ warn: item.warn }">
            {{ item.badge }}
          </span>
        </button>
      </RouterLink>

      <div class="nav-label">Projet</div>
      <RouterLink v-slot="{ navigate, isActive }" to="/architecture" custom>
        <button class="nav-item" :class="{ active: isActive }" @click="navigate">
          <Icon name="server" :size="18" class="nav-ico" />
          <span>Architecture</span>
        </button>
      </RouterLink>
    </nav>

    <div class="side-foot">
      <div class="host-pill">
        <span class="host-dot" />
        <div class="host-text">
          <b>Auto-hébergé</b><br />
          home.lan · vos données
        </div>
      </div>
    </div>
  </aside>
</template>
