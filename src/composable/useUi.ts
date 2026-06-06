import { ref, computed, onMounted } from 'vue'

const MOBILE_BREAKPOINT = 768
const COMPACT_BREAKPOINT = 1100
const BANNER_DISMISS_KEY = 'marmotte.banner.dismissed'

const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1440)
const sidebarOpen = ref(false)
const bannerDismissed = ref(
  typeof window !== 'undefined' && localStorage.getItem(BANNER_DISMISS_KEY) === '1',
)

let listenerAttached = false

function onResize() {
  viewportWidth.value = window.innerWidth
  if (viewportWidth.value >= MOBILE_BREAKPOINT) {
    sidebarOpen.value = false
  }
}

export function useUi() {
  onMounted(() => {
    if (!listenerAttached) {
      window.addEventListener('resize', onResize)
      listenerAttached = true
    }
    viewportWidth.value = window.innerWidth
  })

  const isMobile = computed(() => viewportWidth.value < MOBILE_BREAKPOINT)
  const isCompact = computed(() => viewportWidth.value < COMPACT_BREAKPOINT)
  const showMobileBanner = computed(() => isMobile.value && !bannerDismissed.value)

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function closeSidebar() {
    sidebarOpen.value = false
  }

  function dismissBanner() {
    bannerDismissed.value = true
    localStorage.setItem(BANNER_DISMISS_KEY, '1')
  }

  return {
    isMobile,
    isCompact,
    sidebarOpen,
    showMobileBanner,
    toggleSidebar,
    closeSidebar,
    dismissBanner,
  }
}
