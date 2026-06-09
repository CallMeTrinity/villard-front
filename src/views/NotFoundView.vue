<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppTopbar from '@/components/shell/AppTopbar.vue'
import Icon from '@/components/icons/Icon.vue'

const router = useRouter()
</script>

<template>
  <AppTopbar eyebrow="Erreur" title="Page introuvable" />

  <div class="content">
    <div class="content-inner view">
      <div class="not-found card">
        <Icon name="search" :size="36" class="muted-icon" />
        <p class="code">404</p>
        <p class="muted">Cette page n'existe pas.</p>
        <button class="btn primary" @click="router.push('/')">Retour à l'accueil</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 64px 48px;
  text-align: center;
}
.code {
  font-family: var(--serif);
  font-size: 52px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
  margin: 0;
}
.muted-icon { color: var(--ink-3); }
</style>
