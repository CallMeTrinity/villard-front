<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Icon from '@/components/icons/Icon.vue'
import type { Note } from '@/api/notes'

export type ModalInitial =
  | { mode: 'create' }
  | { mode: 'edit'; note: Note }

const props = defineProps<{
  open: boolean
  initial: ModalInitial | null
  canDelete: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [payload: { id: number | null; title: string; content: string }]
  remove: [id: number]
}>()

const title = ref('')
const content = ref('')
const errorMessage = ref<string | null>(null)
const saving = ref(false)

const isEditing = computed(() => props.initial?.mode === 'edit')
const editingId = computed(() =>
  props.initial?.mode === 'edit' ? props.initial.note.id : null,
)

watch(() => props.open, (open) => {
  if (!open) return
  errorMessage.value = null
  saving.value = false
  const init = props.initial
  if (!init) return
  if (init.mode === 'edit') {
    title.value = init.note.title
    content.value = init.note.content
  } else {
    title.value = ''
    content.value = ''
  }
}, { immediate: true })

function onSave() {
  errorMessage.value = null
  if (!title.value.trim()) {
    errorMessage.value = 'Renseigne un titre.'
    return
  }
  if (!content.value.trim()) {
    errorMessage.value = 'Renseigne un contenu.'
    return
  }
  saving.value = true
  emit('save', {
    id: editingId.value,
    title: title.value.trim(),
    content: content.value.trim(),
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
          <div class="eyebrow">{{ isEditing ? 'Modifier la note' : 'Nouvelle note' }}</div>
          <h2 class="modal-title">
            {{ isEditing ? title || 'Note' : 'Ajouter une note' }}
          </h2>
        </div>
        <button class="btn icon ghost" @click="emit('close')" aria-label="Fermer">
          <Icon name="x" :size="18" />
        </button>
      </div>

      <div class="modal-body">
        <label class="fld-label" for="note-title">Titre</label>
        <input
          id="note-title"
          class="fld"
          v-model="title"
          placeholder="Ex. Code Wifi, Boulangerie…"
          autocomplete="off"
          maxlength="120"
        />

        <label class="fld-label" for="note-content">Contenu</label>
        <textarea
          id="note-content"
          class="fld note-area"
          v-model="content"
          placeholder="Décris l'info utile pour les autres marmottes…"
          rows="6"
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
.note-area {
  font-family: var(--sans);
  line-height: 1.45;
  min-height: 120px;
}
.danger {
  color: var(--replace);
  margin-right: auto;
}
.danger:hover {
  background: var(--replace-bg);
}
</style>
