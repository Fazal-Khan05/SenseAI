import { useEffect, useRef } from 'react';

/**
 * Speaks `text` whenever it changes, while `enabled` is true.
 * No-ops in browsers without the Web Speech API.
 */
export function useSpeech(text, enabled) {
    const lastSpoken = useRef('');

    useEffect(() => {
        if (!enabled || !text) return;
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        if (text === lastSpoken.current) return;

        lastSpoken.current = text;
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);

        return () => window.speechSynthesis.cancel();
    }, [text, enabled]);

    useEffect(() => {
        if (!enabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    }, [enabled]);
}
