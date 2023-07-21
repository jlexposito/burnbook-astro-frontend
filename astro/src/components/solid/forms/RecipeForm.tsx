import { createSignal } from "solid-js";
import { toaster } from "@kobalte/core";
import ToastNotification from "../ToastNotification";

import "@styles/recipeForm.css";

// Components
import FormInput from "@solidcomponents/formComponents/FormInput";
import RecipeIngredientForm from "@solidcomponents/formComponents/RecipeIngredientForm";

import { RecipeInterface } from "@utils/interfaces";
import CollapseComponent from "@solidcomponents/CollapseComponent";

export default function RecipeForm() {
  const [name, setName] = createSignal("");
  const [cooking_time, setCookingTime] = createSignal(0);
  const [servings, setServings] = createSignal(2);
  const [instructions, setInstructions] = createSignal("");

  const handleSubmit = (event: Event): void => {
    let recipeData: RecipeInterface;

    event.preventDefault();
    alert("submitted");
  };
  return (
    <>
      <form
        id="login"
        class="space-y-4 md:space-y-6"
        method="post"
        onsubmit={handleSubmit}
      >
        <div class="p-6 md:space-y-3 sm:p-8">
          <div class="flex flex-wrap -mx-3">
            <div class="w-full px-3">
              <FormInput type="text" name="name" label="Name" autocomplete="off" />
            </div>
          </div>
          <div class="flex flex-wrap -mx-3">
            <div class="w-full md:w-1/2 px-3 mb-3">
              <FormInput
                type="number"
                name="cooking_tame"
                label="Cooking time (minutes)"
                min="0"
              />
            </div>
            <div class="w-full md:w-1/2 px-3">
              <FormInput
                type="number"
                name="servings"
                label="Servings"
                value="2"
              />
            </div>
          </div>
          <CollapseComponent
            expanded={true}
            titleClasses="w-full py-3"
            title="Ingredients"
          >
            <div class="[& .ingredient-form]:border-2 border-solid">
              <RecipeIngredientForm />
              <RecipeIngredientForm />
            </div>
          </CollapseComponent>

          <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full px-3">
              <FormInput
                type="textarea"
                name="instructions"
                label="Instructions"
                rows="10"
                autocomplete="off"
                style={"min-height: 200px;"}
              />
            </div>
          </div>
          <button
            type="submit"
            class="w-full bk-accent bk-accent-hover text-white border border-bk-accent-dark focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
