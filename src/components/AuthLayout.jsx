import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Logo from './Logo';
import '../pages/Auth.css';

/**
 * Shared chrome for the signup / login / verify screens:
 * background shapes, logo, and the "back to home" link.
 */
export default function AuthLayout({ shapes = 2, children }) {
    return (
        <div className="auth-page">
            <div className="auth-bg">
                {Array.from({ length: shapes }, (_, i) => (
                    <div key={i} className={`auth-shape auth-shape-${i + 1}`} />
                ))}
            </div>

            <div className="auth-container animate-scale-in">
                <Logo size={22} className="auth-logo" />
                <Link to="/" className="auth-home-link"><Home size={16} /> Back to Home</Link>
                {children}
            </div>
        </div>
    );
}
