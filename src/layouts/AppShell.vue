<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTweaksStore } from '@/stores/tweaks'
import AppSidebar from '@/components/shell/AppSidebar.vue'

const tweaks = useTweaksStore()
const { grain } = storeToRefs(tweaks)
</script>

<template>
  <div class="app-root" :class="{ grain }">
    <AppSidebar />
    <main class="main">
      <slot />
    </main>
  </div>
</template>
