import {
  createMemo,
  createResource,
  createSignal,
  createUniqueId,
  For,
  Show,
} from "solid-js";

import type {
  Accessor,
  JSX,
  ResourceReturn,
} from "solid-js";

// Utils
import {
  createSelectOptions,
  removeElement,
} from "@solidcomponents/formComponents/utils";
import type {
  RecipeIngredient,
  RecipeInterface,
  recipeIngredientFormValue,
  Ingredient,
  Unit,
  ComboboxOption,
  formValues
} from "@utils/interfaces";
import { getIngredients, getUnits } from "@utils/api";

// Components
import RecipeIngredientForm from "@solidcomponents/formComponents/RecipeIngredientForm";

export default function IngredientsForm(props: { recipe?: RecipeInterface }) {
  const recipe = props.recipe;

  // units
  const [unitOptions]: ResourceReturn<Unit[]> = createResource(getUnits);
  const selectOptionsUnits: Accessor<ComboboxOption[]> = createMemo(() =>
    createSelectOptions(unitOptions),
  );

  const ingredientFormElement = (
    ingredientData?: RecipeIngredient,
  ): recipeIngredientFormValue => {
    if (ingredientData?.quantity < 0) ingredientData.quantity = 0;
    return {
      id: createUniqueId(),
      ingredient: ingredientData,
    };
  };

  // Ingredients
  const [existingIngredients]: ResourceReturn<Ingredient[]> =
    createResource(getIngredients);
  const selectOptionsIngredients: Accessor<ComboboxOption[]> = createMemo(() =>
    createSelectOptions(existingIngredients),
  );
  let numberOfInitialIngredients: number = 1;
  let initialIngredients: formValues[] = [];

  // Add recipe ingredients
  const recipeIngredients: RecipeIngredient[] = recipe?.ingredients;
  if (recipeIngredients) {
    numberOfInitialIngredients = 0;
    // add ingredient form
    for (let i = 0; i < recipeIngredients.length; i++) {
      initialIngredients.push(ingredientFormElement(recipeIngredients[i]));
    }
  }

  // Add blank ingredients
  for (let i = 0; i < numberOfInitialIngredients; i++) {
    initialIngredients.push(ingredientFormElement());
  }

  const [ingredients, setIngredients] =
    createSignal<formValues[]>(initialIngredients);

  const newRecipeForm = (ingredient?: Ingredient): void => {
    let newIngredient: recipeIngredientFormValue = ingredientFormElement();
    if (typeof ingredient !== "undefined") {
      // hack, we dont specify quantitiy to avoid showing
      let ingredientData = {
        unit: "",
        ingredient: {
          ...ingredient,
        },
      };
      newIngredient = ingredientFormElement(ingredientData);
    }
    setIngredients([...ingredients(), newIngredient]);
  };

  const addNewRecipeIngredient: JSX.EventHandler<
    HTMLButtonElement,
    MouseEvent
  > = (e, ingredient?: Ingredient | RecipeIngredient): void => {
    e.preventDefault();
    newRecipeForm();
  };

  return (
    <div>
      <Show
        when={!existingIngredients.loading && !unitOptions.loading}
        fallback={
          <>
            <p class="py-12 text-center">Loading options...</p>
          </>
        }
      >
        <div>
          <For each={ingredients()}>
            {(ingredient, index) => (
              <>
                <>
                  <div class="flex md:items-end items-center border-b-2 py-3">
                    <div class="grow">
                      <RecipeIngredientForm
                        id={ingredient.id}
                        unitOptions={selectOptionsUnits()}
                        ingredientOptions={existingIngredients()}
                        ingredientData={('ingredient' in ingredient) ? ingredient?.ingredient: null}
                      />
                    </div>
                    <div class="ml-2 flex grow-0">
                      <button
                        class="btn !mb-0 md:!mb-2 !px-2 !py-3"
                        disabled={ingredients().length < 2}
                        onClick={(e) => {
                          e.preventDefault();
                          removeElement(
                            ingredient.id,
                            ingredients,
                            setIngredients,
                          );
                        }}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                </>
              </>
            )}
          </For>
        </div>
        <div class="my-4 flex items-end gap-4">
          <div class="flex-none">
            <button
              class="btn btn-accent"
              style="margin: 0"
              onClick={addNewRecipeIngredient}
            >
              Add new ingredient +
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}
