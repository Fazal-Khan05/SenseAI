import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import './Auth.css';

const LEVELS = [
    { level: 1, text: 'Weak', color: 'var(--error)' },
    { level: 2, text: 'Fair', color: 'var(--warning)' },
    { level: 3, text: 'Strong', color: 'var(--success)' },
];

function scorePassword(pw) {
    if (!pw) return { level: 0, text: '', color: '' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return LEVELS[0];
    if (score <= 3) return LEVELS[1];
    return LEVELS[2];
}

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const strength = scorePassword(form.password);
    const mismatch = form.confirm && form.password !== form.confirm;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        // TODO: no signup backend yet — the form data is not persisted anywhere.
        navigate('/verify');
    };

    return (
        <AuthLayout shapes={3}>
            <div className="card-glass auth-card">
                <h2>Create Account</h2>
                <p className="auth-sub">Start your AI detection journey today</p>

                {error && <div className="alert alert-error" role="alert"><X size={16} /> {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" name="name" placeholder=" " value={form.name}
                            onChange={handleChange} required id="signup-name" autoComplete="name" />
                        <label htmlFor="signup-name">Full Name</label>
                    </div>

                    <div className="input-group">
                        <input type="email" name="email" placeholder=" " value={form.email}
                            onChange={handleChange} required id="signup-email" autoComplete="email" />
                        <label htmlFor="signup-email">Email Address</label>
                    </div>

                    <div className="input-group">
                        <input
                            type={showPw ? 'text' : 'password'}
                            name="password"
                            placeholder=" "
                            value={form.password}
                            onChange={handleChange}
                            required
                            id="signup-password"
                            autoComplete="new-password"
                            aria-describedby="pw-strength"
                        />
                        <label htmlFor="signup-password">Password</label>
                        <button type="button" className="input-toggle" onClick={() => setShowPw(!showPw)}
                            aria-label={showPw ? 'Hide password' : 'Show password'}>
                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {form.password && (
                        <div className="password-strength" id="pw-strength">
                            <div className="strength-bars">
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        className={`strength-bar ${i <= strength.level ? 'active' : ''}`}
                                        style={{ background: i <= strength.level ? strength.color : '' }}
                                    />
                                ))}
                            </div>
                            <span className="strength-text" style={{ color: strength.color }}>{strength.text}</span>
                        </div>
                    )}

                    <div className="input-group">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            name="confirm"
                            placeholder=" "
                            value={form.confirm}
                            onChange={handleChange}
                            required
                            id="signup-confirm"
                            autoComplete="new-password"
                            aria-invalid={mismatch || undefined}
                        />
                        <label htmlFor="signup-confirm">Confirm Password</label>
                        <button type="button" className="input-toggle" onClick={() => setShowConfirm(!showConfirm)}
                            aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {form.confirm && form.password && (
                            <span className={`match-indicator ${mismatch ? 'no-match' : 'match'}`}>
                                {mismatch ? <X size={16} /> : <Check size={16} />}
                            </span>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg auth-btn">Create Account</button>
                </form>

                <p className="auth-footer-text">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </AuthLayout>
    );
}
