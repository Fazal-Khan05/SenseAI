import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, RefreshCw } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import './Auth.css';

const OTP_LENGTH = 6;

export default function OTPVerification() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(() => Array(OTP_LENGTH).fill(''));
    const [verified, setVerified] = useState(false);
    const [resent, setResent] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Clear the pending timers if the user navigates away mid-countdown.
    useEffect(() => {
        if (!verified) return;
        const t = setTimeout(() => navigate('/dashboard'), 1500);
        return () => clearTimeout(t);
    }, [verified, navigate]);

    useEffect(() => {
        if (!resent) return;
        const t = setTimeout(() => setResent(false), 3000);
        return () => clearTimeout(t);
    }, [resent]);

    const code = otp.join('');

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const next = [...otp];
        next[index] = value.slice(-1);
        setOtp(next);
        if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
        if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (!paste) return;
        const next = Array(OTP_LENGTH).fill('');
        paste.split('').forEach((d, i) => { next[i] = d; });
        setOtp(next);
        inputRefs.current[Math.min(paste.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleVerify = (e) => {
        e.preventDefault();
        // TODO: no OTP backend yet — any 6 digits are accepted.
        if (code.length === OTP_LENGTH) setVerified(true);
    };

    return (
        <AuthLayout shapes={2}>
            <div className="card-glass auth-card otp-card">
                {verified ? (
                    <div className="otp-success">
                        <div className="success-icon"><CheckCircle size={64} /></div>
                        <h2>Verified!</h2>
                        <p>Your account has been verified successfully. Redirecting to dashboard...</p>
                    </div>
                ) : (
                    <>
                        <h2>Verify Your Account</h2>
                        <p className="auth-sub">We have sent a 6-digit verification code to your email.</p>

                        <form onSubmit={handleVerify}>
                            <div className="otp-grid" onPaste={handlePaste}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={el => { inputRefs.current[i] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete={i === 0 ? 'one-time-code' : 'off'}
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        className={`otp-input ${digit ? 'filled' : ''}`}
                                        id={`otp-input-${i}`}
                                        aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
                                    />
                                ))}
                            </div>

                            {resent && (
                                <div className="alert alert-success" role="status" style={{ marginTop: 16 }}>
                                    <CheckCircle size={16} /> Verification code resent successfully!
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary btn-lg auth-btn"
                                disabled={code.length !== OTP_LENGTH}>
                                Verify
                            </button>
                        </form>

                        <button type="button" className="btn btn-ghost resend-btn" onClick={() => setResent(true)}>
                            <RefreshCw size={16} /> Resend Code
                        </button>
                    </>
                )}
            </div>
        </AuthLayout>
    );
}
