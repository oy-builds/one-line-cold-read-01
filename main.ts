// One Line, One Laugh — entry generator.
//
// Writes one single-line joke to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output/entry.txt), checks it against the competition gate
// (UTF-8, 1-140 chars, one line, no surrounding whitespace), then reads
// the file back and confirms it matches byte for byte.
// Node 22, standard library only.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MIN_CHARS = 1;
const MAX_CHARS = 140;

const ENTRY_LINE =
  "My printer only jams on important documents, which is how I know it can read.";

function die(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function checkGate(text: string): void {
  const len = [...text].length; // count code points, not UTF-16 units
  if (len < MIN_CHARS || len > MAX_CHARS) {
    die(`entry is ${len} characters, must be ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (text !== text.trim()) die("entry has leading or trailing whitespace");
  if (text.includes("\n") || text.includes("\r")) {
    die("entry must be a single line");
  }
  if (Buffer.from(text, "utf8").toString("utf8") !== text) {
    die("entry is not clean UTF-8 text");
  }
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outputFile = join(outputDir, "entry.txt");

checkGate(ENTRY_LINE);
mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, ENTRY_LINE, "utf8");

const readBack = readFileSync(outputFile, "utf8");
if (readBack !== ENTRY_LINE) die("read-back mismatch: text differs");
const readBytes = readFileSync(outputFile);
if (!readBytes.equals(Buffer.from(ENTRY_LINE, "utf8"))) {
  die("read-back mismatch: bytes differ");
}

console.log(
  `wrote ${outputFile} (${[...ENTRY_LINE].length} chars, ${readBytes.length} bytes)`,
);
console.log(readBack);
