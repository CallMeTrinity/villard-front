<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Icon from '@/components/icons/Icon.vue'
import Stepper from '@/components/inventory/Stepper.vue'
import type { ShoppingItem } from '@/api/shopping'
import type { DisplayCategory } from '@/composable/useCategories'

export type ModalInitial =
  | { mode: 'create'; defaultCategory?: string }
  | { mode: 'edit'; item: ShoppingItem }

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
    purchased: boolean
    category: string
  }]
  remove: [id: number]
}>()

const name = ref('')
const quantity = ref(1)
const purchased = ref(false)
const category = ref<string>('')
const errorMessage = ref<string | null>(null)
const saving = ref(false)

const isEditing = computed(() => props.initial?.mode === 'edit')
const editingId = computed(() =>
  props.initial?.mode === 'edit' ? props.initial.item.id : null,
)

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
    purchased.value = it.purchased
    category.value = it.category
  } else {
    name.value = ''
    quantity.value = 1
    purchased.value = false
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
  if (quantity.value < 1) {
    errorMessage.value = 'La quantité doit être au moins 1.'
    return
  }
  saving.value = true
  emit('save', {
    id: editingId.value,
    name: name.value.trim(),
    quantity: quantity.value,
    purchased: purchased.value,
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
            {{ isEditing ? name || 'Article' : 'Ajouter aux courses' }}
          </h2>
        </div>
        <button class="btn icon ghost" @click="emit('close')" aria-label="Fermer">
          <Icon name="x" :size="18" />
        </button>
      </div>

      <div class="modal-body">
        <label class="fld-label" for="sh-name">Nom</label>
        <input
          id="sh-name"
          class="fld"
          v-model="name"
          placeholder="Ex. Lait, Pâtes, Liquide vaisselle…"
          autocomplete="off"
          @keydown.enter="onSave"
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
              :min="1"
              size="md"
              aria-label="Quantité"
              @update:model-value="quantity = $event"
            />
          </div>
          <div>
            <label class="fld-label">Statut</label>
            <button
              type="button"
              class="status-toggle"
              :class="{ on: purchased }"
              :aria-pressed="purchased"
              @click="purchased = !purchased"
            >
              <span class="status-dot" :class="{ on: purchased }">
                <Icon v-if="purchased" name="check" :size="12" />
              </span>
              {{ purchased ? 'Déjà acheté' : 'À acheter' }}
            </button>
          </div>
        </div>

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
.status-toggle {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 9px 13px;
  border-radius: 9px;
  border: 1px solid var(--line-2);
  background: var(--card-2);
  color: var(--ink);
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.14s, border-color 0.14s;
}
.status-toggle:hover {
  border-color: var(--accent);
}
.status-toggle.on {
  background: var(--sage-bg, var(--card));
  border-color: color-mix(in oklab, var(--ok, var(--accent)) 50%, var(--line-2));
  color: #3c573f;
}
.status-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid var(--line-2);
  background: var(--card);
  display: grid;
  place-items: center;
  color: #fff;
}
.status-dot.on {
  background: var(--ok, var(--accent));
  border-color: var(--ok, var(--accent));
}
.danger {
  color: var(--replace);
  margin-right: auto;
}
.danger:hover {
  background: var(--replace-bg);
}
</style>
