/**
 * MediaPipe hand-landmark indices.
 *
 * Deliberately separate from handLandmarks.js: that module imports the
 * MediaPipe runtime (~150KB), and anything importing these constants would
 * otherwise drag the whole runtime into the bundle with it.
 */
export const JOINTS = {
    WRIST: 0,
    THUMB: [1, 2, 3, 4],
    INDEX: [5, 6, 7, 8],
    MIDDLE: [9, 10, 11, 12],
    RING: [13, 14, 15, 16],
    PINKY: [17, 18, 19, 20],
};

export const FINGERS = ['THUMB', 'INDEX', 'MIDDLE', 'RING', 'PINKY'];
