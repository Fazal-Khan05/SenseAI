const FINGER_LABELS = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];

/**
 * Shows what the shape classifier actually measures for the hand in frame:
 * how extended it reads each finger, and which template it lands nearest.
 *
 * This exists because the shape templates were originally written from
 * anatomical guesswork rather than measured values, which made recognition
 * unreliable in ways that were impossible to diagnose from the outside.
 */
export default function HandReadout({ reading }) {
    if (!reading?.features) return null;

    const { features, gesture, score, shape } = reading;

    return (
        <details className="hand-readout">
            <summary>What the classifier sees</summary>

            <div className="readout-fingers">
                {features.extension.map((value, i) => (
                    <div key={FINGER_LABELS[i]} className="readout-finger">
                        <span className="readout-label">{FINGER_LABELS[i]}</span>
                        <span className="readout-track">
                            <span className="readout-fill" style={{ width: `${Math.round(value * 100)}%` }} />
                        </span>
                        <span className="readout-value">{value.toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <dl className="readout-stats">
                <div><dt>Thumb–index gap</dt><dd>{features.thumbIndex.toFixed(2)}</dd></div>
                <div><dt>Index–middle gap</dt><dd>{features.indexMiddle.toFixed(2)}</dd></div>
                <div>
                    <dt>Model says</dt>
                    <dd>{gesture ?? '—'} <span className="readout-dim">({Math.round((score ?? 0) * 100)}%)</span></dd>
                </div>
                <div>
                    <dt>Used as</dt>
                    <dd>{shape ?? <span className="readout-dim">not a sign shape</span>}</dd>
                </div>
            </dl>

            <p className="readout-help">
                Finger bars read 0.00 as fully curled and 1.00 as straight — they
                are feedback on your hand, not what the classifier uses. The
                handshape comes from MediaPipe's trained gesture model.
            </p>
        </details>
    );
}
