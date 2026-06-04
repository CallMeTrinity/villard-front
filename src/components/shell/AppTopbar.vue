<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  sub?: string
}>()
</script>

<template>
  <header class="topbar">
    <div class="topbar-titles">
      <div v-if="eyebrow" class="eyebrow">{{ eyebrow }}</div>
      <h1>{{ title }}</h1>
    </div>
    <div
      v-if="sub"
      class="topbar-sub"
      style="align-self: flex-end; padding-bottom: 3px"
    >
      {{ sub }}
    </div>
    <div class="topbar-actions">
      <slot />
    </div>
  </header>
</template>
