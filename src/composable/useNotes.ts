import { onMounted, ref } from 'vue'
import { AxiosError } from 'axios'
import {
    notesApi,
    type Note,
    type NoteCreatePayload,
    type NoteUpdatePayload,
} from '@/api/notes'

type AsyncState = 'idle' | 'loading' | 'error' | 'success'

export function useNotes() {
    const items = ref<Note[]>([])
    const state = ref<AsyncState>('idle')
    const errorMessage = ref<string | null>(null)

    async function fetchAll() {
        state.value = 'loading'
        errorMessage.value = null
        try {
            const { data } = await notesApi.list()
            items.value = data
            state.value = 'success'
        } catch (err) {
            state.value = 'error'
            errorMessage.value = formatError(err)
        }
    }

    async function create(payload: NoteCreatePayload) {
        const { data } = await notesApi.create(payload)
        items.value = [data, ...items.value]
        return data
    }

    async function update(id: number, payload: NoteUpdatePayload) {
        const { data } = await notesApi.update(id, payload)
        items.value = items.value.map(n => (n.id === id ? data : n))
        return data
    }

    async function remove(id: number) {
        await notesApi.remove(id)
        items.value = items.value.filter(n => n.id !== id)
    }

    onMounted(fetchAll)

    return { items, state, errorMessage, fetchAll, create, update, remove }
}

function formatError(err: unknown): string {
    if (err instanceof AxiosError) {
        if (err.code === 'ERR_NETWORK') return 'Impossible de joindre le serveur.'
        if (err.response?.status === 403) return "Vous n'avez pas les droits nécessaires."
    }
    return 'Une erreur est survenue.'
}
