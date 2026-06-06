<script setup lang="ts">
import Icon from '@/components/icons/Icon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    size?: 'sm' | 'md'
    ariaLabel?: string
  }>(),
  { min: 0, max: Number.POSITIVE_INFINITY, size: 'sm' },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

function dec() {
  if (props.modelValue <= props.min) return
  emit('update:modelValue', props.modelValue - 1)
}
function inc() {
  if (props.modelValue >= props.max) return
  emit('update:modelValue', props.modelValue + 1)
}
</script>

<template>
  <div class="stepper" :class="{ sm: size === 'sm' }" :aria-label="ariaLabel">
    <button
      type="button"
      :disabled="modelValue <= min"
      :aria-label="`Diminuer ${ariaLabel ?? ''}`.trim()"
      @click="dec"
    >
      <Icon name="minus" :size="12" />
    </button>
    <span class="num">{{ modelValue }}</span>
    <button
      type="button"
      :disabled="modelValue >= max"
      :aria-label="`Augmenter ${ariaLabel ?? ''}`.trim()"
      @click="inc"
    >
      <Icon name="plus" :size="13" />
    </button>
  </div>
</template>
