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
  /* ------------------------------------------------------------------ */
  /* Normalized tags                                                     */
  /* ------------------------------------------------------------------ */
  const normalizedTags = createMemo(() =>
    props.tags.map(tag => ({
      tag,
      normalizedName: normalizeString(tag.name),
    }))
  );

  /* ------------------------------------------------------------------ */
  /* Filter + sort: highlighted first, then alphabetical               */
  /* ------------------------------------------------------------------ */
  const sortedFilteredTags = createMemo(() => {
    const query = normalizeString(props.tagSearch.trim());

    return normalizedTags()
      .filter(t => t.normalizedName.includes(query))
      .sort((a, b) => {
        if (a.tag.highlighted !== b.tag.highlighted) return a.tag.highlighted ? -1 : 1;
        return a.normalizedName.localeCompare(b.normalizedName);
      })
      .map(t => t.tag);
  });

  /* ------------------------------------------------------------------ */
  /* Selected / unselected tags                                           */
  /* ------------------------------------------------------------------ */
  const selectedTags = createMemo(() =>
    sortedFilteredTags().filter(tag => props.activeTags().includes(tag.name))
  );

  const unselectedTags = createMemo(() =>
    sortedFilteredTags().filter(tag => !props.activeTags().includes(tag.name))
  );

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ */
  /* UI                                                                  */
  /* ------------------------------------------------------------------ */
  return (
    <div class="sticky top-0 z-10 flex flex-col">
      {/* Search + toggle */}
      <div class="p-4 pb-1 px-0 flex gap-2 items-center">
        <div class="relative flex-1">
          <input
            type="text"
            placeholder="Buscar recetas..."
            class="w-full bg-white border-1 bg-secondary px-3 py-2 border-sm rounded-sm"
            value={props.search}
            onInput={e => props.setSearch(e.currentTarget.value)}
          />
          <Show when={props.search}>
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full w-6 h-6"
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

      {/* Filters panel */}
      <div
        class={`overflow-hidden border rounded-sm bg-white shadow transition-all duration-300 ${
          props.open
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div class="p-4 space-y-4 max-h-[500px] overflow-y-auto">
          {/* Tag search */}
          <div>
            <input
              type="text"
              placeholder="Search tags..."
              class="w-full px-3 py-2 border rounded-sm mb-2"
              value={props.tagSearch}
              onInput={e => props.setTagSearch(e.currentTarget.value)}
            />
            <Show when={props.tagSearch}>
              <button
                class="absolute right-6 top-[122px] bg-gray-200 rounded-full w-6 h-6"
                onClick={clearTagSearch}
              >
                &times;
              </button>
            </Show>

            {/* Selected */}
            <Show when={selectedTags().length > 0}>
              <div class="mb-2">
                <h5 class="font-semibold mb-1">Seleccionadas</h5>
                <div class="flex flex-wrap gap-2">
                  <For each={selectedTags()}>
                    {tag => (
                      <button
                        class="px-3 py-1 rounded-sm border btn-accent"
                        onClick={() => props.toggleTag(tag.name)}
                      >
                        {tag.name}
                      </button>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            {/* Unselected */}
            <Show when={unselectedTags().length > 0}>
              <div>
                <h5 class="font-semibold mb-1">Disponibles</h5>
                <div class="flex flex-wrap gap-2">
                  <For each={unselectedTags()}>
                    {tag => (
                      <button
                        class="px-3 py-1 rounded-sm border bg-gray-200"
                        onClick={() => props.toggleTag(tag.name)}
                      >
                        {tag.name}
                      </button>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            {/* Clear */}
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