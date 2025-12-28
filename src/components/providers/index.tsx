'use client';

import { QueryProvider } from "./query";
import { ThemeProvider } from "./theme";
import { ConsultationProvider } from "./consultation";
import { Toaster } from "sonner";
import { InstantConsultationRequestPopupProvider } from "./instant-consultation-request-popup";

export type ProviderProps = {
  children?: React.ReactNode;
};

const Providers = ({ children }: ProviderProps) => {
  return (
    <>
      <ThemeProvider>
        <QueryProvider>
          <ConsultationProvider>
            {children}
            <InstantConsultationRequestPopupProvider />
          </ConsultationProvider>
          <Toaster
            position="top-center"
            duration={1500}
            toastOptions={{
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
              classNames: {
                error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200',
                success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200',
                warning: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
                info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
              },
            }}
            closeButton
          />
        </QueryProvider>
      </ThemeProvider>
    </>
  );
};

export default Providers;
