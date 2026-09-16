import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

/**
 * The SenseAI wordmark. `size` scales the icon; `compact` shrinks the text
 * to match the smaller headers on the detection pages.
 */
export default function Logo({ size = 24, compact = false, className = '' }) {
    return (
        <Link to="/" className={`navbar-logo ${compact ? 'logo-compact' : ''} ${className}`.trim()}>
            <div className="logo-icon">
                <Brain size={size} />
            </div>
            <span className="logo-text">Sense<span className="logo-accent">AI</span></span>
        </Link>
    );
}
