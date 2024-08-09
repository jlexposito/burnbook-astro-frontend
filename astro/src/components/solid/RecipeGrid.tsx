import type { CollectionEntry } from 'astro:content'

import { useStore } from "@nanostores/solid";
import { filterTags } from "@stores/recipeStore";
import { isMobileDevice } from "@utils/mobileHelper";

import { For, onMount, createSignal, Show } from "solid-js";

import RecipeCard from "@solidcomponents/RecipeCard";

export default function Recipes(props: {
  recipesdata: CollectionEntry<'recipes'>[]| null;
}) {
  const [recipes, setRecipesData] = createSignal([]);
  const $activeFilter = useStore(filterTags);

  onMount(() => {
    setRecipesData(props.recipesdata);
  });

  function isVisible(recipe: CollectionEntry<'recipes'>) {
    if (!$activeFilter().length) return true;
    return $activeFilter().some((r) => recipe.data.tags.includes(r));
  }

  const lazyLoadStartIndex = (): number => {
    if (isMobileDevice) {
      return 6;
    }
    return 20;
  };

  return (
    <>
      <Show when={recipes() && recipes().length > 0}>
        <div class="mx-3 my-6 grid grid-cols-1 gap-4 gap-y-5 pb-4 md:grid-cols-2 md:gap-5 lg:mx-6 lg:gap-6 xl:grid-cols-3 2xl:mx-12 2xl:grid-cols-4">
          <For each={recipes()}>
            {(recipe, index) => (
              <>
                <Show when={isVisible(recipe)}>
                  <RecipeCard
                    lazyLoad={index() + 1 > lazyLoadStartIndex()}
                    recipe={recipe}
                  />
                </Show>
              </>
            )}
          </For>
        </div>
      </Show>
      <Show when={recipes() == null}>
        <div class="flex h-screen w-full text-lg">
          <p class="m-auto">Something went wrong, please refresh the page</p>
        </div>
      </Show>
    </>
  );
}
