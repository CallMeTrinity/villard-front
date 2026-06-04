<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from '@/layouts/AppShell.vue'

const route = useRoute()
const bare = computed(() => Boolean(route.meta.bare))
</script>

<template>
  <AppShell v-if="!bare">
    <RouterView />
  </AppShell>
  <RouterView v-else />
</template>
