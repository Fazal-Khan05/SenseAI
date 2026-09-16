import { Link } from 'react-router-dom';
import { Hand, ScanSearch, LogOut, Type, Boxes, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import { SIGN_GLOSSES } from '../lib/wordSigns';
import { VOCABULARY } from '../lib/signVocabulary';
import './Dashboard.css';

// Start fetching a detection page's code (and its model) as soon as the user
// shows intent, so the wait happens before they click rather than after.
const PREFETCH = {
    '/sign-detection': () => import('./SignDetection'),
    '/object-detection': () => import('./ObjectDetection'),
};

const prefetch = (to) => { PREFETCH[to]?.().catch(() => {}); };

const MODES = [
    {
        to: '/sign-detection',
        variant: 'sign',
        icon: Hand,
        title: 'Sign Language Detection',
        blurb: 'Detect and translate hand gestures into text using your camera with real-time AI recognition.',
    },
    {
        to: '/object-detection',
        variant: 'object',
        icon: ScanSearch,
        title: 'Object Detection',
        blurb: 'Identify and classify real-world objects from your camera feed with confidence scoring.',
    },
];

export default function Dashboard() {
    // Real capability figures read from the source of truth, not invented
    // session metrics — there is no analytics backend to report.
    const stats = [
        { icon: Type, value: SIGN_GLOSSES.length, label: 'Signs recognised' },
        { icon: Boxes, value: VOCABULARY.length, label: 'Glosses in vocabulary' },
        { icon: ShieldCheck, value: 'On-device', label: 'Video never leaves your browser' },
    ];

    return (
        <div className="dashboard">
            <header className="dash-header">
                <div className="container dash-header-inner">
                    <Logo size={22} />
                    <nav className="dash-nav">
                        <Link to="/" className="dash-nav-link">Home</Link>
                        <Link to="/dashboard" className="dash-nav-link active" aria-current="page">Dashboard</Link>
                        <Link to="/contact" className="dash-nav-link">Contact</Link>
                        <ThemeToggle />
                        <Link to="/login" className="btn btn-ghost btn-sm dash-logout">
                            <LogOut size={16} /> Logout
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="dash-main">
                <div className="container">
                    <div className="dash-welcome animate-fade-in-up">
                        <div>
                            <h1>Welcome back, <span className="gradient-text">User</span> 👋</h1>
                            <p>Select a detection mode to get started with AI-powered recognition.</p>
                        </div>
                    </div>

                    <div className="dash-cards">
                        {MODES.map(({ to, variant, icon: Icon, title, blurb }, i) => (
                            <Link
                                key={to}
                                to={to}
                                className={`dash-card animate-fade-in-up stagger-${i + 1}`}
                                onMouseEnter={() => prefetch(to)}
                                onFocus={() => prefetch(to)}
                            >
                                <div className={`dash-card-icon ${variant}`}>
                                    <Icon size={36} />
                                </div>
                                <div className="dash-card-content">
                                    <h2>{title}</h2>
                                    <p>{blurb}</p>
                                    <span className="dash-card-link">
                                        Launch Detection <span className="arrow">→</span>
                                    </span>
                                </div>
                                <div className={`dash-card-glow ${variant}`} />
                            </Link>
                        ))}
                    </div>

                    <div className="dash-stats animate-fade-in-up stagger-3">
                        {stats.map(({ icon: Icon, value, label }) => (
                            <div key={label} className="stat-card">
                                <div className="stat-icon"><Icon size={22} /></div>
                                <div>
                                    <span className="stat-value">{value}</span>
                                    <span className="stat-label">{label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
