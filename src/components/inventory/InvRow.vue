<script setup lang="ts">
import Icon from '@/components/icons/Icon.vue'
import Stepper from '@/components/inventory/Stepper.vue'
import { STATE_CYCLE, STATE_META, type InvItem, type InvState } from '@/data/inventoryMock'

const props = defineProps<{ item: InvItem }>()

const emit = defineEmits<{
  (e: 'patch', id: string, patch: Partial<Pick<InvItem, 'state' | 'qty'>>): void
}>()

function cycleState() {
  emit('patch', props.item.id, { state: STATE_CYCLE[props.item.state] })
}

function updateQty(qty: number) {
  emit('patch', props.item.id, { qty })
}

function meta(state: InvState) {
  return STATE_META[state]
}
</script>

<template>
  <div class="inv-row">
    <div class="inv-main">
      <span class="inv-name">{{ item.name }}</span>
      <span v-if="item.note" class="inv-note muted">{{ item.note }}</span>
    </div>
    <span class="inv-loc mono">
      <Icon name="pin" :size="12" />{{ item.loc }}
    </span>
    <button
      type="button"
      class="tag"
      :class="meta(item.state).cls"
      title="Cliquer pour changer l'état"
      @click="cycleState"
    >
      <span class="dot" :style="{ background: `var(--${meta(item.state).cls})` }" />
      {{ meta(item.state).label }}
    </button>
    <Stepper
      :model-value="item.qty"
      :min="0"
      :aria-label="`quantité ${item.name}`"
      @update:model-value="updateQty"
    />
  </div>
</template>
