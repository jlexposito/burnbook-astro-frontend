import { atom } from 'nanostores'

export const recipes = atom([]);
export function setRecipes(data) {
    recipes.set(data);
}

export const tags = atom([]);
export function setTags(data) {
    tags.set(data);
}
export const filterTags = atom([]);
export function setFilterTags(data) {
    let appliedFilters = filterTags.get();
    const index = appliedFilters.indexOf(data);
    // remove if already exists
    if (index != -1) {
        appliedFilters.splice(index, 1);
        filterTags.set(filterTags.get());
    } else {
        filterTags.set([...appliedFilters, data]);
    }
}
