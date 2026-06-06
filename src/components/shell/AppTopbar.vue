<script setup lang="ts">
import Icon from '@/components/icons/Icon.vue'
import { useUi } from '@/composable/useUi'

defineProps<{
  eyebrow?: string
  title: string
  sub?: string
}>()

const { toggleSidebar } = useUi()
</script>

<template>
  <header class="topbar">
    <button
      type="button"
      class="topbar-burger"
      aria-label="Ouvrir le menu"
      @click="toggleSidebar"
    >
      <Icon name="menu" :size="18" />
    </button>
    <div class="topbar-titles">
      <div v-if="eyebrow" class="eyebrow">{{ eyebrow }}</div>
      <h1>{{ title }}</h1>
    </div>
    <div
      v-if="sub"
      class="topbar-sub topbar-sub-inline"
    >
      {{ sub }}
    </div>
    <div class="topbar-actions">
      <slot />
    </div>
  </header>
</template>

<style scoped>
.topbar-burger {
  display: none;
  border: 1px solid var(--line-2);
  background: var(--card);
  color: var(--ink-2);
  width: 38px;
  height: 38px;
  border-radius: 10px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.14s, border-color 0.14s, color 0.14s;
}
.topbar-burger:hover {
  background: var(--card-2);
  border-color: var(--line-3);
  color: var(--ink);
}
.topbar-sub-inline {
  align-self: flex-end;
  padding-bottom: 3px;
}

@media (max-width: 767.98px) {
  .topbar-burger {
    display: inline-flex;
  }
  .topbar-sub-inline {
    display: none;
  }
}
</style>
