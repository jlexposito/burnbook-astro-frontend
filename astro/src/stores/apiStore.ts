import type { Tokens } from "@utils/interfaces";
import { persistentAtom } from "@nanostores/persistent";

export const $tokens = persistentAtom<Tokens>(
  "tokens",
  { refresh: "", access: "" },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export function updateTokens(tokens: Tokens) {
  $tokens.set(tokens);
}
