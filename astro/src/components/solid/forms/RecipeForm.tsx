import {
  createSignal,
  createResource,
  Show,
  JSX,
  For,
  Component,
} from "solid-js";
import { isServer } from "solid-js/web";

// Components
import FormInput from "@solidcomponents/formComponents/FormInput";
import RecipeIngredientForm from "@solidcomponents/formComponents/RecipeIngredientForm";

import { getIngredients, getUnits } from "@utils/api";
import { RecipeInterface } from "@utils/interfaces";
import CollapseComponent from "@solidcomponents/CollapseComponent";

//import { useStore } from "@nanostores/solid";
import { name } from "@stores/formStore";

export default function RecipeForm() {
  /*
  //const [name, setName] = createSignal("");
  const [cooking_time, setCookingTime] = createSignal(0);
  const [servings, setServings] = createSignal(2);
  const [instructions, setInstructions] = createSignal("");
  //const [options, setOptions] = createSignal([]);
  const nameValue = useStore(name);
  */

  const [ingredientOptions] = createResource(getIngredients);
  const [unitOptions] = createResource(getUnits);

  const ingredientFormElement = () => (
    <RecipeIngredientForm
      options={ingredientOptions()}
      unitOptions={unitOptions()}
    />
  );
  const referenceForm = () => (
    <FormInput
      type="text"
      name="references[]"
      label="Reference"
      autocomplete="off"
      required={false}
    />
  );

  const createInitial = (numberOfElements, fillingElement, setSignal) =>
    setSignal(new Array(numberOfElements).fill(fillingElement));

  // References
  const numberOfInitialReferences = 1;
  const [references, setReferences] = createSignal<Component[]>([]);
  createInitial(numberOfInitialReferences, referenceForm, setReferences);

  // Ingredients
  const numberOfInitialIngredients = 2;
  const [ingredients, setIngredients] = createSignal<Component[] | []>([]);
  createInitial(
    numberOfInitialIngredients,
    ingredientFormElement,
    setIngredients
  );

  const increaseNumberOfIngredients: JSX.EventHandler<
    HTMLButtonElement,
    MouseEvent
  > = (e): void => {
    e.preventDefault();
    setIngredients([...ingredients(), ingredientFormElement]);
  };
  if (!isServer) {
    // Catchall to avoid collapsing when pressing the "backspace"
    let input = document.getElementById("new-recipe");

    // Execute a function when the user presses a key on the keyboard
    input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    });
  }

  const handleSubmit = (event: Event): void => {
    let recipeData: RecipeInterface;
    // TODO: migrate to solidJS way
    // event.preventDefault();
  };
  return (
    <>
      <form
        id="new-recipe"
        class="space-y-4 md:space-y-6"
        method="post"
        onsubmit={handleSubmit}
        action="http://localhost:8100/recipes/"
      >
        <div class="p-3 py-5 md:space-y-3 sm:p-8">
          <div class="flex flex-wrap -mx-3">
            <div class="w-full px-3">
              <FormInput
                type="text"
                name="name"
                label="Name"
                autocomplete="off"
                dynamicValue={name}
                required={true}
              />
            </div>
          </div>
          <div class="flex flex-wrap -mx-3">
            <div class="w-full md:w-1/2 px-3 mb-3">
              <FormInput
                type="number"
                name="cooking_time"
                label="Cooking time (minutes)"
                min="0"
                required={true}
              />
            </div>
            <div class="w-full md:w-1/2 px-3">
              <FormInput
                type="number"
                name="servings"
                label="Servings"
                value="2"
                required={true}
              />
            </div>
          </div>
          <div class="pb-6">
            <CollapseComponent
              expanded={true}
              titleClasses="w-full py-3 rounded-lg"
              classes="py-3"
              title="🍏 Ingredients 🍏"
            >
              <div class="[& .ingredient-form]:border-2 border-solid">
                <Show
                  when={!ingredientOptions.loading && !unitOptions.loading}
                  fallback={
                    <>
                      <p class="py-12 text-center">Loading options...</p>
                    </>
                  }
                >
                  <div>
                    <For each={ingredients()}>
                      {(ingredient, index) => <>{ingredient}</>}
                    </For>
                  </div>
                  <button
                    class="bk-accent bk-accent-hover text-white border border-bk-accent-dark focus:ring-2 focus:ring-offset-2 focus:ring-primary-accent focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={increaseNumberOfIngredients}
                  >
                    Add new ingredient +
                  </button>
                </Show>
              </div>
            </CollapseComponent>
          </div>

          <div class="pb-6">
            <CollapseComponent
              expanded={true}
              titleClasses="w-full py-3"
              classes="py-3"
              title="🔗 References 🔗"
            >
              <div class="[& .references-form]:border-2 border-solid">
                <For each={references()}>
                  {(reference, index) => <>{reference}</>}
                </For>
                <button
                  class="bk-accent bk-accent-hover text-white border border-bk-accent-dark focus:ring-2 focus:ring-offset-2 focus:ring-primary-accent focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  //onClick={increaseNumberOfIngredients}
                >
                  Add new reference +
                </button>
              </div>
            </CollapseComponent>
          </div>

          <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full px-3">
              <FormInput
                type="textarea"
                name="instructions"
                label="Instructions"
                rows="10"
                autocomplete="off"
                style={"min-height: 200px;"}
                required={true}
              />
            </div>
          </div>
          <button
            type="submit"
            class="w-full  bg-primary hover:bg-primary-accent text-white border border-bk-accent-dark focus:ring-offset-2 focus:ring-2 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}