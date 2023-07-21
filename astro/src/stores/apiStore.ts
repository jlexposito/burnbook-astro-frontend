import { persistentAtom } from '@nanostores/persistent'

type Tokens = {
    refresh: string;
    access: string;
}

export const $tokens = persistentAtom<Tokens>('tokens', {"refresh": "", "access": ""}, {
    encode: JSON.stringify,
    decode: JSON.parse,
})

export function updateTokens(tokens: Tokens) {
    $tokens.set(tokens);
}
  