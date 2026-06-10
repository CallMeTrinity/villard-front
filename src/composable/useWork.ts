import { onMounted, ref } from 'vue'
import { formatError } from '@/utils/formatError'
import {
    worksApi,
    type Work,
    type WorkCreatePayload,
    type WorkUpdatePayload,
} from '@/api/work'

type AsyncState = 'idle' | 'loading' | 'error' | 'success'

export function useWork() {
    const items = ref<Work[]>([])
    const state = ref<AsyncState>('idle')
    const errorMessage = ref<string | null>(null)

    async function fetchAll() {
        state.value = 'loading'
        errorMessage.value = null
        try {
            const { data } = await worksApi.list()
            items.value = data
            state.value = 'success'
        } catch (err) {
            state.value = 'error'
            errorMessage.value = formatError(err)
        }
    }

    async function create(payload: WorkCreatePayload) {
        const { data } = await worksApi.create(payload)
        items.value = [data, ...items.value]
        return data
    }

    async function update(id: number, payload: WorkUpdatePayload) {
        const { data } = await worksApi.update(id, payload)
        items.value = items.value.map(w => (w.id === id ? data : w))
        return data
    }

    async function remove(id: number) {
        await worksApi.remove(id)
        items.value = items.value.filter(w => w.id !== id)
    }

    onMounted(fetchAll)

    return { items, state, errorMessage, fetchAll, create, update, remove }
}
