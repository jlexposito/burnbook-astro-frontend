import { atom } from 'nanostores'
import { createEffect } from "solid-js";
import { 
    createStore, 
    SetStoreFunction, 
    Store 
} from "solid-js/store";

const [localTagFilter, setLocalTagFilter] = createLocalStore<string[]>("localTagFilter", []);

export const filterTags = atom(localTagFilter as Array<string>);

export function updateTagFilter(tagname: string) { 
    const index = filterTags.get().indexOf(tagname);
    // remove if already exists
    if (index != -1) {
        let appliedFilters = [...filterTags.get()]
        // remove element
        appliedFilters.splice(index, 1);
        filterTags.set(appliedFilters);
    } else {
        filterTags.set([...filterTags.get(), tagname]);
    }
    console.log(filterTags.get())
}

export function clearTagFilters() {
    filterTags.set([]);
}

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

