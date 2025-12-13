import { createSignal, createMemo, For, onMount } from "solid-js";
import type { RecipeInterface } from "@utils/interfaces";
import RecipeCard from "./RecipeCard";
import RecipeFilters from "./RecipeFilters";
import { getTags } from "@utils/api";

export default function RecipePage(props: { recipes: RecipeInterface[] }) {
  // ---- Filters state ----
  //TODO: revert to false
  const [open, setOpen] = createSignal(false);
  const [search, setSearch] = createSignal("");
  const [tagSearch, setTagSearch] = createSignal("");
  const [activeTags, setActiveTags] = createSignal<string[]>([]);
  const [maxTime, setMaxTime] = createSignal<number | null>(null);

  // ---- Pagination ----
  const ROWS_PER_LOAD = 4;
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
  const [tags, setTags] = createSignal<string[]>([]);
  onMount(async () => {
    const apiTags = await getTags();
    setTags(apiTags.map((t) => t.name));
  });

  onMount(() => {
    const resizeHandler = () => setColumns(getColumns());
    window.addEventListener("resize", resizeHandler);

    const scrollHandler = () => {
      const scrollPos = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      if (
        scrollPos > pageHeight - 300 &&
        recipesToRender().length < filteredRecipes().length
      ) {
        setVisibleRows((v) => v + ROWS_PER_LOAD);
      }
    };
    window.addEventListener("scroll", scrollHandler);

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
        activeTags().length === 0 || activeTags().some((t) => r.tags.includes(t));
      const timeOk = !maxTime() || r.cooking_time <= maxTime();
      return nameOk && tagsOk && timeOk;
    })
  );

  // ---- Recipes to render (pagination) ----
  const recipesToRender = createMemo(() => {
    const max = visibleRows() * columns();
    return filteredRecipes().slice(0, max);
  });

  const toggleTag = (tag: string) =>
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  return (
    <>
      <div class="mx-3 my-6 pb-4 2xl:mx-12">
        <RecipeFilters
          open={open()}
          setOpen={setOpen}
          search={search()}
          setSearch={setSearch}
          tagSearch={tagSearch()}
          setTagSearch={setTagSearch}
          activeTags={activeTags}       // <-- pass the signal itself
          toggleTag={toggleTag}
          maxTime={maxTime()}
          setMaxTime={setMaxTime}
          tags={tags()}
        />

        {/* Recipes grid */}
        <div class="recipes grid gap-4 mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-fr">
          <For each={recipesToRender()}>
            {(recipe) => <RecipeCard recipe={recipe} lazyLoad />}
          </For>
        </div>
      </div>
      
    </>
  );
}
