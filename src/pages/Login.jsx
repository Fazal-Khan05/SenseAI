import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: no auth backend yet — this navigates without verifying anything.
        navigate('/dashboard');
    };

    return (
        <AuthLayout shapes={2}>
            <div className="card-glass auth-card">
                <h2>Welcome Back</h2>
                <p className="auth-sub">Sign in to continue to your dashboard</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="email" name="email" placeholder=" " value={form.email}
                            onChange={handleChange} required id="login-email" autoComplete="email" />
                        <label htmlFor="login-email">Email Address</label>
                    </div>

                    <div className="input-group">
                        <input
                            type={showPw ? 'text' : 'password'}
                            name="password"
                            placeholder=" "
                            value={form.password}
                            onChange={handleChange}
                            required
                            id="login-password"
                            autoComplete="current-password"
                        />
                        <label htmlFor="login-password">Password</label>
                        <button type="button" className="input-toggle" onClick={() => setShowPw(!showPw)}
                            aria-label={showPw ? 'Hide password' : 'Show password'}>
                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="auth-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <Link to="/contact" className="forgot-link">Forgot password?</Link>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg auth-btn">Login</button>
                </form>

                <p className="auth-footer-text">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </AuthLayout>
    );
}
