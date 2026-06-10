import { onMounted, ref } from 'vue'
import { formatError } from '@/utils/formatError'
import {
    shoppingApi,
    type ShoppingCreatePayload,
    type ShoppingUpdatePayload, type ShoppingItem,
} from '@/api/shopping'

type AsyncState = 'idle' | 'loading' | 'error' | 'success'

export function useShopping() {
    const items = ref<ShoppingItem[]>([])
    const state = ref<AsyncState>('idle')
    const errorMessage = ref<string | null>(null)

    async function fetchAll() {
        state.value = 'loading'
        errorMessage.value = null
        try {
            const { data } = await shoppingApi.list()
            items.value = data
            state.value = 'success'
        } catch (err) {
            state.value = 'error'
            errorMessage.value = formatError(err)
        }
    }

    async function create(payload: ShoppingCreatePayload) {
        const { data } = await shoppingApi.create(payload)
        items.value = [...items.value, data]
        return data
    }

    // Pour la modale d'édition : on attend la réponse serveur avant de mettre à jour.
    async function update(id: number, payload: ShoppingUpdatePayload) {
        const { data } = await shoppingApi.update(id, payload)
        items.value = items.value.map(i => (i.id === id ? data : i))
        return data
    }

    // Pour le stepper qty et le cycle d'état : MAJ immédiate, rollback si erreur.
    async function patch(id: number, payload: ShoppingUpdatePayload) {
        const previous = items.value.find(i => i.id === id)
        if (!previous) return
        items.value = items.value.map(i => (i.id === id ? { ...i, ...payload } : i))
        try {
            const { data } = await shoppingApi.update(id, payload)
            items.value = items.value.map(i => (i.id === id ? data : i))
            return data
        } catch (err) {
            items.value = items.value.map(i => (i.id === id ? previous : i))
            throw err
        }
    }

    async function remove(id: number) {
        await shoppingApi.remove(id)
        items.value = items.value.filter(i => i.id !== id)
    }

    onMounted(fetchAll)

    return { items, state, errorMessage, fetchAll, create, update, patch, remove }
}
