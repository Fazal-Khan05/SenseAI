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

    const { features, nearest, distance, runnerUp, runnerUpDistance } = reading;

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
                    <dt>Nearest shape</dt>
                    <dd>{nearest ?? '—'} <span className="readout-dim">({distance.toFixed(2)})</span></dd>
                </div>
                <div>
                    <dt>Next nearest</dt>
                    <dd>
                        {runnerUp ?? '—'}
                        {runnerUpDistance != null && <span className="readout-dim"> ({runnerUpDistance.toFixed(2)})</span>}
                    </dd>
                </div>
            </dl>

            <p className="readout-help">
                0.00 reads as fully curled, 1.00 as straight. Lower distance is a
                better match; above 0.70 is rejected as unrecognised.
            </p>
        </details>
    );
}
