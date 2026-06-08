import axios, {type AxiosError, type InternalAxiosRequestConfig} from "axios";
import {env} from "@/config/env";

export const apiClient = axios.create({
    baseURL: env.apiUrl, headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/ld+json',
    }
});

apiClient.interceptors.request.use((config)=> {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})

// Déballe les collections API Platform 4 : { "@type": "Collection", "member": [...] } -> [...]
// Le front consomme partout un tableau plat ; la pagination Hydra sera réintroduite
// dans un wrapper dédié si on en a besoin.
apiClient.interceptors.response.use(response => {
    const d = response.data
    if (d && typeof d === 'object' && d['@type'] === 'Collection' && Array.isArray(d.member)) {
        response.data = d.member
    }
    return response
});


let refreshPromise: Promise<string> | null = null

async function performRefresh() : Promise<string> {
    const refreshToken = localStorage.getItem('auth_refresh_token')
    if (!refreshToken) {
        throw new Error('No refresh token found')
    }
    const {data} = await axios.post<{ token: string; refresh_token: string }>(`${env.apiUrl}/api/token/refresh`,
        {refresh_token: refreshToken},
        {headers: {'Content-Type': 'application/json', Accept: 'application/json'}},
    )
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('auth_refresh_token', data.refresh_token)
    return data.token
}

function hardLogout(){
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_refresh_token')
    if (window.location.pathname !== '/login') {
        window.location.href = '/login'
    }
}

apiClient.interceptors.response.use(r => r, async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & {_retried?: boolean}) | undefined
    const status = error.response?.status

    const url = original?.url ?? ''

    const isAuthEndPoint = url.includes('/api/login') || url.includes('/api/token/refresh')

    if (status === 401 && original && !original._retried && !isAuthEndPoint) {
        original._retried = true
        try {
            refreshPromise = refreshPromise ?? performRefresh().finally(() => refreshPromise = null)
            const newToken = await refreshPromise
            original.headers.Authorization = `Bearer ${newToken}`
            return apiClient(original)
        } catch {
            hardLogout()
            return Promise.reject(error)
        }
    }
    if (status === 401) hardLogout()
    return Promise.reject(error)
})
