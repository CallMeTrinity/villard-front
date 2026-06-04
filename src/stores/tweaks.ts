import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Density = 'compact' | 'regular' | 'comfy'
export type CalView = 'month' | 'week' | 'list'

export const ACCENTS = ['#2E4A39', '#2C5159', '#97653A', '#4F6076', '#6E4B5E'] as const

interface TweaksSnapshot {
  density: Density
  calView: CalView
  accent: string
  grain: boolean
}

const STORAGE_KEY = 'marmotte.tweaks'

const DEFAULTS: TweaksSnapshot = {
  density: 'regular',
  calView: 'month',
  accent: '#2E4A39',
  grain: true,
}

function load(): TweaksSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export const useTweaksStore = defineStore('tweaks', () => {
  const init = load()
  const density = ref<Density>(init.density)
  const calView = ref<CalView>(init.calView)
  const accent = ref<string>(init.accent)
  const grain = ref<boolean>(init.grain)

  function applyToDom() {
    const html = document.documentElement
    html.setAttribute('data-density', density.value)
    html.style.setProperty('--accent', accent.value)
    html.style.setProperty('--accent-2', `color-mix(in oklab, ${accent.value}, white 12%)`)
    html.style.setProperty('--accent-deep', `color-mix(in oklab, ${accent.value}, black 24%)`)
    html.style.setProperty(
      '--accent-bg',
      `color-mix(in oklab, ${accent.value} 13%, var(--card))`,
    )
  }

  function persist() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        density: density.value,
        calView: calView.value,
        accent: accent.value,
        grain: grain.value,
      }),
    )
  }

  applyToDom()

  watch([density, calView, accent, grain], () => {
    applyToDom()
    persist()
  })

  return { density, calView, accent, grain }
})
