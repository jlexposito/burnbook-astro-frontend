import { createSignal, createMemo, createEffect, For, onMount } from "solid-js";

import { getTags } from "@utils/api";
import type { RecipeInterface, Tag } from "@utils/interfaces";
import { isMobileDevice } from "@utils/mobileHelper";

import RecipeCard from "@solidcomponents/RecipeCard";
import RecipeFilters from "@solidcomponents/RecipeFilters";

export default function RecipePage(props: { recipes: RecipeInterface[] }) {
  // ---- Filters state ----
  const [open, setOpen] = createSignal(false);
  const [search, setSearch] = createSignal("");
  const [tagSearch, setTagSearch] = createSignal("");
  const [activeTags, setActiveTags] = createSignal<string[]>([]);
  const [maxTime, setMaxTime] = createSignal<number | null>(null);

  // ---- Layout constants ----
  const ROWS_PER_LOAD = 4;
  const CARD_HEIGHT = 220;
  const TOP_OFFSET = 100;
  const EXTRA_ROWS = 1;

  // ---- Pagination ----
  const [visibleRows, setVisibleRows] = createSignal(ROWS_PER_LOAD);

  const getColumns = () => {
    if (typeof window === "undefined") return 1;
    const w = window.innerWidth;
    if (w < 768) return 1;
    if (w < 1024) return 2;
    if (w < 1280) return 3;
    return 4;
  };

  const [columns, setColumns] = createSignal(getColumns());

  // ---- Tags ----
  const [tags, setTags] = createSignal<Tag[]>([]);

  onMount(async () => {
    const apiTags = await getTags();
    setTags(apiTags);
  });

  // ---- Helpers ----
  const lazyLoadStartIndex = (): number => {
    return isMobileDevice() ? 5 : 20;
  };

  const highFetchPriorityIndex = (): number => {
    return isMobileDevice() ? 3 : 8;
  };

  const calculateInitialRows = (): number => {
    if (typeof window === "undefined") return ROWS_PER_LOAD;

    const height = document.documentElement.clientHeight;
    const usableHeight = Math.max(0, height - TOP_OFFSET);

    return Math.max(
      Math.ceil(usableHeight / CARD_HEIGHT) + EXTRA_ROWS,
      ROWS_PER_LOAD
    );
  };

  // ---- Mount logic ----
  const [savedScrollY, setSavedScrollY] = createSignal(0);

  onMount(() => {
    // Initial pagination (only once)
    setVisibleRows((v) => Math.max(v, calculateInitialRows()));

    const resizeHandler = () => {
      const newColumns = getColumns();

      // Only react if columns actually change
      if (newColumns !== columns()) {
        setColumns(newColumns);

        // NEVER shrink visibleRows on resize
        setVisibleRows((v) => Math.max(v, calculateInitialRows()));
      }
    };

    const scrollHandler = () => {
      setSavedScrollY(window.scrollY);

      const scrollPos = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      if (
        scrollPos > pageHeight - 300 &&
        recipesToRender().length < filteredRecipes().length
      ) {
        setVisibleRows((v) => v + ROWS_PER_LOAD);
      }
    };

    window.addEventListener("resize", resizeHandler);
    window.addEventListener("scroll", scrollHandler);

    // Restore scroll after remount (mobile browsers)
    queueMicrotask(() => {
      window.scrollTo(0, savedScrollY());
    });

    return () => {
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("scroll", scrollHandler);
    };
  });

  // ---- Filtered recipes ----
  const filteredRecipes = createMemo(() =>
    props.recipes.filter((r) => {
      const nameOk = r.title.toLowerCase().includes(search().toLowerCase());
      const tagsOk =
        activeTags().length === 0 ||
        activeTags().some((t) => r.tags.includes(t));
      const timeOk = !maxTime() || r.cooking_time <= maxTime();
      return nameOk && tagsOk && timeOk;
    })
  );

  // ---- Recipes to render ----
  const recipesToRender = createMemo(() => {
    const max = visibleRows() * columns();
    return filteredRecipes().slice(0, max);
  });

  const toggleTag = (tag: string) =>
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  // ---- Optional: scroll-to-top on filter (comment/uncomment as desired) ----
  // createEffect(() => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // });

  return (
    <>
      <div role="main" class="mx-3 my-6 pb-4 2xl:mx-12">
        <RecipeFilters
          open={open()}
          setOpen={setOpen}
          search={search()}
          setSearch={setSearch}
          tagSearch={tagSearch()}
          setTagSearch={setTagSearch}
          activeTags={activeTags}
          toggleTag={toggleTag}
          maxTime={maxTime()}
          setMaxTime={setMaxTime}
          tags={tags()}
        />

        {/* Recipes grid */}
        <div
          role="main"
          class="recipes grid gap-4 mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-fr"
        >
          <For each={recipesToRender()}>
            {(recipe, index) => (
              <RecipeCard
                recipe={recipe}
                lazyLoad={index() + 1 > lazyLoadStartIndex()}
                highFetchPriority={index() + 1 <= highFetchPriorityIndex()}
              />
            )}
          </For>
        </div>
      </div>
    </>
  );
}
