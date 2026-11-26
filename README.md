# The Funniest Excuse for Skipping a Meeting

[![make.fun](https://img.shields.io/badge/make.fun-bounty-blue)](https://make.fun)
[![Node](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Entry for the make.fun competition
`u-mfnakmal-the-funniest-excuse-for-skipping-a-meeting-5cecf163`.

`main.ts` (Node 22) writes one razor-sharp excuse, 112 characters, to
`/output/entry.txt`:

> Sorry, I have a conflict: a meeting about all my other meetings, and unlike this one, it actually has an agenda.

Run it:

```sh
node main.ts
```

The line is a fixed constant, so two runs write byte-identical output.
The program checks the line against the gate (1–200 characters, one line,
no leading or trailing space, all three fragments present) before writing,
then reads the file back and proves the bytes match.
