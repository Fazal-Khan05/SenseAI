import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Linkedin, GraduationCap, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page">
            <Navbar />

            <section className="contact-section">
                <div className="container">
                    <div className="section-header" style={{ marginTop: 80 }}>
                        <h2 className="section-title">Get In Touch</h2>
                        <p className="section-subtitle">Have questions or feedback? We'd love to hear from you.</p>
                    </div>

                    <div className="contact-grid">
                        {/* Contact Form */}
                        <div className="card-glass contact-form-card animate-slide-left">
                            <h3>Send us a message</h3>

                            {submitted && (
                                <div className="alert alert-success">
                                    <CheckCircle size={16} /> Your message has been sent successfully!
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <input type="text" name="name" placeholder=" " value={form.name} onChange={handleChange} required id="contact-name" />
                                    <label htmlFor="contact-name">Your Name</label>
                                </div>
                                <div className="input-group">
                                    <input type="email" name="email" placeholder=" " value={form.email} onChange={handleChange} required id="contact-email" />
                                    <label htmlFor="contact-email">Email Address</label>
                                </div>
                                <div className="input-group">
                                    <input type="text" name="subject" placeholder=" " value={form.subject} onChange={handleChange} required id="contact-subject" />
                                    <label htmlFor="contact-subject">Subject</label>
                                </div>
                                <div className="input-group">
                                    <textarea name="message" placeholder=" " rows={5} value={form.message} onChange={handleChange} required id="contact-message"></textarea>
                                    <label htmlFor="contact-message">Message</label>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                    <Send size={18} /> Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="contact-info animate-slide-right">
                            <div className="contact-info-card">
                                <div className="contact-info-icon"><Mail size={24} /></div>
                                <div>
                                    <h4>Email</h4>
                                    <p>contact@senseai.tech</p>
                                </div>
                            </div>
                            <div className="contact-info-card">
                                <div className="contact-info-icon"><Linkedin size={24} /></div>
                                <div>
                                    <h4>LinkedIn</h4>
                                    <p>linkedin.com/in/senseai</p>
                                </div>
                            </div>
                            <div className="contact-info-card">
                                <div className="contact-info-icon"><GraduationCap size={24} /></div>
                                <div>
                                    <h4>University</h4>
                                    <p>University Project - CS Department</p>
                                </div>
                            </div>

                            <div className="contact-map-placeholder">
                                <div className="map-placeholder-inner">
                                    <p>🗺️ Location Map</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
