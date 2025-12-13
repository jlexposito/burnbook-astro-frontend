import { createMemo } from "solid-js";
import type { RecipeInterface } from "@utils/interfaces";
import { filters } from "@stores/recipeFilters";
import { createDebouncedSignal } from "@utils/debounce";

export function useFilteredRecipes(recipes: RecipeInterface[]) {
  const debouncedSearch = createDebouncedSignal(() => filters().search, 300);

  return createMemo(() => {
    const search = debouncedSearch().toLowerCase();
    const f = filters();

    return recipes.filter(r => {
      if (search && !r.title.toLowerCase().includes(search)) return false;
      if (f.activeTags.length && !f.activeTags.some(t => r.tags.includes(t))) return false;
      if (f.maxTime !== null && r.cooking_time > f.maxTime) return false;
      return true;
    });
  });
}
