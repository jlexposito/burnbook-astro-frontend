import { atom } from 'nanostores'
import { createLocalStore } from '@utils/stores';

const [localTagFilter, setLocalTagFilter] = createLocalStore<string[]>("localTagFilter", []);

export const filterTags: string[] = atom(localTagFilter as string[]);

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

