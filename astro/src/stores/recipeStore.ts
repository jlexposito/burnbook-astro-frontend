import { WritableAtom, atom } from 'nanostores'
import { createLocalStore } from '@stores/stores';
import { persistentAtom } from '@nanostores/persistent';

const [localTagFilter, setLocalTagFilter] = createLocalStore<string[]>("localTagFilter", []);

export const filterTags: WritableAtom<string[]> = atom(localTagFilter as string[]);

export function updateTagFilter(tagname: string) { 
    const index = filterTags.get().indexOf(tagname);
    // remove if already exists
    if (index != -1) {
      let appliedFilters : string[] = [...filterTags.get()]
      // remove element
      appliedFilters.splice(index, 1);
      setLocalTagFilter(appliedFilters);
    } else {
      setLocalTagFilter([...filterTags.get(), tagname]);
    }
}

export function clearTagFilters() {
  setLocalTagFilter([]);
}

export const $filters = persistentAtom<string[]>('filters', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
})

export function updateFilterPersistent(tagname: string) {
  const index = $filters.get().indexOf(tagname);
    // remove if already exists
    if (index != -1) {
      let appliedFilters : string[] = [...$filters.get()]
      // remove element
      appliedFilters.splice(index, 1);
      $filters.set(appliedFilters);
    } else {
      $filters.set([...$filters.get(), tagname]);
    }
}
