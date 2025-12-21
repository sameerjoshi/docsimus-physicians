'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export type QueryProviderProps = {
    children?: React.ReactNode;
};

export const QueryProvider = ({ children }: QueryProviderProps) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        retry: (failureCount, error: unknown) => {
                            if ((error as { status?: number })?.status === 401) return false;
                            return failureCount < 3;
                        },
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
