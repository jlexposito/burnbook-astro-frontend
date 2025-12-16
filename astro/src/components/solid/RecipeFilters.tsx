import type { Tag } from "@utils/interfaces";
import { createMemo, For, Show } from "solid-js";

interface RecipeFiltersProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  search: string;
  setSearch: (v: string) => void;
  tagSearch: string;
  setTagSearch: (v: string) => void;
  activeTags: () => string[];        // <-- pass signal function, not value
  toggleTag: (tag: string) => void;
  maxTime: number | null;
  setMaxTime: (v: number | null) => void;
  tags: Tag[];
}

export default function RecipeFilters(props: RecipeFiltersProps) {
  const visibleTags = createMemo(() => {
    const query = props.tagSearch.toLowerCase().trim();

    return [...props.tags]
      .sort((a, b) => {
        if (a.highligthed !== b.highligthed) {
          return a.highligthed ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      })
      .filter(tag =>
        tag.name.toLowerCase().includes(query)
      );
  });

  const clearSearch = () => props.setSearch("");
  const clearTagSearch = () => props.setTagSearch("");

  return (
    <div>
      {/* Search + filter toggle */}
      <div class="flex gap-2 my-4">
        <div class="relative flex-1">
          <label for="searchRecipes" class="sr-only">Search recipes</label>
          <input
            id="searchRecipes"
            name="searchRecipes"
            type="text"
            placeholder="Buscar recetas..."
            class="w-full px-3 py-2 border rounded-sm"
            value={props.search}
            onInput={(e) => props.setSearch(e.currentTarget.value)}
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
          class="px-3 py-2 bg-blue-500 text-white rounded-sm btn-primary"
          onClick={() => props.setOpen(!props.open)}
        >
          Filtros
        </button>
      </div>

      {/* Animated filter panel */}
      <div
        class={`overflow-hidden border rounded-sm bg-white shadow transition-[max-height,opacity,transform] duration-300 ease-out ${
          props.open
            ? "max-h-[500px] opacity-100 translate-y-0 pointer-events-auto"
            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div class="p-4 space-y-4 max-h-[500px] overflow-y-auto">
          {/* Max cooking time */}
          <div>
            <label for="timeFilter" class="block mb-1 font-semibold">
              Tiempo de preparación (minutos)
            </label>
            <input
              id="timeFilter"
              name="timeFilter"
              type="number"
              placeholder="e.g., 30"
              class="w-full px-3 py-2 border rounded-sm"
              value={props.maxTime ?? ""}
              onInput={(e) =>
                props.setMaxTime(
                  e.currentTarget.value ? parseInt(e.currentTarget.value) : null
                )
              }
            />
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
                onInput={(e) => props.setTagSearch(e.currentTarget.value)}
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

            <div class="tags px-2 py-4 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              <For each={visibleTags()}>
                {(tag) => (
                  <button
                    classList={{
                      "px-3 py-1 border rounded-sm transition-transform duration-150": true,
                      "btn-accent hover:ring-secondary-dark-ring":
                        props.activeTags().includes(tag.name), // <-- use signal function
                      "bg-gray-200 text-black hover:bg-gray-300":
                        !props.activeTags().includes(tag.name),
                    }}
                    onClick={() => props.toggleTag(tag.name)}
                  >
                    {tag.name}
                  </button>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
