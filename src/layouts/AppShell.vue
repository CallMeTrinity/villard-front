<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTweaksStore } from '@/stores/tweaks'
import { useUi } from '@/composable/useUi'
import AppSidebar from '@/components/shell/AppSidebar.vue'
import MobileBanner from '@/components/shell/MobileBanner.vue'

const tweaks = useTweaksStore()
const { grain } = storeToRefs(tweaks)
const { sidebarOpen, closeSidebar, showMobileBanner } = useUi()
</script>

<template>
  <div class="app-root" :class="{ grain, 'sidebar-open': sidebarOpen }">
    <MobileBanner v-if="showMobileBanner" />
    <div class="app-body">
      <AppSidebar />
      <div
        v-if="sidebarOpen"
        class="sidebar-scrim"
        aria-hidden="true"
        @click="closeSidebar"
      />
      <main class="main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-body {
  display: flex;
  flex: 1;
  min-height: 0;
  position: relative;
}
.sidebar-scrim {
  position: fixed;
  inset: 0;
  background: rgba(22, 34, 26, 0.42);
  backdrop-filter: blur(2px);
  z-index: 90;
  animation: scrimFade 0.18s ease;
}
@keyframes scrimFade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@media (min-width: 768px) {
  .sidebar-scrim {
    display: none;
  }
}
</style>
