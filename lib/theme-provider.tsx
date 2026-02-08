'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
}

// Re-export useTheme from next-themes for compatibility with existing components
export { useTheme } from 'next-themes';
