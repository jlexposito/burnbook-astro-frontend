import { useStore } from '@nanostores/solid';
import { filterTags } from '../../utils/recipeStore';

import { 
    For,
    onMount,
    createSignal,
    Show 
} from "solid-js";

import { RecipeType } from '../../utils/interfaces';
import RecipeCard from './RecipeCard';

export default function Recipes(props: {recipesdata: Array<RecipeType> | null}) {
    const [recipes, setRecipesData] = createSignal([]);
    const $activeFilter = useStore(filterTags); 

    onMount(() => {
        setRecipesData(props.recipesdata);
    })

    function isVisible(recipe: RecipeType) {
        if (!$activeFilter().length)
            return true
        return $activeFilter().some(r=> recipe.tags.includes(r))
    }

    return (
     <>
        <Show when={recipes() && recipes().length > 0}>
        <div class="pb-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 gap-y-5 md:gap-5 lg:gap-6 my-6 mx-3 lg:mx-6 2xl:mx-12">
            <For each={recipes()}>
                {(recipe) => 
                <>
                    <Show when={isVisible(recipe)}>
                        <RecipeCard recipe={recipe} />
                    </Show>
                </>
                }
            </For>
        </div>
        </Show>
        <Show when={recipes() == null}>
            <div class="text-lg w-full flex h-screen">
                <p class="m-auto">Something went wrong, please refresh the page</p>
            </div>
        </Show>
     </>   
    )
}