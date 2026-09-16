import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import './App.css';

// The detection pages pull in TensorFlow.js and MediaPipe (~1MB). Loading them
// lazily keeps that weight off the landing and auth pages entirely.
const SignDetection = lazy(() => import('./pages/SignDetection'));
const ObjectDetection = lazy(() => import('./pages/ObjectDetection'));

function RouteFallback() {
    return (
        <div className="route-fallback">
            <div className="route-spinner" />
            <p>Loading detection engine…</p>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Suspense fallback={<RouteFallback />}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/verify" element={<OTPVerification />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/sign-detection" element={<SignDetection />} />
                        <Route path="/object-detection" element={<ObjectDetection />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </Suspense>
            </Router>
        </ThemeProvider>
    );
}

export default App;
