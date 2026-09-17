import { Link } from 'react-router-dom';
import { Mail, Linkedin, Github } from 'lucide-react';
import Logo from './Logo';
import './Footer.css';

const EMAIL = 'contact@senseai.tech';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Logo size={22} className="footer-logo" />
                        <p className="footer-desc">
                            AI-powered sign language and object detection platform. Real-time recognition using advanced machine learning directly in your browser.
                        </p>
                        <div className="footer-socials">
                            <a href={`mailto:${EMAIL}`} className="social-link" aria-label="Email"><Mail size={18} /></a>
                            <Link to="/contact" className="social-link" aria-label="LinkedIn"><Linkedin size={18} /></Link>
                            <Link to="/contact" className="social-link" aria-label="Github"><Github size={18} /></Link>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Platform</h4>
                        <Link to="/signup">Sign Up</Link>
                        <Link to="/login">Login</Link>
                        <Link to="/dashboard">Dashboard</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Features</h4>
                        <Link to="/sign-detection">Sign Detection</Link>
                        <Link to="/object-detection">Object Detection</Link>
                        <Link to="/contact">Contact Us</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Contact</h4>
                        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                        <Link to="/contact">LinkedIn Profile</Link>
                        <span>University Project</span>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Sense AI. All rights reserved.</p>
                    <p>Built with React &amp; machine learning</p>
                </div>
            </div>
        </footer>
    );
}
