// excuse-meeting-entry1 — main.ts
//
// Quest: The Funniest Excuse for Skipping a Meeting
// make.fun slug: u-mfnakmal-the-funniest-excuse-for-skipping-a-meeting-5cecf163
//
// Contract, from the kit RULES.txt:
//   - write exactly one line of UTF-8 text to /output/entry.txt
//   - the line holds 1 to 200 characters and is not only whitespace
//   - the program runs twice in a sandbox of its own, so the line must be
//     a fixed constant: byte-identical on both runs, no clock, no network,
//     no randomness anywhere in this file
//
// Judge, z-ai/glm-5.3-flash, pairwise, most important first:
//   1. a funny one-line excuse for skipping a pointless meeting
//   2. a sharp, surprising turn that earns the laugh
//   3. true to office life, so the laugh arrives with a nod
//   4. one tight line, no wasted words, no throat-clearing
//   5. a fresh angle, never a stock excuse about bad wifi, a cat, a dentist
//
// The line below is built for those five in order. The opener names a
// conflict, the middle turns that conflict into a meeting about meetings,
// and the sting lands on this meeting itself: unlike the meeting about
// meetings, this one has no agenda at all. The joke is the recursion plus
// the sting together; neither half works alone, and the line never says
// the word pointless outright — the sting makes the reader say it.
//
// The program assembles the line from three named fragments, checks it
// against the gate — including a pin that all three fragments survived
// the assembly — writes it, then reads it back and proves the bytes on
// disk match the line in both characters and byte length.

import {
  mkdirSync as makeOutputFolder,
  readFileSync as readWrittenText,
  writeFileSync as writeTextToDisk,
} from "node:fs";
import { join as joinPathPieces } from "node:path";

const OUTPUT_FOLDER = "/output";
const OUTPUT_FILENAME = "entry.txt";
const LONGEST_ALLOWED_LINE = 200;
const SHORTEST_ALLOWED_LINE = 1;
const MEETING_WORD = "meeting";
const LINE_END_MARK = ".";
const DOUBLE_SPACE_MARK = "  ";
const TAB_MARK = "\t";
const ABSOLUTE_PATH_MARK = "/";

// The opener: polite, brief, and it promises a reason. It spends four
// words and then gets out of the way, so the joke carries the line.
const EXCUSE_OPENER = "Sorry, I have a conflict:";

// The middle: the conflict is itself a meeting, and the meeting is about
// the very problem this excuse is solving. Every office worker has sat
// in this meeting, which is why the nod of recognition arrives here.
const EXCUSE_MIDDLE = "a meeting about all my other meetings,";

// The sting: the turn that earns the laugh. The meeting about meetings
// has an agenda; the meeting being skipped does not. One comparison, no
// extra words, and the pointless meeting convicts itself.
const EXCUSE_STING = "and unlike this one, it actually has an agenda.";

function squashWhitespace(rawLine: string): string {
  const splitWords = rawLine.split(/\s+/u);
  const keptWords = splitWords.filter((word) => word.length > 0);
  const squashedLine = keptWords.join(" ");
  return squashedLine;
}

function buildExcuseLine(): string {
  const fragments = [EXCUSE_OPENER, EXCUSE_MIDDLE, EXCUSE_STING];
  const joinedFragments = fragments.join(" ");
  const excuseLine = squashWhitespace(joinedFragments);
  return excuseLine;
}

function countVisibleCharacters(line: string): number {
  const characters = [...line];
  const visibleCount = characters.length;
  return visibleCount;
}

function countEncodedBytes(line: string): number {
  const encodedBytes = Buffer.byteLength(line, "utf8");
  return encodedBytes;
}

function countWords(line: string): number {
  const splitWords = line.split(" ");
  const keptWords = splitWords.filter((word) => word.length > 0);
  const wordCount = keptWords.length;
  return wordCount;
}

type ExcuseVerdict = {
  passes: boolean;
  faults: string[];
};

function checkExcuseLine(line: string): ExcuseVerdict {
  const faults: string[] = [];
  if (line.length < SHORTEST_ALLOWED_LINE) {
    faults.push("the line is empty");
  }
  if (line.length > LONGEST_ALLOWED_LINE) {
    faults.push("the line is longer than 200 characters");
  }
  if (line.trim().length === 0) {
    faults.push("the line is only whitespace");
  }
  if (line.includes("\n")) {
    faults.push("the line holds a newline");
  }
  if (line.includes("\r")) {
    faults.push("the line holds a carriage return");
  }
  if (line.includes(TAB_MARK)) {
    faults.push("the line holds a tab");
  }
  if (line !== line.trim()) {
    faults.push("the line has leading or trailing space");
  }
  if (line.includes(DOUBLE_SPACE_MARK)) {
    faults.push("the line holds a double space");
  }
  if (line.endsWith(LINE_END_MARK) === false) {
    faults.push("the line does not end with a full stop");
  }
  if (line.toLowerCase().includes(MEETING_WORD) === false) {
    faults.push("the line never names a meeting");
  }
  if (line.includes(EXCUSE_OPENER) === false) {
    faults.push("the line lost its opener");
  }
  if (line.includes(EXCUSE_MIDDLE) === false) {
    faults.push("the line lost its middle");
  }
  if (line.includes(EXCUSE_STING) === false) {
    faults.push("the line lost its sting");
  }
  const verdict: ExcuseVerdict = {
    passes: faults.length === 0,
    faults,
  };
  return verdict;
}

function writeExcuseLine(line: string): string {
  makeOutputFolder(OUTPUT_FOLDER, { recursive: true });
  const targetPath = joinPathPieces(OUTPUT_FOLDER, OUTPUT_FILENAME);
  writeTextToDisk(targetPath, line, "utf8");
  return targetPath;
}

function verifyWrittenLine(targetPath: string, expectedLine: string): boolean {
  const readBack = readWrittenText(targetPath, "utf8");
  const textMatched = readBack === expectedLine;
  const expectedBytes = countEncodedBytes(expectedLine);
  const readBytes = countEncodedBytes(readBack);
  const bytesMatched = readBytes === expectedBytes;
  const matched = textMatched && bytesMatched;
  return matched;
}

function reportRun(
  targetPath: string,
  excuseLine: string,
  matched: boolean,
): void {
  const characterCount = countVisibleCharacters(excuseLine);
  const byteCount = countEncodedBytes(excuseLine);
  const wordCount = countWords(excuseLine);
  console.log(`wrote ${characterCount} characters, ${byteCount} bytes (${wordCount} words) to ${targetPath}`);
  console.log(`read-back matches: ${matched}`);
  console.log(excuseLine);
}

function main(): number {
  if (OUTPUT_FOLDER.startsWith(ABSOLUTE_PATH_MARK) === false) {
    console.error("the output folder must be an absolute path");
    return 1;
  }
  const excuseLine = buildExcuseLine();
  const verdict = checkExcuseLine(excuseLine);
  if (verdict.passes === false) {
    const faultList = verdict.faults.join("; ");
    console.error(`excuse failed the gate: ${faultList}`);
    return 1;
  }
  const targetPath = writeExcuseLine(excuseLine);
  const matched = verifyWrittenLine(targetPath, excuseLine);
  if (matched === false) {
    console.error("the bytes on disk differ from the excuse line");
    return 1;
  }
  reportRun(targetPath, excuseLine, matched);
  return 0;
}

process.exitCode = main();
