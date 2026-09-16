import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import Logo from './Logo';

/**
 * Shared header for the detection screens.
 * `icon` is a lucide component; `variant` tints it ("sign" | "object").
 */
export default function DetectionHeader({ title, icon, variant }) {
    const Icon = icon;

    return (
        <header className="detect-header">
            <div className="container detect-header-inner">
                <div className="detect-header-left">
                    <Link to="/" className="btn btn-ghost btn-sm"><Home size={18} /> Home</Link>
                    <Link to="/dashboard" className="btn btn-ghost btn-sm"><ArrowLeft size={18} /> Dashboard</Link>
                </div>
                <div className="detect-title">
                    <Icon size={20} className={`detect-title-icon ${variant}`} />
                    <span>{title}</span>
                </div>
                <Logo size={18} compact />
            </div>
        </header>
    );
}
