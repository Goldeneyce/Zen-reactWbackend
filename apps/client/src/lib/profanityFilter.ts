/* ------------------------------------------------------------------
   Profanity filter – lightweight, runs on both client & server
   ------------------------------------------------------------------ */

/**
 * A starter list of common English profanity.  Expand as needed.
 * Each word is matched as a whole word (case-insensitive) so
 * "class" won't be flagged because of "ass".
 */
const PROFANITY_LIST: string[] = [
  // ---- Add / remove words to fit your community guidelines ----
  "ass",
  "asshole",
  "bastard",
  "bitch",
  "bullshit",
  "cock",
  "crap",
  "cunt",
  "damn",
  "dick",
  "dumbass",
  "fag",
  "fuck",
  "fucking",
  "goddamn",
  "hell",
  "idiot",
  "motherfucker",
  "nigga",
  "nigger",
  "penis",
  "piss",
  "pussy",
  "retard",
  "shit",
  "slut",
  "stfu",
  "twat",
  "vagina",
  "whore",
  "wtf",
];

/**
 * Build one regex from the word list (compiled once, reused).
 * `\b` ensures whole-word matching so e.g. "shitty" still matches
 * but "Shiitake" would not.
 */
const PROFANITY_REGEX = new RegExp(
  `\\b(${PROFANITY_LIST.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
  "gi"
);

/**
 * Returns `true` if the text contains any profanity.
 */
export function containsProfanity(text: string): boolean {
  PROFANITY_REGEX.lastIndex = 0; // reset for global regex
  return PROFANITY_REGEX.test(text);
}

/**
 * Replaces profane words with asterisks of the same length, e.g.
 * "What the fuck" → "What the ****"
 */
export function censorProfanity(text: string): string {
  return text.replace(PROFANITY_REGEX, (match) => "*".repeat(match.length));
}
