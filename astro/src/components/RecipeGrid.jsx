import { useStore } from '@nanostores/solid';
import { filterTags, recipes } from '../recipeStore';

import { For, onMount, createResource, Show } from "solid-js";
import RecipeCard from './RecipeCard.tsx';

export default function Recipes() {
    const $recipes = useStore(recipes);
    const $ActiveFilter = useStore(filterTags);

    function isVisible(recipe) {
        console.log($ActiveFilter());
        return true;
    }

    return (
     <>
        <div class="pb-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 gap-y-5 md:gap-5 lg:gap-6 my-6 mx-3 lg:mx-6 2xl:mx-12">
            <For each={$recipes()}>
                {(recipe) => 
                <>
                    {isVisible(recipe)}
                    <RecipeCard recipe={recipe} />
                </>
                }
            </For>
        </div>
     </>   
    )
}