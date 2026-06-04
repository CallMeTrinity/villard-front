<script setup lang="ts">
import { ICONS } from '@/icons'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
  }>(),
  { size: 18 },
)
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    aria-hidden="true"
    v-html="ICONS[props.name] || ''"
  />
</template>
