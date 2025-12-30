import { apiClient } from '../lib/api-client';
import { API_ENDPOINTS } from '../lib/api-config';

export interface RegisterData {
    email: string;
    password: string;
    name?: string;
    role: 'DOCTOR';
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        name: string | null;
        role: string;
        isVerified: boolean;
        hasAcceptedTerms: boolean;
        createdAt: string;
        updatedAt: string;
    };
}

export class AuthService {
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(
            API_ENDPOINTS.auth.register,
            data
        );

        // Store token
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    }

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(
            API_ENDPOINTS.auth.login,
            data
        );

        // Store token
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    }

    async verifyEmail(token: string): Promise<{ message: string }> {
        return apiClient.post(`${API_ENDPOINTS.auth.verifyEmail}?token=${token}`);
    }

    async resendVerification(email: string): Promise<{ message: string }> {
        return apiClient.post(API_ENDPOINTS.auth.resendVerification, { email });
    }

    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
        }
    }

    getUser(): AuthResponse['user'] | null {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        // Check token existence - server will validate expiration via 401 responses
        return !!localStorage.getItem('accessToken');
    }
}

export const authService = new AuthService();
