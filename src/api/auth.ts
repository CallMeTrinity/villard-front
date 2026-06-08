import {apiClient} from "./client";

export interface LoginPayload {
    username: string,
    password: string
}

export interface LoginResponse {
    token: string
    refresh_token: string
}

export interface RefreshResponse {
    token: string
    refresh_token: string
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
    refresh(refreshToken: string) {
        return apiClient.post<RefreshResponse>('/api/token/refresh', {refresh_token: refreshToken})
    },
    me() {
        return apiClient.get<User>('/api/me')
    }
}
