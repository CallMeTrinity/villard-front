<script setup lang="ts">
import Icon from '@/components/icons/Icon.vue'
import Stepper from '@/components/inventory/Stepper.vue'
import type { ShoppingItem } from '@/api/shopping'

const props = defineProps<{ item: ShoppingItem }>()

const emit = defineEmits<{
  (e: 'patch', id: number, patch: Partial<Pick<ShoppingItem, 'purchased' | 'quantity'>>): void
  (e: 'edit', item: ShoppingItem): void
}>()

function togglePurchased() {
  emit('patch', props.item.id, { purchased: !props.item.purchased })
}

function updateQty(quantity: number) {
  emit('patch', props.item.id, { quantity })
}
</script>

<template>
  <div class="sh-row" :class="{ done: item.purchased }">
    <button
      type="button"
      class="sh-check"
      :class="{ on: item.purchased }"
      :aria-pressed="item.purchased"
      :aria-label="item.purchased ? `Marquer ${item.name} à acheter` : `Marquer ${item.name} acheté`"
      @click="togglePurchased"
    >
      <Icon v-if="item.purchased" name="check" :size="14" />
    </button>

    <button
      type="button"
      class="sh-main"
      :title="item.purchased ? 'Modifier l\'article' : 'Modifier l\'article'"
      @click="emit('edit', item)"
    >
      <span class="sh-name">{{ item.name }}</span>
    </button>

    <Stepper
      :model-value="item.quantity"
      :min="1"
      :aria-label="`quantité ${item.name}`"
      @update:model-value="updateQty"
    />
  </div>
</template>

<style scoped>
.sh-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  padding: var(--row-pad) 16px;
  border-bottom: 1px solid var(--line);
  transition: background-color 0.15s;
}
.sh-row:last-child {
  border-bottom: 0;
}
.sh-row.done {
  background: color-mix(in oklab, var(--card-2) 70%, transparent);
}

.sh-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.8px solid var(--line-2);
  background: var(--card);
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--card);
  transition: background-color 0.15s, border-color 0.15s, transform 0.08s;
  padding: 0;
}
.sh-check:hover {
  border-color: var(--accent);
}
.sh-check:active {
  transform: scale(0.92);
}
.sh-check.on {
  background: var(--ok, var(--accent));
  border-color: var(--ok, var(--accent));
  color: #fff;
}

.sh-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  align-items: flex-start;
  text-align: left;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  color: inherit;
  font: inherit;
}
.sh-main:hover .sh-name {
  color: var(--accent);
}
.sh-name {
  font-weight: 600;
  font-size: 14px;
  transition: color 0.12s, text-decoration-color 0.15s;
}
.sh-row.done .sh-name {
  text-decoration: line-through;
  text-decoration-thickness: 1.5px;
  text-decoration-color: var(--ink-3);
  color: var(--ink-3);
}
</style>
