<script setup lang="ts">
import { computed, ref } from 'vue'
import AppTopbar from '@/components/shell/AppTopbar.vue'
import Icon from '@/components/icons/Icon.vue'
import InvRow from '@/components/inventory/InvRow.vue'
import {
  INVENTORY_MOCK,
  INV_CATS,
  type InvCategoryId,
  type InvItem,
  type InvState,
} from '@/data/inventoryMock'

type CatFilter = InvCategoryId | 'all'
type StateFilter = InvState | 'all'

const items = ref<InvItem[]>([...INVENTORY_MOCK])
const cat = ref<CatFilter>('all')
const state = ref<StateFilter>('all')
const query = ref('')

const counts = computed(() => ({
  total: items.value.reduce((s, i) => s + i.qty, 0),
  refs: items.value.length,
  ok: items.value.filter(i => i.state === 'ok').length,
  worn: items.value.filter(i => i.state === 'worn').length,
  replace: items.value.filter(i => i.state === 'replace').length,
}))

const filtered = computed<InvItem[]>(() => {
  const q = query.value.trim().toLowerCase()
  return items.value.filter(i =>
    (cat.value === 'all' || i.cat === cat.value) &&
    (state.value === 'all' || i.state === state.value) &&
    (q === '' || `${i.name} ${i.loc} ${i.note}`.toLowerCase().includes(q)),
  )
})

const visibleCats = computed(() =>
  cat.value === 'all' ? INV_CATS : INV_CATS.filter(c => c.id === cat.value),
)

function itemsOfCat(catId: InvCategoryId) {
  return filtered.value.filter(i => i.cat === catId)
}

const STATE_FILTERS: Array<[StateFilter, string]> = [
  ['all', 'Tous'],
  ['ok', 'Bon'],
  ['worn', 'Usé'],
  ['replace', 'À remplacer'],
]

function onPatch(id: string, patch: Partial<Pick<InvItem, 'state' | 'qty'>>) {
  items.value = items.value.map(i => (i.id === id ? { ...i, ...patch } : i))
}

function onNew() {
  // TODO logique — création d'article (mode guide)
}
</script>

<template>
  <AppTopbar eyebrow="Suivi d'inventaire" title="Inventaire">
    <div class="searchbox">
      <Icon name="search" :size="15" class="muted-icon" />
      <input
        v-model="query"
        type="search"
        placeholder="Rechercher un article, un lieu…"
        aria-label="Rechercher dans l'inventaire"
      />
    </div>
    <button class="btn primary" @click="onNew">
      <Icon name="plus" :size="16" />Ajouter
    </button>
  </AppTopbar>

  <div class="content">
    <div class="content-inner view">
      <section class="inv-summary" aria-label="Résumé de l'inventaire">
        <div class="sumcard">
          <span class="sum-k mono">ARTICLES</span>
          <span class="sum-v num">{{ counts.total }}</span>
          <span class="sum-s muted">{{ counts.refs }} références</span>
        </div>
        <div class="sumcard">
          <span class="sum-k mono ok-key">BON ÉTAT</span>
          <span class="sum-v num">{{ counts.ok }}</span>
          <span class="sum-s muted">références</span>
        </div>
        <div class="sumcard">
          <span class="sum-k mono worn-key">USÉ</span>
          <span class="sum-v num">{{ counts.worn }}</span>
          <span class="sum-s muted">à surveiller</span>
        </div>
        <div class="sumcard" :class="{ hot: counts.replace > 0 }">
          <span class="sum-k mono replace-key">À REMPLACER</span>
          <span class="sum-v num">{{ counts.replace }}</span>
          <span class="sum-s muted">
            {{ counts.replace > 0 ? 'action requise' : 'rien à signaler' }}
          </span>
        </div>
      </section>

      <div class="filt-bar">
        <div class="chips" role="tablist" aria-label="Filtrer par catégorie">
          <button
            class="chip"
            :class="{ on: cat === 'all' }"
            role="tab"
            :aria-selected="cat === 'all'"
            @click="cat = 'all'"
          >
            Tout
          </button>
          <button
            v-for="c in INV_CATS"
            :key="c.id"
            class="chip"
            :class="{ on: cat === c.id }"
            role="tab"
            :aria-selected="cat === c.id"
            @click="cat = c.id"
          >
            <Icon :name="c.icon" :size="14" />{{ c.label }}
          </button>
        </div>
        <div class="seg push-right" aria-label="Filtrer par état">
          <button
            v-for="[value, label] in STATE_FILTERS"
            :key="value"
            :class="{ on: state === value }"
            @click="state = value"
          >
            {{ label }}
          </button>
        </div>
      </div>

      <template v-for="c in visibleCats" :key="c.id">
        <section v-if="itemsOfCat(c.id).length" class="inv-cat">
          <header class="inv-cat-head">
            <Icon :name="c.icon" :size="17" />
            <h3>{{ c.label }}</h3>
            <span class="mono muted cat-count">
              {{ itemsOfCat(c.id).length }} réf.
            </span>
          </header>
          <div class="inv-cat-body card">
            <InvRow
              v-for="it in itemsOfCat(c.id)"
              :key="it.id"
              :item="it"
              @patch="onPatch"
            />
          </div>
        </section>
      </template>

      <div v-if="!filtered.length" class="empty">
        <Icon name="search" :size="26" class="muted-icon" />
        <p>Aucun article ne correspond.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.muted-icon {
  color: var(--ink-3);
}
.ok-key {
  color: var(--ok);
}
.worn-key {
  color: var(--worn);
}
.replace-key {
  color: var(--replace);
}
.push-right {
  margin-left: auto;
}
.cat-count {
  margin-left: auto;
  font-size: 11.5px;
}
</style>
