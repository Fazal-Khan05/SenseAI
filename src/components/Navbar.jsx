import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const SECTIONS = [
    { id: 'hero', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
];

export default function Navbar({ transparent }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Stop the page behind the full-screen mobile menu from scrolling.
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    // Close the menu on Escape. (Nav links close it via their own onClick.)
    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [menuOpen]);

    const isLanding = location.pathname === '/';
    const close = () => setMenuOpen(false);

    const scrollToSection = (id) => {
        close();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className={`navbar ${scrolled || !transparent ? 'navbar-solid' : ''}`}>
            <div className="navbar-inner container">
                <Logo size={24} />

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    {isLanding
                        ? SECTIONS.map(s => (
                            <button key={s.id} onClick={() => scrollToSection(s.id)} className="nav-link">
                                {s.label}
                            </button>
                        ))
                        : <Link to="/" className="nav-link" onClick={close}>Home</Link>}
                    <Link to="/contact" className="nav-link" onClick={close}>Contact</Link>

                    {/* Auth actions live here on mobile; the desktop copy is in .navbar-actions */}
                    <div className="nav-actions-mobile">
                        <Link to="/login" className="btn btn-ghost" onClick={close}>Login</Link>
                        <Link to="/signup" className="btn btn-primary btn-sm" onClick={close}>Sign Up</Link>
                    </div>
                </div>

                <div className="navbar-actions">
                    <ThemeToggle />
                    <Link to="/login" className="btn btn-ghost">Login</Link>
                    <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
                </div>

                <div className="navbar-mobile-controls">
                    <ThemeToggle />
                    <button
                        className="navbar-toggle"
                        onClick={() => setMenuOpen(v => !v)}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
