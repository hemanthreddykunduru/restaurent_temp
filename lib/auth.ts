'use client';

export interface AuthUser {
    id: string;
    email: string;
    role: 'admin' | 'branch' | 'delivery';
    branch_id: string | null;
}

const AUTH_KEY = 'sangem_auth';

export function getSession(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function setSession(user: AuthUser) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearSession() {
    localStorage.removeItem(AUTH_KEY);
}
