import { useState, useEffect, useMemo } from 'react';
import { ThemeContext } from './theme-context';

const STORAGE_KEY = 'senseai-theme';

export function ThemeProvider({ children }) {
    // index.html already resolved the theme before paint; read it back
    // rather than re-deriving it, so there is a single source of truth.
    const [dark, setDark] = useState(
        () => document.documentElement.getAttribute('data-theme') === 'dark'
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        try {
            localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
        } catch { /* storage blocked — theme still applies for this session */ }
    }, [dark]);

    const value = useMemo(() => ({ dark, toggleTheme: () => setDark(p => !p) }), [dark]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
