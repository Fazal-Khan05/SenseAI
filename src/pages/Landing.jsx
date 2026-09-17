import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { SIGN_GLOSSES, SIGN_HINTS } from '../lib/wordSigns';
import './Landing.css';

/**
 * The landing page is written as a descriptive grammar of the product.
 *
 * Sense AI's output is interlinear glossed text — gloss over translation,
 * morpheme-aligned — which is a typographic form with centuries of use behind
 * it. So the page is a grammar of the thing rather than a page about it:
 * numbered examples, a paradigm table, hanging entries, marginal annotations.
 * Every example below is output the engine actually produces.
 */

/** Gloss rows carry a morpheme parse, the way a real interlinear line does. */
const LEAD_EXAMPLE = [
    { form: 'ME', parse: '1sg' },
    { form: 'SORRY', parse: 'apologise' },
];

const BAND_EXAMPLE = [
    { form: 'I-LOVE-YOU', parse: '1sg-love-2sg' },
];

function Example({ number, tokens, translation, className = '' }) {
    return (
        <div className={`example ${className}`.trim()}>
            <span className="example-number">({number})</span>
            <div>
                <div className="gloss-line">
                    {tokens.map(t => (
                        <span key={t.form} className="gloss-token">
                            <span className="gloss-form">{t.form}</span>
                            <span className="gloss-parse">{t.parse}</span>
                        </span>
                    ))}
                </div>
                <p className="free-translation">‘{translation}’</p>
            </div>
        </div>
    );
}

