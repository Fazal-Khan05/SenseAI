import { SIGN_HINTS } from '../lib/wordSigns';

const STATE_LABEL = {
    untried: 'not tried yet',
    attempted: 'tried, not landed yet',
    landed: 'landed once',
    confident: 'landed three times',
};

/**
 * The practice guide and the progress display are one object.
 *
 * A learner never switches between "what do I do" and "how am I doing": each
 * sign carries its instruction and its state together. Progress is coverage —
 * which signs you can produce — never a score, grade or streak.
 */
export default function SignCoverage({ summary, onAdd }) {
    const byGloss = Object.fromEntries(summary.entries.map(e => [e.gloss, e]));
    const stuck = new Set(summary.stuck);

    return (
        <section className="coverage" aria-labelledby="coverage-heading">
            <div className="coverage-head">
                <h3 id="coverage-heading">Your signs</h3>
                <p className="coverage-count">
                    <strong>{summary.landed}</strong> of {summary.total} landed
                </p>
            </div>

            {summary.complete ? (
                <p className="coverage-note coverage-note--done">
                    You can produce all {summary.total} signs reliably. Try building
                    a full sentence from them.
                </p>
            ) : summary.stuck.length > 0 ? (
                <p className="coverage-note">
                    {summary.stuck.length === 1
                        ? `${summary.stuck[0]} isn’t landing — check the movement below, not just the handshape.`
                        : `${summary.stuck.slice(0, 2).join(' and ')} aren’t landing — the movement is usually what’s missing.`}
                </p>
            ) : summary.untried.length > 0 ? (
                <p className="coverage-note">
                    Next to try: <strong>{summary.untried[0]}</strong>
                </p>
            ) : null}

            <ul className="coverage-list">
                {SIGN_HINTS.map(({ gloss, hint }) => {
                    const entry = byGloss[gloss] ?? { state: 'untried', commits: 0 };
                    const isStuck = stuck.has(gloss);

                    return (
                        <li key={gloss} className={`coverage-item is-${entry.state}`}>
                            <button
                                type="button"
                                className="coverage-chip"
                                onClick={() => onAdd(gloss)}
                                title={`Add ${gloss} without signing it`}
                            >
                                {gloss}
                            </button>

                            <span className="coverage-hint">
                                {hint}
                                {isStuck && (
                                    <em className="coverage-coach">
                                        Held the right handshape, but the movement never completed.
                                        Watch the motion bar — it has to cross the marker.
                                    </em>
                                )}
                            </span>

                            <span className="coverage-state" aria-label={STATE_LABEL[entry.state]}>
                                <span className="coverage-dots" aria-hidden="true">
                                    {[0, 1, 2].map(i => (
                                        <span key={i} className={`coverage-dot ${entry.commits > i ? 'filled' : ''}`} />
                                    ))}
                                </span>
                            </span>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
