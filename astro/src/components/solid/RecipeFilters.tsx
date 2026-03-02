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
    props.tags.map((tag) => ({
      original: tag,
      normalizedName: normalizeString(tag.name),
    })),
  );

  const filteredTags = createMemo(() => {
    const query = normalizeString(props.tagSearch.trim());
    return normalizedTags()
      .filter((tag) => tag.normalizedName.includes(query))
      .map((tag) => tag.original)
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  const selectedTags = createMemo(() =>
    filteredTags().filter((tag) => props.activeTags().includes(tag.name)),
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
      <div class="flex items-center gap-2 p-4 px-0 pb-1">
        <div class="relative flex-1">
          <label for="searchRecipes" class="sr-only">
            Search recipes
          </label>
          <input
            id="searchRecipes"
            name="searchRecipes"
            type="text"
            placeholder="Buscar recetas..."
            class="bg-secondary border-sm w-full rounded-sm border-1 bg-white px-3 py-2"
            value={props.search}
            onInput={(e) => props.setSearch(e.currentTarget.value)}
          />
          <Show when={props.search}>
            <button
              type="button"
              class="bk-accent-hover absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 text-lg text-gray-600 transition-transform duration-150"
              onClick={clearSearch}
            >
              &times;
            </button>
          </Show>
        </div>

        <button
          class="btn-primary flex items-center gap-2 rounded-md text-white"
          onClick={() => props.setOpen(!props.open)}
        >
          Filtros
          <span
            class="inline-block transition-transform duration-200"
            style={{
              transform: props.open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </button>
      </div>

      {/* Animated filter panel */}
      <div
        class={`overflow-hidden rounded-sm border bg-white shadow transition-[max-height,opacity,transform] duration-300 ease-out ${
          props.open
            ? "pointer-events-auto max-h-[500px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div class="max-h-[500px] space-y-4 overflow-y-auto p-4">
          {/* Cooking time filters */}
          <div class="flex gap-2">
            <div class="flex-1">
              <label for="minTimeFilter" class="mb-1 block font-semibold">
                Tiempo mínimo
              </label>
              <input
                id="minTimeFilter"
                name="minTimeFilter"
                type="number"
                placeholder="e.g., 10"
                class="w-full rounded-sm border px-3 py-2"
                value={props.minTime ?? ""}
                onInput={(e) =>
                  props.setMinTime(
                    e.currentTarget.value
                      ? parseInt(e.currentTarget.value)
                      : null,
                  )
                }
              />
            </div>
            <div class="flex-1">
              <label for="maxTimeFilter" class="mb-1 block font-semibold">
                Tiempo máximo
              </label>
              <input
                id="maxTimeFilter"
                name="maxTimeFilter"
                type="number"
                placeholder="e.g., 30"
                class="w-full rounded-sm border px-3 py-2"
                value={props.maxTime ?? ""}
                onInput={(e) =>
                  props.setMaxTime(
                    e.currentTarget.value
                      ? parseInt(e.currentTarget.value)
                      : null,
                  )
                }
              />
            </div>
          </div>

          {/* Tag search */}
          <div>
            <label for="tagSearch" class="mb-1 block font-semibold">
              Búsqueda por etiquetas
            </label>
            <div class="relative">
              <input
                id="tagSearch"
                name="tagSearch"
                type="text"
                placeholder="Buscar etiquetas..."
                class="mb-2 w-full rounded-sm border px-3 py-2"
                value={props.tagSearch}
                autocomplete="off"
                onInput={(e) => props.setTagSearch(e.currentTarget.value)}
              />
              <Show when={props.tagSearch}>
                <button
                  type="button"
                  class="absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 text-lg text-gray-600 transition-transform duration-150 hover:bg-gray-300 active:bg-gray-400"
                  onClick={clearTagSearch}
                >
                  &times;
                </button>
              </Show>
            </div>

            <Show when={filteredTags().length > 0}>
              <div>
                <h5 class="mb-1 font-semibold">Etiquetas disponibles</h5>

                <div class="tags flex flex-wrap gap-2">
                  <For each={filteredTags()}>
                    {(tag) => {
                      const isActive = () =>
                        props.activeTags().includes(tag.name);

                      return (
                        <button
                          onClick={() => props.toggleTag(tag.name)}
                          class="tag-square hover:cursor-pointer"
                          classList={{
                            "bk-accent": isActive(),
                            "bg-gray-200 text-black border-primary/20 hover:bg-gray-300":
                              !isActive(),
                          }}
                        >
                          {tag.name}
                        </button>
                      );
                    }}
                  </For>
                </div>
              </div>
            </Show>

            {/* Clear all filters button at the end */}
            <Show when={anyFilterActive()}>
              <div class="mt-4 flex justify-start">
                <button
                  class="btn-primary rounded-md text-white"
                  onClick={clearAllFilters}
                >
                  Limpiar filtros
                </button>
              </div>
            </Show>
          </div>
        </div>
      </div>
      {/* Selected tags */}
      <Show when={anyFilterActive() && !props.open}>
        <div class="mb-2 flex flex-wrap items-center gap-1 rounded-sm border border-gray-500 bg-white px-3 py-2 shadow">
          <span class="w-full uppercase underline underline-offset-2">
            Filtros activos
          </span>
          <Show when={props.search}>
            <span class="font-semibold">Búsqueda:</span>
            <span> {props.search} </span>
          </Show>
          <Show when={props.minTime != null}>
            <span class="font-semibold">Tiempo mínimo:</span>
            <span> {props.minTime} minutos</span>
          </Show>
          <Show when={props.maxTime != null}>
            <span class="font-semibold">Tiempo máximo:</span>
            <span> {props.maxTime} minutos</span>
          </Show>
          <Show when={selectedTags().length > 0}>
            <span class="font-semibold">Etiquetas seleccionadas:</span>
            <div class="tags flex max-h-[15lvh] flex-wrap gap-2 overflow-y-auto py-2 md:max-h-[15lvh]">
              <For each={selectedTags()}>
                {(tag) => (
                  <span class="tag-rounded">
                    {tag.name}

                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`Remove ${tag.name}`}
                      onClick={() => props.toggleTag(tag.name)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          props.toggleTag(tag.name);
                        }
                      }}
                      class="tag-remove"
                    >
                      ×
                    </span>
                  </span>
                )}
              </For>
            </div>
          </Show>
          {/* Clear all filters button at the end */}
          <div class="mb-1 ml-auto flex justify-end">
            <button class="btn-accent rounded-md" onClick={clearAllFilters}>
              Limpiar filtros
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}
