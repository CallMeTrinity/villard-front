import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import {authApi, type LoginPayload, type User} from '@/api/auth'

const TOKEN_STORAGE_KEY = 'auth_token'
const REFRESH_TOKEN_STORAGE_KEY = 'auth_refresh_token'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY))
    const refreshToken= ref<string | null>(localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY))
    const user = ref<User | null>(null)

    const isAuthenticated = computed(() => !!token.value)
    // L'IRI réel de l'utilisateur n'est pas dans /api/me (cf. api/auth.ts) :
    // il faut le résoudre via la liste /api/users + uuid. Voir PlanningView pour l'usage.
    const userUuid = computed(() => user.value?.uuid ?? null)

    function setTokens(newToken: string, newRefresh: string){
        token.value = newToken
        refreshToken.value = newRefresh
        localStorage.setItem(TOKEN_STORAGE_KEY, newToken)
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, newRefresh)
    }
    async function login(payload: LoginPayload) {
        const {data} = await authApi.login(payload)
        setTokens(data.token, data.refresh_token)
        await fetchCurrentUser()
    }

    async function fetchCurrentUser() {
        if (!token.value) return
        const {data} = await authApi.me()
        user.value = data
    }

    function logout() {
        token.value = null
        refreshToken.value = null
        user.value = null
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
    }

    return {
        token,
        user,
        isAuthenticated,
        userUuid,
        login,
        fetchCurrentUser,
        logout,
    }
})
