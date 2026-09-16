import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle({ size = 20 }) {
    const { dark, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={dark}
        >
            {dark ? <Sun size={size} /> : <Moon size={size} />}
        </button>
    );
}
