import { useCallback, useMemo, useRef, useState } from 'react';
import { Hand, Volume2, Copy, Trash2, Undo2 } from 'lucide-react';
import DetectionHeader from '../components/DetectionHeader';
import CameraView from '../components/CameraView';
import ModelStatus from '../components/ModelStatus';
import { useCamera } from '../hooks/useCamera';
import { useSignRecognition } from '../hooks/useSignRecognition';
import { useSpeech } from '../hooks/useSpeech';
import { glossToSentence, glossLine } from '../lib/glossToSentence';
import { prefetchHandLandmarker } from '../lib/handLandmarks';
import { SIGN_HINTS } from '../lib/wordSigns';
import { VOCABULARY } from '../lib/signVocabulary';
import './Detection.css';

// Begin loading the model the moment this chunk is parsed — before React
// mounts and well before the user presses Start Camera.
prefetchHandLandmarker();

const PHASE_LABEL = {
    idle: 'ready — make a sign',
    stroke: 'reading movement…',
    refractory: 'hold still to reset',
};

export default function SignDetection() {
    const canvasRef = useRef(null);
    const [speechOn, setSpeechOn] = useState(false);
    const [copied, setCopied] = useState(false);

    const { glosses, live, modelState, progress, onFrame, reset, undo, pushGloss } = useSignRecognition();
    const { videoRef, status, error, start, stop, isLive } = useCamera(onFrame);

    const sentence = useMemo(() => glossToSentence(glosses), [glosses]);
    const gloss = useMemo(() => glossLine(glosses), [glosses]);

    useSpeech(sentence, speechOn);

    const handleCopy = useCallback(async () => {
        if (!sentence) return;
        try {
            await navigator.clipboard.writeText(sentence);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { setCopied(false); }
    }, [sentence]);

    return (
        <div className="detection-page">
            <DetectionHeader title="Sign Language Detection" icon={Hand} variant="sign" />

            <main className="detect-main">
                <div className="container">
                    <div className="detect-grid">
                        <div className="detect-camera-section">
                            <CameraView
                                videoRef={videoRef}
                                canvasRef={canvasRef}
                                status={status}
                                error={error}
                                onStart={start}
                                onStop={stop}
                                idleIcon={Hand}
                                idleLabel="Start the camera and sign to build a sentence"
                            />

                            {isLive && (
                                <div className="live-read" aria-live="off">
                                    {modelState !== 'ready'
                                        ? <span className="live-hint">Camera is live — detection starts once the model finishes loading</span>
                                        : !live.hand && <span className="live-hint">Show your hand to the camera</span>}

                                    {live.hand && (
                                        <>
                                            {/* Showing the shape and phase makes a miss diagnosable:
                                                you can see whether it misread your hand or your motion. */}
                                            <span className="live-tag">{live.shape ?? 'unknown shape'}</span>
                                            <span className={`live-tag subtle phase-${live.phase}`}>
                                                {PHASE_LABEL[live.phase]}
                                            </span>
                                            {live.progress > 0 && (
                                                <div className="confidence-bar live-bar">
                                                    <div className="confidence-fill"
                                                        style={{ width: `${Math.round(live.progress * 100)}%` }} />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            <ModelStatus
                                state={modelState}
                                label="hand tracking"
                                progress={progress}
                                slowHint="If this stalls, the browser may be on the slow CPU path."
                            />

                            <div className="sentence-builder">
                                <div className="sentence-header">
                                    <h3>Sentence Builder</h3>
                                    <div className="sentence-actions">
                                        <button className="btn btn-ghost btn-sm" onClick={undo} disabled={!glosses.length}>
                                            <Undo2 size={14} /> Undo
                                        </button>
                                        <button className="btn btn-ghost btn-sm" onClick={handleCopy} disabled={!sentence}>
                                            <Copy size={14} /> {copied ? 'Copied' : 'Copy'}
                                        </button>
                                        <button className="btn btn-ghost btn-sm" onClick={reset} disabled={!glosses.length}>
                                            <Trash2 size={14} /> Clear
                                        </button>
                                    </div>
                                </div>

                                {gloss && <div className="gloss-line">{gloss}</div>}
                                <div className="sentence-text" aria-live="polite">
                                    {sentence || 'Detected signs will appear here...'}
                                </div>
                            </div>
                        </div>

                        <div className="detect-output-section">
                            <div className="output-header">
                                <h3>Detection Output</h3>
                                <label className="speech-toggle">
                                    <Volume2 size={16} />
                                    <span>Speech</span>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={speechOn}
                                        aria-label="Read the sentence aloud"
                                        className={`toggle ${speechOn ? 'active' : ''}`}
                                        onClick={() => setSpeechOn(v => !v)}
                                    />
                                </label>
                            </div>

                            {glosses.length > 0 ? (
                                <div className="detection-list">
                                    {glosses.map((g, i) => (
                                        <div key={`${g}-${i}`} className="detection-item">
                                            <div className="detection-sign">
                                                <Hand size={18} className="detection-icon" />
                                                <div>
                                                    <span className="detection-label">{g}</span>
                                                    <span className="detection-time">word sign</span>
                                                </div>
                                            </div>
                                            <span className="detection-index">{i + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="detection-empty">
                                    <Hand size={32} />
                                    <p>No signs detected yet. Start the camera to begin.</p>
                                </div>
                            )}

                            <details className="vocab-panel" open>
                                <summary>How to sign these ({SIGN_HINTS.length})</summary>
                                <ul className="sign-guide">
                                    {SIGN_HINTS.map(({ gloss, hint }) => (
                                        <li key={gloss}>
                                            <button className="vocab-chip" onClick={() => pushGloss(gloss)}
                                                title={`Add ${gloss} without signing it`}>
                                                {gloss}
                                            </button>
                                            <span>{hint}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="vocab-note">
                                    Tap a sign to add it without the camera. Other glosses in the
                                    vocabulary ({VOCABULARY.length}) are understood by the sentence
                                    builder but have no gesture yet.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
