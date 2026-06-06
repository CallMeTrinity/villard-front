<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Icon from '@/components/icons/Icon.vue'
import Stepper from '@/components/inventory/Stepper.vue'
import type { InventoryItem, InvState } from '@/api/inventory'
import type { DisplayCategory } from '@/composable/useCategories'
import { STATE_META } from '@/utils/inventoryState'

export type ModalInitial =
  | { mode: 'create'; defaultCategory?: string }
  | { mode: 'edit'; item: InventoryItem }

const props = defineProps<{
  open: boolean
  initial: ModalInitial | null
  categories: DisplayCategory[]
  canDelete: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [payload: {
    id: number | null
    name: string
    quantity: number
    state: InvState
    location: string | null
    note: string | null
    category: string
  }]
  remove: [id: number]
}>()

const name = ref('')
const quantity = ref(0)
const state = ref<InvState>('ok')
const location = ref('')
const note = ref('')
const category = ref<string>('')
const errorMessage = ref<string | null>(null)
const saving = ref(false)

const isEditing = computed(() => props.initial?.mode === 'edit')
const editingId = computed(() =>
  props.initial?.mode === 'edit' ? props.initial.item.id : null,
)

const STATES: InvState[] = ['ok', 'worn', 'replace']

watch(() => props.open, (open) => {
  if (!open) return
  errorMessage.value = null
  saving.value = false
  const init = props.initial
  if (!init) return
  if (init.mode === 'edit') {
    const it = init.item
    name.value = it.name
    quantity.value = it.quantity
    state.value = it.state
    location.value = it.location ?? ''
    note.value = it.note ?? ''
    category.value = it.category
  } else {
    name.value = ''
    quantity.value = 1
    state.value = 'ok'
    location.value = ''
    note.value = ''
    category.value = init.defaultCategory ?? props.categories[0]?.['@id'] ?? ''
  }
}, { immediate: true })

function onSave() {
  errorMessage.value = null
  if (!name.value.trim()) {
    errorMessage.value = 'Renseigne un nom.'
    return
  }
  if (!category.value) {
    errorMessage.value = 'Choisis une catégorie.'
    return
  }
  if (quantity.value < 0) {
    errorMessage.value = 'La quantité doit être positive.'
    return
  }
  saving.value = true
  emit('save', {
    id: editingId.value,
    name: name.value.trim(),
    quantity: quantity.value,
    state: state.value,
    location: location.value.trim() || null,
    note: note.value.trim() || null,
    category: category.value,
  })
}

function onDelete() {
  if (editingId.value !== null) emit('remove', editingId.value)
}
</script>

<template>
  <div v-if="open" class="modal-scrim" @click="emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-head">
        <div>
          <div class="eyebrow">{{ isEditing ? "Modifier l'article" : 'Nouvel article' }}</div>
          <h2 class="modal-title">
            {{ isEditing ? name || 'Article' : 'Ajouter un article' }}
          </h2>
        </div>
        <button class="btn icon ghost" @click="emit('close')" aria-label="Fermer">
          <Icon name="x" :size="18" />
        </button>
      </div>

      <div class="modal-body">
        <label class="fld-label" for="m-name">Nom</label>
        <input
          id="m-name"
          class="fld"
          v-model="name"
          placeholder="Ex. Assiettes plates"
          autocomplete="off"
        />

        <label class="fld-label">Catégorie</label>
        <div class="chips">
          <button
            v-for="c in categories"
            :key="c['@id']"
            type="button"
            class="chip"
            :class="{ on: category === c['@id'] }"
            @click="category = c['@id']"
          >
            <Icon :name="c.icon" :size="14" />{{ c.name }}
          </button>
        </div>

        <div class="fld-grid two">
          <div>
            <label class="fld-label">Quantité</label>
            <Stepper
              :model-value="quantity"
              :min="0"
              size="md"
              aria-label="Quantité"
              @update:model-value="quantity = $event"
            />
          </div>
          <div>
            <label class="fld-label">État</label>
            <div class="seg state-seg">
              <button
                v-for="s in STATES"
                :key="s"
                type="button"
                :class="{ on: state === s }"
                @click="state = s"
              >
                <span class="dot" :style="{ background: `var(--${s})` }" />
                {{ STATE_META[s].label }}
              </button>
            </div>
          </div>
        </div>

        <label class="fld-label" for="m-location">
          Emplacement <span class="muted optional">· optionnel</span>
        </label>
        <input
          id="m-location"
          class="fld"
          v-model="location"
          placeholder="Ex. Placard couloir, Cabane skis…"
          autocomplete="off"
        />

        <label class="fld-label" for="m-note">
          Note <span class="muted optional">· optionnel</span>
        </label>
        <textarea
          id="m-note"
          class="fld"
          rows="2"
          v-model="note"
          placeholder="Détails, défauts, références…"
        />

        <div v-if="errorMessage" class="modal-err">
          <Icon name="alert" :size="15" />
          {{ errorMessage }}
        </div>
      </div>

      <div class="modal-foot">
        <button
          v-if="isEditing && canDelete"
          class="btn ghost danger"
          @click="onDelete"
        >
          <Icon name="trash" :size="16" />
          Supprimer
        </button>
        <button class="btn" @click="emit('close')" :disabled="saving">Annuler</button>
        <button class="btn primary" @click="onSave" :disabled="saving">
          <Icon name="check" :size="16" />
          {{ saving ? 'Enregistrement…' : (isEditing ? 'Enregistrer' : 'Ajouter') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-title {
  font-size: 21px;
  margin-top: 4px;
}
.fld-grid.two {
  grid-template-columns: 1fr 1fr;
  align-items: start;
}
.state-seg {
  width: 100%;
}
.state-seg button {
  flex: 1;
  justify-content: center;
}
.state-seg .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.optional {
  font-weight: 400;
}
.danger {
  color: var(--replace);
  margin-right: auto;
}
.danger:hover {
  background: var(--replace-bg);
}
</style>
