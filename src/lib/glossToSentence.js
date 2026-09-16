import { LEXICON, isSpelled, spelledLetter } from './signVocabulary.js';

/**
 * Turns a sequence of ASL glosses into an English sentence.
 *
 * ASL is not word-order English: it drops articles and the copula, marks
 * questions by moving the WH word, and uses topic-comment order. This module
 * is the piece that repairs that — everything upstream only has to produce a
 * gloss sequence.
 *
 * Pure and dependency-free so it can be tested without a camera.
 * Input:  ['ME', 'NAME', '#J', '#O', '#H', '#N']
 * Output: 'My name is John.'
 */

/** Collapse runs of fingerspelled letters into single capitalised words. */
function collapseSpelling(glosses) {
    const out = [];
    let buffer = [];

    const flush = () => {
        if (!buffer.length) return;
        const word = buffer.join('');
        out.push({ type: 'spelled', value: word[0] + word.slice(1).toLowerCase() });
        buffer = [];
    };

    for (const g of glosses) {
        if (isSpelled(g)) buffer.push(spelledLetter(g).toUpperCase());
        else { flush(); out.push({ type: 'gloss', value: g }); }
    }
    flush();
    return out;
}

const isGloss = (t, ...names) => t?.type === 'gloss' && names.includes(t.value);
const anyToken = (t) => Boolean(t);

/** Predicate matcher: any token whose lexicon entry has this part of speech. */
const POS = (pos) => (t) =>
    t?.type === 'gloss' && LEXICON[t.value]?.pos === pos;

/**
 * Ordered phrase patterns, longest first. `match` entries are either a gloss
 * name, an array of alternatives, '*' for any single token, or '...' for the
 * remainder. The first pattern that matches wins.
 */
const PATTERNS = [
    {
        match: [['ME', 'MY'], 'NAME', '*'],
        build: ([, , x]) => `My name is ${text(x)}.`,
    },
    {
        match: [['YOU', 'YOUR'], 'NAME', 'WHAT'],
        build: () => 'What is your name?',
    },
    {
        match: ['WHAT', ['YOU', 'YOUR'], 'NAME'],
        build: () => 'What is your name?',
    },
    {
        match: ['HOW', 'YOU'],
        build: () => 'How are you?',
    },
    {
        match: ['NICE', 'MEET', 'YOU'],
        build: () => 'Nice to meet you.',
    },
    {
        match: ['ME', 'LEARN', 'SIGN'],
        build: () => 'I am learning sign language.',
    },
    {
        match: ['ME', 'NEED', 'HELP'],
        build: () => 'I need help.',
    },
    {
        match: ['ME', ['UNDERSTAND'], 'NO'],
        build: () => 'I do not understand.',
    },
    {
        match: ['NO', 'ME', 'UNDERSTAND'],
        build: () => 'I do not understand.',
    },
    {
        // Already a complete clause in one sign; do not re-grammar it.
        match: ['I-LOVE-YOU'],
        build: () => 'I love you.',
    },
    {
        match: ['ME', 'NEED', 'HELP'],
        build: () => 'I need help.',
    },
    {
        match: ['HELLO', 'HOW', 'YOU'],
        build: () => 'Hello, how are you?',
    },
    {
        match: ['THANK-YOU', 'YOU'],
        build: () => 'Thank you.',
    },
    {
        // ASL drops both the copula and the article: WHERE SCHOOL -> Where is the school?
        match: [['WHERE', 'WHAT'], POS('noun')],
        build: ([wh, n]) => {
            const q = LEXICON[wh.value].english;
            return `${q[0].toUpperCase()}${q.slice(1)} is the ${text(n)}?`;
        },
    },
    {
        match: ['WHO', POS('noun')],
        build: ([, n]) => `Who is the ${text(n)}?`,
    },
];

function text(token) {
    if (!token) return '';
    if (token.type === 'spelled') return token.value;
    return LEXICON[token.value]?.english ?? token.value.toLowerCase().replace(/-/g, ' ');
}

function matches(pattern, tokens) {
    if (pattern.length !== tokens.length) return false;
    return pattern.every((p, i) => {
        const t = tokens[i];
        if (p === '*') return anyToken(t);
        if (typeof p === 'function') return p(t);
        if (Array.isArray(p)) return isGloss(t, ...p);
        return isGloss(t, p);
    });
}

/**
 * Fallback when no phrase pattern fits: rebuild the sentence from parts of
 * speech — map pronouns, insert the dropped copula, add articles, and move a
 * WH word to the front as a question.
 */
function buildFromGrammar(tokens) {
    const words = [];
    let question = false;
    let subjectSeen = false;

    tokens.forEach((token, i) => {
        if (token.type === 'spelled') { words.push(token.value); subjectSeen = true; return; }

        const entry = LEXICON[token.value];
        if (!entry) { words.push(token.value.toLowerCase().replace(/-/g, ' ')); return; }

        const next = tokens[i + 1];
        const nextEntry = next?.type === 'gloss' ? LEXICON[next.value] : null;

        switch (entry.pos) {
            case 'wh':
                question = true;
                words.push(entry.english);
                break;

            case 'pronoun':
                // A pronoun directly before a noun is possessive: ME NAME -> my name
                if (nextEntry?.pos === 'noun') words.push(entry.possessive);
                else if (subjectSeen) words.push(entry.object);
                else { words.push(entry.english); subjectSeen = true; }
                break;

            case 'verb':
                // ASL drops the copula; English needs it for progressive readings.
                words.push(entry.english);
                break;

            case 'adjective':
                // Insert the copula ASL omits: ME GOOD -> I am good
                if (subjectSeen && !words.some(w => /\b(am|are|is)\b/.test(w))) {
                    words.push(copulaFor(words[0]), entry.english);
                } else {
                    words.push(entry.english);
                }
                break;

            case 'noun':
                words.push(entry.english);
                subjectSeen = true;
                break;

            default:
                words.push(entry.english);
        }
    });

    let sentence = words.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
    if (!sentence) return '';

    sentence = sentence[0].toUpperCase() + sentence.slice(1);
    return sentence + (question ? '?' : '.');
}

const copulaFor = (first) => {
    const w = (first || '').toLowerCase();
    if (w === 'i') return 'am';
    if (w === 'you' || w === 'we' || w === 'they') return 'are';
    return 'is';
};

export function glossToSentence(glosses) {
    if (!Array.isArray(glosses) || glosses.length === 0) return '';

    const tokens = collapseSpelling(glosses);

    // Longest-first so 'ME NAME X' wins over a shorter prefix pattern.
    for (const pattern of [...PATTERNS].sort((a, b) => b.match.length - a.match.length)) {
        if (matches(pattern.match, tokens)) return pattern.build(tokens);
    }

    return buildFromGrammar(tokens);
}

/** Raw gloss string, shown alongside the English for the demo. */
export function glossLine(glosses) {
    return collapseSpelling(glosses)
        .map(t => (t.type === 'spelled' ? t.value.toUpperCase() : t.value))
        .join(' ');
}
