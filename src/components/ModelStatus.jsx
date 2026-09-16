import { useEffect, useState } from 'react';

/**
 * Loading models takes seconds, and a static line of text makes that feel
 * broken. Showing elapsed time proves it is still working, and a hint appears
 * once it runs long enough to suggest a slow (CPU) path.
 */
export default function ModelStatus({ state, label, slowHint }) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (state !== 'loading') return;
        const started = Date.now();
        const id = setInterval(() => setElapsed(Math.round((Date.now() - started) / 1000)), 500);
        return () => clearInterval(id);
    }, [state]);

    if (state === 'ready') return null;

    if (state === 'error') {
        return (
            <p className="model-note error" role="alert">
                {label} failed to load. Run <code>npm run setup:models</code> and reload.
            </p>
        );
    }

    return (
        <p className="model-note" role="status">
            <span className="model-dot" />
            Loading {label}… {elapsed > 0 && `${elapsed}s`}
            {elapsed >= 4 && slowHint && <span className="model-slow">{slowHint}</span>}
        </p>
    );
}
