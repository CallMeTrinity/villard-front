import { AxiosError } from 'axios'

/**
 * Traduit une erreur (généralement Axios) en message utilisateur en français.
 * Source unique — ne pas redéfinir localement dans les composables/vues.
 */
export function formatError(err: unknown): string {
    if (err instanceof AxiosError) {
        if (err.code === 'ERR_NETWORK') return 'Impossible de joindre le serveur.'
        if (err.response?.status === 403) return "Vous n'avez pas les droits nécessaires."
    }
    return 'Une erreur est survenue.'
}
