import Navbar from '../components/Navbar';
import { SIGN_GLOSSES } from '../lib/wordSigns';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import {
    Hand, ScanSearch, Zap, ShieldCheck, Cpu, Layout,
    UserPlus, KeyRound, MousePointerClick, Activity,
    ArrowRight, Sparkles, Eye, MessageSquare, Layers
} from 'lucide-react';
import './Landing.css';

export default function Landing() {
    return (
        <div className="landing">
            <Navbar transparent />

            {/* ===== HERO ===== */}
            <section className="hero" id="hero">
                <div className="hero-bg-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
                <div className="container hero-grid">
                    <div className="hero-content animate-slide-left">
                        <div className="hero-badge">
                            <Sparkles size={14} />
                            <span>AI-Powered Platform</span>
                        </div>
                        <h1>
                            AI-Powered <span className="gradient-text">Sign & Object</span> Detection Platform
                        </h1>
                        <p className="hero-sub">
                            Real-time gesture and object recognition using advanced machine learning directly in your browser. No setup required.
                        </p>
                        <div className="hero-actions">
                            <Link to="/sign-detection" className="btn btn-primary btn-lg">
                                <Hand size={20} /> Try Sign Language
                            </Link>
                            <Link to="/object-detection" className="btn btn-outline btn-lg">
                                <ScanSearch size={20} /> Try Object Detection
                            </Link>
                        </div>
                        <ul className="hero-facts">
                            <li>Runs entirely in your browser — video never leaves your device</li>
                            <li>Recognises {SIGN_GLOSSES.length} signs and builds them into English sentences</li>
                            <li>No sign-up needed to try it</li>
                        </ul>
                    </div>

                    <div className="hero-visual animate-slide-right">
                        <div className="hero-illustration">
                            {/* The product's actual output, not invented metrics:
                                ASL gloss on top, the English it produces below. */}
                            <div className="hero-card-float hero-card-1 animate-float">
                                <span className="hero-gloss">ME SORRY</span>
                                <span className="hero-arrow" aria-hidden="true">↓</span>
                                <strong>“I am sorry.”</strong>
                            </div>
                            <div className="hero-card-float hero-card-2 animate-float" style={{ animationDelay: '0.5s' }}>
                                <span className="hero-gloss">I-LOVE-YOU</span>
                                <span className="hero-arrow" aria-hidden="true">↓</span>
                                <strong>“I love you.”</strong>
                            </div>
                            <div className="hero-orb hero-orb-1"></div>
                            <div className="hero-orb hero-orb-2"></div>
                            <div className="hero-center-icon">
                                <Eye size={48} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SIGN LANGUAGE SECTION ===== */}
            <section className="section" id="sign-language">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge"><Hand size={16} /> Sign Language</div>
                        <h2 className="section-title">What is Sign Language Detection?</h2>
                        <p className="section-subtitle">
                            Sense AI reads your handshape and the way you move it, then repairs the grammar ASL leaves out — dropped articles, the missing copula, question words that move to the front.
                        </p>
                    </div>

                    <div className="info-grid">
                        <div className="card info-card animate-fade-in-up stagger-1">
                            <div className="info-icon"><MessageSquare size={24} /></div>
                            <h3>Communication Bridge</h3>
                            <p>Enables seamless communication between hearing and deaf communities by translating gestures to text instantly.</p>
                        </div>
                        <div className="card info-card animate-fade-in-up stagger-2">
                            <div className="info-icon"><Layers size={24} /></div>
                            <h3>Educational Tool</h3>
                            <p>Helps students and teachers learn sign language through interactive AI-powered feedback and recognition.</p>
                        </div>
                        <div className="card info-card animate-fade-in-up stagger-3">
                            <div className="info-icon"><Activity size={24} /></div>
                            <h3>Healthcare Access</h3>
                            <p>Facilitates better healthcare communication for patients who rely on sign language as their primary means of expression.</p>
                        </div>
                    </div>

                    <div className="sign-inventory">
                        <h3>The signs it recognises today</h3>
                        <ul className="sign-inventory-list">
                            {SIGN_GLOSSES.map(g => <li key={g}>{g}</li>)}
                        </ul>
                        <p>
                            Eight signs, chosen because each one stays reliably distinguishable
                            from the others without a trained model. Fingerspelling and a larger
                            vocabulary need a trained classifier, which is the next piece of work.
                        </p>
                    </div>

                    <div className="section-cta">
                        <Link to="/sign-detection" className="btn btn-primary btn-lg">
                            <Hand size={20} /> Try Sign Detection <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== OBJECT DETECTION SECTION ===== */}
            <section className="section section-alt" id="object-detection">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge accent"><ScanSearch size={16} /> Object Detection</div>
                        <h2 className="section-title">What is Object Detection?</h2>
                        <p className="section-subtitle">
                            Object detection identifies and classifies real-world objects using AI-powered image recognition, providing labels and confidence scores in real-time.
                        </p>
                    </div>

                    <div className="info-grid">
                        <div className="card info-card animate-fade-in-up stagger-1">
                            <div className="info-icon accent"><Eye size={24} /></div>
                            <h3>Visual Recognition</h3>
                            <p>Identifies 80 everyday object types from your camera feed, using a pre-trained detection model.</p>
                        </div>
                        <div className="card info-card animate-fade-in-up stagger-2">
                            <div className="info-icon accent"><Zap size={24} /></div>
                            <h3>Real-Time Processing</h3>
                            <p>Processes video frames in milliseconds, providing instant feedback on detected objects.</p>
                        </div>
                        <div className="card info-card animate-fade-in-up stagger-3">
                            <div className="info-icon accent"><Cpu size={24} /></div>
                            <h3>Smart Analysis</h3>
                            <p>Machine learning models continuously improve detection accuracy through advanced neural networks.</p>
                        </div>
                    </div>

                    <div className="section-cta">
                        <Link to="/object-detection" className="btn btn-accent btn-lg">
                            <ScanSearch size={20} /> Launch Object Detection <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="section" id="how-it-works">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">Get started with AI-powered detection in just four simple steps</p>

                    <div className="steps-grid">
                        <div className="step-card animate-fade-in-up stagger-1">
                            <div className="step-number">1</div>
                            <div className="step-icon"><UserPlus size={28} /></div>
                            <h3>Create Account</h3>
                            <p>Sign up with your email in seconds to get started.</p>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-card animate-fade-in-up stagger-2">
                            <div className="step-number">2</div>
                            <div className="step-icon"><KeyRound size={28} /></div>
                            <h3>Verify OTP</h3>
                            <p>Confirm your identity with a simple email verification code.</p>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-card animate-fade-in-up stagger-3">
                            <div className="step-number">3</div>
                            <div className="step-icon"><MousePointerClick size={28} /></div>
                            <h3>Select Mode</h3>
                            <p>Choose between sign language or object detection.</p>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-card animate-fade-in-up stagger-4">
                            <div className="step-number">4</div>
                            <div className="step-icon"><Activity size={28} /></div>
                            <h3>Start Detection</h3>
                            <p>Launch your camera and get real-time AI recognition.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section className="section section-alt" id="features">
                <div className="container">
                    <h2 className="section-title">Powerful Features</h2>
                    <p className="section-subtitle">Everything you need for a seamless AI detection experience</p>

                    <div className="features-grid">
                        <div className="card feature-card animate-fade-in-up stagger-1">
                            <div className="feature-icon"><Zap size={28} /></div>
                            <h3>Real-Time AI Processing</h3>
                            <p>Blazing fast inference powered by optimized ML models running directly in your browser.</p>
                        </div>
                        <div className="card feature-card animate-fade-in-up stagger-2">
                            <div className="feature-icon"><ShieldCheck size={28} /></div>
                            <h3>Secure Authentication</h3>
                            <p>OTP-based verification and encrypted sessions keep your data safe and private.</p>
                        </div>
                        <div className="card feature-card animate-fade-in-up stagger-3">
                            <div className="feature-icon"><Cpu size={28} /></div>
                            <h3>Browser-Based Engine</h3>
                            <p>No installations needed. All processing happens locally in your browser for maximum privacy.</p>
                        </div>
                        <div className="card feature-card animate-fade-in-up stagger-4">
                            <div className="feature-icon"><Layout size={28} /></div>
                            <h3>Intuitive Interface</h3>
                            <p>Clean, modern design that makes AI detection accessible to everyone, regardless of technical skill.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="cta-section">
                <div className="cta-bg-shapes">
                    <div className="cta-shape cta-shape-1"></div>
                    <div className="cta-shape cta-shape-2"></div>
                </div>
                <div className="container cta-content">
                    <h2>Ready to Experience AI?</h2>
                    <p>Practise {SIGN_GLOSSES.length} signs with live feedback, and watch them become English sentences.</p>
                    <div className="cta-actions">
                        <Link to="/signup" className="btn btn-lg btn-on-gradient">
                            Create Account <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
