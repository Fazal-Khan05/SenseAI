import { useEffect, useState } from 'react';

/**
 * Loading models takes seconds, and a static line of text makes that feel
 * broken. Showing elapsed time proves it is still working, and a hint appears
 * once it runs long enough to suggest a slow (CPU) path.
 */
export default function ModelStatus({ state, label, slowHint, progress = 0 }) {
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

    const pct = Math.round(progress * 100);

    return (
        <div className="model-note" role="status">
            <div className="model-note-row">
                <span className="model-dot" />
                <span>
                    {progress > 0 && progress < 1
                        ? `Downloading ${label} — ${pct}%`
                        : `Preparing ${label}…`}
                </span>
                {elapsed > 0 && <span className="model-elapsed">{elapsed}s</span>}
            </div>

            {progress > 0 && (
                <div className="model-progress">
                    <div className="model-progress-fill" style={{ width: `${pct}%` }} />
                </div>
            )}

            <span className="model-slow">
                {/* First visit only: ~19MB of model files, then cached. */}
                First visit downloads the detection models (~19MB). They are cached afterwards.
                {elapsed >= 8 && slowHint && <> {slowHint}</>}
            </span>
        </div>
    );
}
