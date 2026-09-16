import { useCallback, useRef, useState } from 'react';
import { ScanSearch, Trash2, Clock } from 'lucide-react';
import DetectionHeader from '../components/DetectionHeader';
import CameraView from '../components/CameraView';
import ModelStatus from '../components/ModelStatus';
import { useCamera } from '../hooks/useCamera';
import { useObjectDetection } from '../hooks/useObjectDetection';
import { drawBoxes } from '../lib/drawBoxes';
import './Detection.css';

const timeAgo = (ts) => {
    const s = Math.round((Date.now() - ts) / 1000);
    if (s < 60) return `${s}s ago`;
    return `${Math.round(s / 60)} min ago`;
};

export default function ObjectDetection() {
    const canvasRef = useRef(null);
    const [history, setHistory] = useState([]);

    // Fires only when the set of visible classes changes, so history records
    // real events rather than one entry per frame.
    const recordScene = useCallback((count) => {
        setHistory(h => [{ id: `${Date.now()}`, at: Date.now(), objects: count }, ...h].slice(0, 8));
    }, []);

    const { objects, latestRef, modelState, onFrame, reset } = useObjectDetection(recordScene);

    // Draw from the ref, not state: state lags a frame behind the detector.
    const handleFrame = useCallback(async (video, ts) => {
        await onFrame(video, ts);
        drawBoxes(canvasRef.current, video, latestRef.current);
    }, [onFrame, latestRef]);

    const { videoRef, status, error, start, stop, isLive } = useCamera(handleFrame);

    const handleClear = () => {
        reset();
        setHistory([]);
        const c = canvasRef.current;
        if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
    };

    return (
        <div className="detection-page">
            <DetectionHeader title="Object Detection" icon={ScanSearch} variant="object" />

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
                                idleIcon={ScanSearch}
                                idleLabel="Start the camera to identify objects around you"
                                startClass="btn-accent"
                            />
                            <ModelStatus state={modelState} label="object detection" />
                        </div>

                        <div className="detect-output-section">
                            <div className="output-header">
                                <h3>Detected Objects</h3>
                                <span className="object-count">{objects.length} found</span>
                            </div>

                            {objects.length > 0 ? (
                                <div className="detection-list">
                                    {objects.map(obj => (
                                        <div key={obj.id} className="detection-item">
                                            <div className="detection-sign">
                                                <div className="object-dot" style={{ background: obj.color }} />
                                                <div>
                                                    <span className="detection-label">{obj.name}</span>
                                                </div>
                                            </div>
                                            <div className="detection-confidence">
                                                <div className="confidence-bar">
                                                    <div className="confidence-fill"
                                                        style={{ width: `${obj.confidence}%`, background: obj.color }} />
                                                </div>
                                                <span className="confidence-value">{obj.confidence}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="detection-empty">
                                    <ScanSearch size={32} />
                                    <p>{isLive ? 'Point the camera at an object.' : 'No objects detected yet. Start the camera to begin.'}</p>
                                </div>
                            )}

                            <button className="btn btn-outline btn-sm clear-btn" onClick={handleClear}
                                disabled={objects.length === 0 && history.length === 0}>
                                <Trash2 size={14} /> Clear Results
                            </button>

                            {history.length > 0 && (
                                <div className="detection-history">
                                    <h4><Clock size={16} /> Detection History</h4>
                                    {history.map(h => (
                                        <div key={h.id} className="history-item">
                                            <span className="history-time">{timeAgo(h.at)}</span>
                                            <span className="history-count">{h.objects} objects detected</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
