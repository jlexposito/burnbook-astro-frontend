import { createEffect } from "solid-js";
import { createStore, type SetStoreFunction, type Store } from "solid-js/store";

function isServer() {
  return (typeof window === 'undefined')
}

export function createLocalStore<T extends object>(
  name: string,
  init: T,
): [Store<T>, SetStoreFunction<T>] {
  const localState = !isServer ? localStorage.getItem(name) : null;
  const [state, setState] = createStore<T>(
    localState ? JSON.parse(localState) : init,
  );
  createEffect(() => {
    if(isServer) return;
    localStorage.setItem(name, JSON.stringify(state));
  });
  return [state, setState];
}
