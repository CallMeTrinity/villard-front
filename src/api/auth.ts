import {apiClient} from "./client";

export interface LoginPayload {
    username: string,
    password: string
}

export interface LoginResponse {
    token: string
}

// Note : /api/me renvoie actuellement `@id: "/api/me"` (l'URL de l'endpoint)
// et n'expose pas le champ `id` numérique de l'utilisateur. On déduit l'IRI réel
// via une recherche par `uuid` dans la liste /api/users (cf. composable/useUsers).
export interface User {
    '@id': string,
    uuid: string,
    username: string,
    roles: string[]
}

export const authApi = {
    login(payload: LoginPayload){
        return apiClient.post<LoginResponse>('/api/login', payload)
    },
    me() {
        return apiClient.get<User>('/api/me')
    }
}
