import { atom } from 'nanostores'
import { createLocalStore } from '@utils/stores';

export const [loaclApiTokens, setApiTokens] = createLocalStore<string[]>("tokens", {});
export const apiTokens: string[] = atom(loaclApiTokens as string[]);
