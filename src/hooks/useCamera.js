import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Owns the webcam lifecycle and a requestAnimationFrame loop.
 *
 * `onFrame(video, timestampMs)` is called once per animation frame while the
 * camera is live. It is held in a ref so callers can pass an inline function
 * without restarting the loop on every render.
 *
 * status: idle | requesting | live | denied | unavailable | error
 */
export function useCamera(onFrame) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const rafRef = useRef(null);
    const frameRef = useRef(onFrame);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    // Keep the callback fresh without restarting the loop (and without
    // writing to a ref during render).
    useEffect(() => { frameRef.current = onFrame; }, [onFrame]);

    const stop = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
        setStatus('idle');
    }, []);

    const start = useCallback(async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            setStatus('unavailable');
            setError('This browser does not expose a camera API. Note that camera access requires HTTPS (or localhost).');
            return;
        }

        setStatus('requesting');
        setError('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
                audio: false,
            });

            streamRef.current = stream;
            const video = videoRef.current;
            if (!video) { stream.getTracks().forEach(t => t.stop()); return; }

            video.srcObject = stream;
            await video.play();
            setStatus('live');

            const loop = () => {
                const v = videoRef.current;
                if (v?.readyState >= 2) frameRef.current?.(v, performance.now());
                rafRef.current = requestAnimationFrame(loop);
            };
            rafRef.current = requestAnimationFrame(loop);
        } catch (err) {
            streamRef.current?.getTracks().forEach(t => t.stop());
            streamRef.current = null;

            if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
                setStatus('denied');
                setError('Camera permission was blocked. Allow it in your browser’s site settings, then try again.');
            } else if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
                setStatus('unavailable');
                setError('No camera was found on this device.');
            } else {
                setStatus('error');
                setError(err.message || 'The camera could not be started.');
            }
        }
    }, []);

    // Release the device if the page unmounts while streaming.
    useEffect(() => stop, [stop]);

    return { videoRef, status, error, start, stop, isLive: status === 'live' };
}
