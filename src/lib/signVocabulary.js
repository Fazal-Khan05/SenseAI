/**
 * Single source of truth for the supported sign vocabulary.
 * The word-sign model's label order, the UI, and the sentence rules all read
 * from here, so they cannot drift apart.
 *
 * `pos` drives the grammar fallback in glossToSentence.js.
 */
export const VOCABULARY = [
    { gloss: 'HELLO', pos: 'greeting', english: 'hello' },
    { gloss: 'I-LOVE-YOU', pos: 'phrase', english: 'I love you' },
    { gloss: 'STOP', pos: 'phrase', english: 'stop' },
    { gloss: 'GOODBYE', pos: 'greeting', english: 'goodbye' },
    { gloss: 'THANK-YOU', pos: 'greeting', english: 'thank you' },
    { gloss: 'PLEASE', pos: 'adverb', english: 'please' },
    { gloss: 'SORRY', pos: 'adjective', english: 'sorry' },

    { gloss: 'ME', pos: 'pronoun', english: 'I', object: 'me', possessive: 'my' },
    { gloss: 'YOU', pos: 'pronoun', english: 'you', object: 'you', possessive: 'your' },
    { gloss: 'WE', pos: 'pronoun', english: 'we', object: 'us', possessive: 'our' },

    { gloss: 'WHAT', pos: 'wh', english: 'what' },
    { gloss: 'WHO', pos: 'wh', english: 'who' },
    { gloss: 'WHERE', pos: 'wh', english: 'where' },
    { gloss: 'HOW', pos: 'wh', english: 'how' },

    { gloss: 'NAME', pos: 'noun', english: 'name' },
    { gloss: 'FRIEND', pos: 'noun', english: 'friend' },
    { gloss: 'SIGN', pos: 'noun', english: 'sign language' },
    { gloss: 'SCHOOL', pos: 'noun', english: 'school' },
    { gloss: 'WATER', pos: 'noun', english: 'water' },
    { gloss: 'FOOD', pos: 'noun', english: 'food' },

    { gloss: 'LEARN', pos: 'verb', english: 'learn', ing: 'learning' },
    { gloss: 'WANT', pos: 'verb', english: 'want', ing: 'wanting' },
    { gloss: 'NEED', pos: 'verb', english: 'need', ing: 'needing' },
    { gloss: 'HELP', pos: 'verb', english: 'help', ing: 'helping' },
    { gloss: 'MEET', pos: 'verb', english: 'meet', ing: 'meeting' },
    { gloss: 'LOVE', pos: 'verb', english: 'love', ing: 'loving' },
    { gloss: 'EAT', pos: 'verb', english: 'eat', ing: 'eating' },
    { gloss: 'UNDERSTAND', pos: 'verb', english: 'understand', ing: 'understanding' },

    { gloss: 'GOOD', pos: 'adjective', english: 'good' },
    { gloss: 'BAD', pos: 'adjective', english: 'bad' },
    { gloss: 'NICE', pos: 'adjective', english: 'nice' },
    { gloss: 'YES', pos: 'response', english: 'yes' },
    { gloss: 'NO', pos: 'response', english: 'no' },
];

export const GLOSS_LABELS = VOCABULARY.map(v => v.gloss);

export const LEXICON = Object.fromEntries(VOCABULARY.map(v => [v.gloss, v]));

/** Fingerspelled letters are tagged so they can be collapsed into words. */
export const SPELL_PREFIX = '#';
export const isSpelled = (token) => token.startsWith(SPELL_PREFIX);
export const spelledLetter = (token) => token.slice(SPELL_PREFIX.length);
