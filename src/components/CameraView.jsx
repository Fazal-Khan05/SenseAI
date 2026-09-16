import { Camera, CameraOff, Loader2 } from 'lucide-react';

/**
 * Video surface plus an overlay canvas for drawing detections.
 * Renders every camera state inside the existing `.camera-box` styling.
 */
export default function CameraView({
    videoRef,
    canvasRef,
    status,
    error,
    onStart,
    onStop,
    idleIcon: IdleIcon = Camera,
    idleLabel = 'Start the camera to begin detecting',
    startLabel = 'Start Camera',
    startClass = 'btn-primary',
}) {
    const live = status === 'live';
    const busy = status === 'requesting';

    return (
        <div className="camera-box">
            <video
                ref={videoRef}
                className={`camera-video ${live ? 'visible' : ''}`}
                playsInline
                muted
                aria-label="Camera feed"
            />
            <canvas ref={canvasRef} className="camera-overlay" />

            {!live && (
                <div className="camera-placeholder">
                    {busy ? <Loader2 size={48} className="spin" />
                        : status === 'denied' || status === 'unavailable' || status === 'error'
                            ? <CameraOff size={48} />
                            : <IdleIcon size={48} />}

                    <p>{error || (busy ? 'Waiting for camera permission…' : idleLabel)}</p>

                    {!busy && (
                        <button className={`btn ${startClass}`} onClick={onStart}>
                            {status === 'idle' ? startLabel : 'Try Again'}
                        </button>
                    )}
                </div>
            )}

            {live && (
                <button className="btn btn-ghost btn-sm camera-stop" onClick={onStop}>
                    <CameraOff size={14} /> Stop
                </button>
            )}
        </div>
    );
}
