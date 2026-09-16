import { glossToSentence, glossLine } from '../src/lib/glossToSentence.js';

const CASES = [
    [['ME', 'NAME', '#J', '#O', '#H', '#N'], 'My name is John.'],
    [['YOU', 'NAME', 'WHAT'], 'What is your name?'],
    [['HOW', 'YOU'], 'How are you?'],
    [['NICE', 'MEET', 'YOU'], 'Nice to meet you.'],
    [['ME', 'LEARN', 'SIGN'], 'I am learning sign language.'],
    [['ME', 'NEED', 'HELP'], 'I need help.'],
    [['HELLO'], 'Hello.'],
    [['THANK-YOU'], 'Thank you.'],
    [['ME', 'GOOD'], 'I am good.'],
    [['ME', 'WANT', 'WATER'], 'I want water.'],
    [['WHERE', 'SCHOOL'], 'Where is the school?'],
    [['WHAT', 'NAME'], 'What is the name?'],
    [['ME', 'UNDERSTAND', 'NO'], 'I do not understand.'],
    [['YOU', 'GOOD'], 'You are good.'],
    [['ME', 'NAME', '#A', '#L', '#I'], 'My name is Ali.'],
    [['ME', 'LOVE', 'YOU'], 'I love you.'],
    [[], ''],
];

let pass = 0, fail = 0;
for (const [input, expected] of CASES) {
    const got = glossToSentence(input);
    const ok = got === expected;
    ok ? pass++ : fail++;
    console.log(
        `${ok ? 'ok  ' : 'FAIL'}  [${glossLine(input) || '(empty)'}]`.padEnd(42),
        `-> ${JSON.stringify(got)}${ok ? '' : `  expected ${JSON.stringify(expected)}`}`
    );
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
