import { createEffect } from "solid-js";
import { 
    createStore, 
    SetStoreFunction, 
    Store 
} from "solid-js/store";

export function createLocalStore<T extends object>(
    name: string,
    init: T
  ): [Store<T>, SetStoreFunction<T>] {
    const localState = typeof window !== 'undefined' ? localStorage.getItem(name) : null
    const [state, setState] = createStore<T>(
      localState ? JSON.parse(localState) : init
    );
    createEffect(() => localStorage.setItem(name, JSON.stringify(state)));
    return [state, setState];
  }
  
  