export default function Landing() {
    return (
        <div className="landing">
            <Navbar transparent />

            <div className="sheet">
                {/* ===== §1 THE HERO, SET AS THE GRAMMAR'S FIRST EXAMPLE ===== */}
                {/* The nav already carries the wordmark; the running head
                    carries only the section, as a printed grammar's does. */}
                <header className="running-head">
                    <span className="rh-section">§1 · Recognition</span>
                </header>

                <section className="grammar-hero" id="hero">
                    <div>
                        <Example
                            number="1"
                            tokens={LEAD_EXAMPLE}
                            translation="I am sorry."
                            className="example-lead"
                        />

                        {/* The action closes the reading line rather than sitting in
                            a detached button row, as the direction contract specifies. */}
                        <p className="hero-statement">
                            Sense AI reads your handshape and the way you move it, then
                            repairs the grammar ASL leaves out — the dropped article, the
                            missing copula, the question word that moves to the front.{' '}
                            <Link to="/sign-detection" className="act act-inline">Start practising</Link>
                        </p>

                        <p className="hero-secondary">
                            <Link to="/object-detection" className="act-text">
                                Or try object detection →
                            </Link>
                        </p>
                    </div>

                    {/* Marginal annotations, the grammar's own device — this is
                        what replaces the removed badge pills. */}
                    <aside className="marginalia">
                        <p className="margin-note">
                            <b>On device</b>
                            Inference runs in your browser. No video, frame or landmark
                            leaves the machine.
                        </p>
                        <p className="margin-note">
                            <b>Vocabulary</b>
                            {SIGN_GLOSSES.length} signs, recognised from handshape and
                            movement together.
                        </p>
                        <p className="margin-note">
                            <b>Access</b>
                            No account needed to practise.
                        </p>
                    </aside>
                </section>

                {/* ===== §2 WHAT THE MECHANISM IS ===== */}
                <section className="grammar-section" id="sign-language">
                    <div className="section-mark">
                        <span className="mark">§2</span>
                        <h2>ASL is not English with different hands</h2>
                    </div>

                    <div className="section-body">
                        <div>
                            <div className="prose-block">
                                <p>
                                    American Sign Language drops articles, omits the copula,
                                    and moves question words. A recogniser that stops at
                                    labels hands you a pile of words. Sense AI carries the
                                    gloss through a grammar and returns a sentence.
                                </p>
                            </div>

                            <div className="entry-list">
                                <div className="entry">
                                    <span className="entry-label">Handshape</span>
                                    <p className="entry-text">
                                        Read by a trained classifier, not by hand-written rules —
                                        five shapes it can tell apart reliably.
                                    </p>
                                </div>
                                <div className="entry">
                                    <span className="entry-label">Movement</span>
                                    <p className="entry-text">
                                        Segmented into strokes and classified as held, straight,
                                        circular or repeating. <strong>THANK-YOU and PLEASE are the
                                            same flat hand</strong> — only the movement separates them.
                                    </p>
                                </div>
                                <div className="entry">
                                    <span className="entry-label">Grammar</span>
                                    <p className="entry-text">
                                        The gloss sequence is repaired into English: articles and
                                        copula restored, question words fronted.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <aside className="marginalia">
                            <p className="margin-note">
                                <b>Note</b>
                                Glosses are conventionally set in small capitals, and the
                                free translation in single quotes. This page follows that
                                convention throughout.
                            </p>
                        </aside>
                    </div>
                </section>

                {/* ===== §3 THE PARADIGM — the eight signs, stated plainly ===== */}
                <section className="grammar-section" id="features">
                    <div className="section-mark">
                        <span className="mark">§3</span>
                        <h2>The paradigm</h2>
                    </div>

                    <div className="section-body">
                        <div>
                            <div className="paradigm">
                                {SIGN_HINTS.map(({ gloss, hint }, i) => (
                                    <div key={gloss} className="paradigm-row">
                                        <span className="paradigm-index">{String(i + 1).padStart(2, '0')}</span>
                                        <span className="paradigm-form">{gloss}</span>
                                        <span className="paradigm-note">{hint}</span>
                                    </div>
                                ))}
                            </div>

                            <p className="paradigm-caption">
                                Eight forms. Each stays reliably distinguishable from the others
                                without a trained movement model. Fingerspelling and a larger
                                vocabulary need one, which is the next piece of work.
                            </p>
                        </div>

                        <aside className="marginalia">
                            <p className="margin-note">
                                <b>Object detection</b>
                                A second mode identifies 80 everyday object types from the
                                same camera, using a pre-trained model.
                            </p>
                        </aside>
                    </div>
                </section>

                {/* ===== §4 HOW A SESSION RUNS ===== */}
                <section className="grammar-section" id="how-it-works">
                    <div className="section-mark">
                        <span className="mark">§4</span>
                        <h2>How a session runs</h2>
                    </div>

                    <div className="section-body">
                        <div className="entry-list">
                            <div className="entry">
                                <span className="entry-label">01 · Open</span>
                                <p className="entry-text">
                                    Allow the camera. The models download once and are cached
                                    afterwards.
                                </p>
                            </div>
                            <div className="entry">
                                <span className="entry-label">02 · Sign</span>
                                <p className="entry-text">
                                    Make a sign from the paradigm. The reading shows the
                                    handshape and movement it sees while you hold it.
                                </p>
                            </div>
                            <div className="entry">
                                <span className="entry-label">03 · Read</span>
                                <p className="entry-text">
                                    Recognised signs collect as a gloss line, and the English
                                    sentence is built beneath it.
                                </p>
                            </div>
                            <div className="entry">
                                <span className="entry-label">04 · Repeat</span>
                                <p className="entry-text">
                                    Coverage records which signs you can produce, so you can see
                                    what still needs work.
                                </p>
                            </div>
                        </div>

                        <aside className="marginalia">
                            <p className="margin-note">
                                <b>Offline</b>
                                After the first visit the models are cached. A session makes no
                                network requests at all.
                            </p>
                            <p className="margin-note">
                                <b>Camera</b>
                                Blocked or unavailable cameras are reported plainly rather than
                                left spinning.
                            </p>
                        </aside>
                    </div>
                </section>
            </div>

            {/* ===== §5 THE CLOSE — the one band the second ink owns ===== */}
            <section className="overprint-band">
                <div className="sheet">
                    <h2 className="band-heading">Practise {SIGN_GLOSSES.length} signs and watch them become sentences.</h2>

                    <Example
                        number="2"
                        tokens={BAND_EXAMPLE}
                        translation="I love you."
                        className="example-lead"
                    />

                    <div className="hero-action-line">
                        <Link to="/sign-detection" className="act">Start practising</Link>
                    </div>
                </div>
            </section>

            <div className="sheet">
                <p className="colophon">
                    Sense AI is a university project. Recognition is rule-based over a
                    trained handshape classifier; no accuracy figure is claimed because
                    none has been measured. Examples (1) and (2) are output the engine
                    produces from the signs shown.
                </p>
            </div>

            <Footer />
        </div>
    );
}
