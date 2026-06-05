import axios from "axios";
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
}, error => {
    if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});
