import {
    emptyProgress, recordCommit, recordAttempt, stateFor, summarise,
    glossesForShape, LANDED_AT, CONFIDENT_AT,
} from '../src/lib/practiceProgress.js';

let pass = 0, fail = 0;
const check = (name, got, want) => {
    const ok = JSON.stringify(got) === JSON.stringify(want);
    ok ? pass++ : fail++;
    console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}`);
    if (!ok) console.log(`        got ${JSON.stringify(got)}  want ${JSON.stringify(want)}`);
};

let p = emptyProgress();
check('starts untried', stateFor(p.HELLO), 'untried');
check('every sign present', Object.keys(p).length, 8);

p = recordCommit(p, 'HELLO');
check(`one commit = landed (LANDED_AT ${LANDED_AT})`, stateFor(p.HELLO), 'landed');

p = recordCommit(p, 'HELLO');
p = recordCommit(p, 'HELLO');
check(`three commits = confident (CONFIDENT_AT ${CONFIDENT_AT})`, stateFor(p.HELLO), 'confident');

// A flat hand held without completing credits every FLAT sign an attempt.
let q = recordAttempt(emptyProgress(), 'FLAT');
check('FLAT attempt credits all flat-hand signs',
    ['HELLO', 'THANK-YOU', 'PLEASE'].map(g => stateFor(q[g])),
    ['attempted', 'attempted', 'attempted']);
check('FLAT attempt does not touch fist signs', stateFor(q.SORRY), 'untried');

// Once produced, a sign is no longer a struggle.
let r = recordCommit(emptyProgress(), 'HELLO');
r = recordAttempt(r, 'FLAT');
check('attempts do not regress a landed sign', stateFor(r.HELLO), 'landed');
check('but its untried siblings still gain one', stateFor(r.PLEASE), 'attempted');

// Stuck = tried repeatedly, never produced.
let s = emptyProgress();
for (let i = 0; i < 3; i++) s = recordAttempt(s, 'FIST');
check('3 failed fist attempts flags both fist signs stuck', summarise(s).stuck.sort(), ['SORRY', 'YES']);

const fresh = summarise(emptyProgress());
check('fresh: nothing landed', fresh.landed, 0);
check('fresh: all 8 untried', fresh.untried.length, 8);
check('fresh: not complete', fresh.complete, false);

let done = emptyProgress();
for (const g of Object.keys(done)) for (let i = 0; i < 3; i++) done = recordCommit(done, g);
const full = summarise(done);
check('all confident: complete', full.complete, true);
check('all confident: landed counts all 8', full.landed, 8);
check('all confident: nothing suggested', full.untried, []);

check('shape lookup is real', glossesForShape('ILY'), ['I-LOVE-YOU']);
check('unknown shape credits nothing', glossesForShape('NOPE'), []);

console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
