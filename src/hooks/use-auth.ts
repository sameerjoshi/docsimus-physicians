import { useState, useCallback, useEffect } from 'react';
import { authService, AuthResponse, LoginData, RegisterData } from '../services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UseAuthState {
    user: AuthResponse['user'] | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

interface UseAuthActions {
    login: (data: LoginData) => Promise<boolean>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => void;
    verifyEmail: (token: string) => Promise<boolean>;
    resendVerification: (email: string) => Promise<boolean>;
    clearError: () => void;
}

export function useAuth(): UseAuthState & UseAuthActions {
    const router = useRouter();
    const [state, setState] = useState<UseAuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
        error: null,
    });

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const user = authService.getUser();
        const isAuthenticated = authService.isAuthenticated();
        setState({
            user,
            isLoading: false,
            isAuthenticated,
            error: null,
        });
    }, []);

    const login = useCallback(async (data: LoginData): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const response = await authService.login(data);
            setState({
                user: response.user,
                isLoading: false,
                isAuthenticated: true,
                error: null,
            });
            toast.success('Logged in successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Login failed';
            setState(prev => ({ ...prev, isLoading: false, error: message }));
            toast.error(message);
            return false;
        }
    }, []);

    const register = useCallback(async (data: RegisterData): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const response = await authService.register(data);
            setState({
                user: response.user,
                isLoading: false,
                isAuthenticated: true,
                error: null,
            });
            toast.success('Account created successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Registration failed';
            setState(prev => ({ ...prev, isLoading: false, error: message }));
            toast.error(message);
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
        });
        toast.success('Logged out successfully');
        router.push('/login');
    }, [router]);

    const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            await authService.verifyEmail(token);
            setState(prev => ({ ...prev, isLoading: false }));
            toast.success('Email verified successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Email verification failed';
            setState(prev => ({ ...prev, isLoading: false, error: message }));
            toast.error(message);
            return false;
        }
    }, []);

    const resendVerification = useCallback(async (email: string): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            await authService.resendVerification(email);
            setState(prev => ({ ...prev, isLoading: false }));
            toast.success('Verification email sent');
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to resend verification email';
            setState(prev => ({ ...prev, isLoading: false, error: message }));
            toast.error(message);
            return false;
        }
    }, []);

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    return {
        // State
        ...state,

        // Actions
        login,
        register,
        logout,
        verifyEmail,
        resendVerification,
        clearError,
    };
}
