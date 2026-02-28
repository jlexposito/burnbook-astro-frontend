import type { Tag } from "@utils/interfaces";
import { createMemo, For, Show } from "solid-js";

interface RecipeFiltersProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  search: string;
  setSearch: (v: string) => void;
  tagSearch: string;
  setTagSearch: (v: string) => void;
  activeTags: () => string[];
  setActiveTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  minTime: number | null;
  setMinTime: (v: number | null) => void;
  maxTime: number | null;
  setMaxTime: (v: number | null) => void;
  tags: Tag[];
}

// Normalize strings: lowercase + remove diacritics
function normalizeString(str: string) {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export default function RecipeFilters(props: RecipeFiltersProps) {
  const normalizedTags = createMemo(() =>
    props.tags.map(tag => ({
      original: tag,
      normalizedName: normalizeString(tag.name),
    }))
  );

  const filteredTags = createMemo(() => {
    const query = normalizeString(props.tagSearch.trim());
    return normalizedTags()
      .filter(tag => tag.normalizedName.includes(query))
      .map(tag => tag.original);
  });

  const selectedTags = createMemo(() =>
    filteredTags().filter(tag => props.activeTags().includes(tag.name))
  );

  const unselectedTags = createMemo(() =>
    filteredTags().filter(tag => !props.activeTags().includes(tag.name))
  );

  const clearSearch = () => props.setSearch("");
  const clearTagSearch = () => props.setTagSearch("");

  const anyFilterActive = () =>
    props.search ||
    props.tagSearch ||
    props.activeTags().length > 0 ||
    props.minTime != null ||
    props.maxTime != null;

  const clearAllFilters = () => {
    props.setSearch("");
    props.setTagSearch("");
    props.setActiveTags([]);
    props.setMinTime(null);
    props.setMaxTime(null);
  };

  return (
    <div class="sticky top-0 z-10 flex flex-col">
      {/* Sticky search + filter toggle */}
      <div class="p-4 pb-1 px-0 flex gap-2 items-center">
        <div class="relative flex-1">
          <label for="searchRecipes" class="sr-only">
            Search recipes
          </label>
          <input
            id="searchRecipes"
            name="searchRecipes"
            type="text"
            placeholder="Buscar recetas..."
            class="w-full bg-white border-1 bg-secondary px-3 py-2 border-sm rounded-sm"
            value={props.search}
            onInput={e => props.setSearch(e.currentTarget.value)}
          />
          <Show when={props.search}>
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-lg transition-transform duration-150"
              onClick={clearSearch}
            >
              &times;
            </button>
          </Show>
        </div>

        <button
          class="btn-primary text-white rounded-md"
          onClick={() => props.setOpen(!props.open)}
        >
          Filtros
        </button>
      </div>

      {/* Animated filter panel */}
      <div
        class={`overflow-hidden border rounded-sm bg-white shadow transition-[max-height,opacity,transform] duration-300 ease-out ${
          props.open
            ? "max-h-[500px] opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div class="p-4 space-y-4 max-h-[500px] overflow-y-auto">
          {/* Cooking time filters */}
          <div class="flex gap-2">
            <div class="flex-1">
              <label for="minTimeFilter" class="block mb-1 font-semibold">
                Tiempo mínimo (min)
              </label>
              <input
                id="minTimeFilter"
                name="minTimeFilter"
                type="number"
                placeholder="e.g., 10"
                class="w-full px-3 py-2 border rounded-sm"
                value={props.minTime ?? ""}
                onInput={e =>
                  props.setMinTime(
                    e.currentTarget.value ? parseInt(e.currentTarget.value) : null
                  )
                }
              />
            </div>
            <div class="flex-1">
              <label for="maxTimeFilter" class="block mb-1 font-semibold">
                Tiempo máximo (min)
              </label>
              <input
                id="maxTimeFilter"
                name="maxTimeFilter"
                type="number"
                placeholder="e.g., 30"
                class="w-full px-3 py-2 border rounded-sm"
                value={props.maxTime ?? ""}
                onInput={e =>
                  props.setMaxTime(
                    e.currentTarget.value ? parseInt(e.currentTarget.value) : null
                  )
                }
              />
            </div>
          </div>

          {/* Tag search */}
          <div>
            <label for="tagSearch" class="block mb-1 font-semibold">
              Búsqueda por etiquetas
            </label>
            <div class="relative">
              <input
                id="tagSearch"
                name="tagSearch"
                type="text"
                placeholder="Search tags..."
                class="w-full px-3 py-2 border rounded-sm mb-2"
                value={props.tagSearch}
                onInput={e => props.setTagSearch(e.currentTarget.value)}
              />
              <Show when={props.tagSearch}>
                <button
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-lg transition-transform duration-150"
                  onClick={clearTagSearch}
                >
                  &times;
                </button>
              </Show>
            </div>

            {/* Selected tags */}
            <Show when={selectedTags().length > 0}>
              <div class="mb-2">
                <h5 class="font-semibold mb-1">Seleccionadas</h5>
                <div class="tags flex flex-wrap gap-2">
                  <For each={selectedTags()}>
                    {tag => (
                      <button
                        class="px-3 py-1 rounded-sm border-1 border-primary/20 btn-accent hover:ring-secondary-dark-ring"
                        onClick={() => props.toggleTag(tag.name)}
                      >
                        {tag.name}
                      </button>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            {/* Unselected tags */}
            <Show when={unselectedTags().length > 0}>
              <div>
                <h5 class="font-semibold mb-1">Disponibles</h5>
                <div class="tags flex flex-wrap gap-2">
                  <For each={unselectedTags()}>
                    {tag => (
                      <button
                        class="px-3 py-1 rounded-sm border-1 border-primary/20 bg-gray-200 text-black hover:bg-gray-300"
                        onClick={() => props.toggleTag(tag.name)}
                      >
                        {tag.name}
                      </button>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            {/* Clear all filters button at the end */}
            <Show when={anyFilterActive()}>
              <div class="mt-4 flex justify-end">
                <button
                  class="btn-primary text-white rounded-md"
                  onClick={clearAllFilters}
                >
                  Limpiar filtros
                </button>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}