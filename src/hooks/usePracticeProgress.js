import { useCallback, useEffect, useRef, useState } from 'react';
import {
    load, save, clear, emptyProgress,
    recordCommit, recordAttempt, summarise,
} from '../lib/practiceProgress';

/**
 * Owns the learner's coverage across sessions.
 *
 * Reads once on mount and writes on change. Storage is local, so practice
 * needs no account and survives a demo with no network; swapping in a
 * server-backed store means changing practiceProgress.js, not this hook.
 */
export function usePracticeProgress() {
    // Read stored progress during the initialiser rather than in an effect, so
    // the first paint already shows the learner's real coverage.
    const [progress, setProgress] = useState(load);
    const firstRunRef = useRef(true);

    useEffect(() => {
        if (firstRunRef.current) { firstRunRef.current = false; return; }
        save(progress);
    }, [progress]);

    const noteCommit = useCallback((gloss) => {
        setProgress(p => recordCommit(p, gloss));
    }, []);

    const noteAttempt = useCallback((shape) => {
        setProgress(p => recordAttempt(p, shape));
    }, []);

    const reset = useCallback(() => {
        clear();
        setProgress(emptyProgress());
    }, []);

    return { progress, summary: summarise(progress), noteCommit, noteAttempt, reset };
}
