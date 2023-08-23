import {
  Accessor,
  Component,
  createMemo,
  createResource,
  createSignal,
  createUniqueId,
  For,
  Index,
  JSX,
  Resource,
  ResourceReturn,
  Setter,
  Show,
} from "solid-js";
import { isServer } from "solid-js/web";

// Utils
import { getIngredients, getUnits, getTags } from "@utils/api";
import {
  Ingredient,
  Unit,
  ComboboxOption,
  RecipeInterface,
  Tag,
  referenceFormValue,
  recipeIngredientFormValue,
} from "@utils/interfaces";

// Components
import CollapseComponent from "@solidcomponents/CollapseComponent";
import FormInput from "@solidcomponents/formComponents/FormInput";
import RecipeIngredientForm from "@solidcomponents/formComponents/RecipeIngredientForm";
import { SelectInput } from "@solidcomponents/formComponents/ZagSelectInput";

// Stores
import { name } from "@stores/formStore";

export default function RecipeForm() {
  const createSelectOptions = (
    elements: Resource<Unit[] | Ingredient[] | Tag[]>
  ): ComboboxOption[] => {
    let options: ComboboxOption[] = [];
    elements()?.forEach((opt, _) => {
      options.push({
        label: opt.name,
        code: opt.name,
        disabled: false,
      });
    });
    return options;
  };

  // tags
  const [existingTags]: ResourceReturn<Tag[]> = createResource(getTags);
  const tagSelectOptions: Accessor<ComboboxOption[]> = createMemo(() =>
    createSelectOptions(existingTags)
  );

  // ingredients
  const [existingIngredients]: ResourceReturn<Ingredient[]> =
    createResource(getIngredients);
  const selectOptionsIngredients: Accessor<ComboboxOption[]> = createMemo(() =>
    createSelectOptions(existingIngredients)
  );

  // units
  const [unitOptions]: ResourceReturn<Unit[]> = createResource(getUnits);
  const selectOptionsUnits: Accessor<ComboboxOption[]> = createMemo(() =>
    createSelectOptions(unitOptions)
  );

  const createNewReference = (initialValue: string) => {
    const [value, setValue] = createSignal(initialValue);
    return {
      id: createUniqueId(),
      value: value,
      setValue: setValue,
    };
  };

  const ingredientFormElement = (
    initialQuantity: number = 0,
    iniitalUnit: string = ""
  ) => ({
    id: createUniqueId(),
  });

  // References
  const numberOfInitialReferences = 2;
  const initialReferences = [];
  for (let i = 0; i < numberOfInitialReferences; i++) {
    initialReferences.push(createNewReference(""));
  }
  const [references, setReferences] =
    createSignal<referenceFormValue[]>(initialReferences);

  // Ingredients
  const numberOfInitialIngredients = 2;
  const initialIngredients = [];
  for (let i = 0; i < numberOfInitialIngredients; i++) {
    initialIngredients.push(ingredientFormElement());
  }
  const [ingredients, setIngredients] = createSignal<
    recipeIngredientFormValue[] | []
  >(initialIngredients);

  const addNewRecipeIngredient: JSX.EventHandler<
    HTMLButtonElement,
    MouseEvent
  > = (e): void => {
    e.preventDefault();
    let newIngredient = ingredientFormElement();
    setIngredients([...ingredients(), newIngredient]);
  };

  const addNewReference: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
    e
  ): void => {
    e.preventDefault();
    let newReference = createNewReference("");
    setReferences([...references(), newReference]);
  };

  const removeElement = (
    id: string,
    elements: Accessor<recipeIngredientFormValue[] | referenceFormValue[]>,
    setElements: Setter<recipeIngredientFormValue[] | referenceFormValue[]>
  ): void => {
    const elementPos = elements()
      .map(function (x) {
        return x.id;
      })
      .indexOf(id);
    if (elementPos > -1) {
      let newElements = [...elements()];
      newElements.splice(elementPos, 1);
      setElements(newElements);
    }
  };

  const removeReference = (id: string): void => {
    const elementPos = references()
      .map(function (x) {
        return x.id;
      })
      .indexOf(id);
    if (elementPos > -1) {
      let newReferences = [...references()];
      newReferences.splice(elementPos, 1);
      setReferences(newReferences);
    }
  };
  // if (!isServer) {
  //   // Catchall to avoid collapsing when pressing the "backspace"
  //   let input = document.getElementById("new-recipe");

  //   // Execute a function when the user presses a key on the keyboard
  //   input.addEventListener("keypress", function (event) {
  //     if (event.key === "Enter") {
  //       event.stopPropagation();
  //       //event.preventDefault();
  //     }
  //   });
  // }

  const changeReference = (id: string, value: string) => {
    const reference = references().find((t) => t.id === id);
    if (reference) {
      reference.setValue(value);
    }
  };

  const [formErrors, setFormErrors] = createSignal({});

  const handleSubmit = (event: Event): void => {
    // TODO: migrate to solidJS way
    event.preventDefault();
    // let recipeData: RecipeInterface;
    const form: HTMLFormElement = event.target;
    const url = form.action;

    let recipeData: RecipeInterface;
    // TODO: migrate to solidJS way
    const XHR = new XMLHttpRequest();

    // Bind the FormData object and the form element
    const FD = new FormData(form);

    // Define what happens on successful data submission
    XHR.addEventListener("load", (event: ProgressEvent<XMLHttpRequest>) => {
      if (event.target.status !== 201) {
        console.log("Something went wrong");
        let response = event.target.responseText;
        let errors;
        try {
          errors = JSON.parse(response).errors;
        } catch (error) {
          errors = {
            text: response,
          };
        }
        setFormErrors(errors);
        console.log(formErrors());
        console.log(Object.keys(formErrors()));
      } else {
        alert("Created successfully !");
      }
    });

    // Define what happens in case of error
    XHR.addEventListener("error", (event) => {
      alert("Something went wrong, please try again.");
    });

    // Set up our request
    XHR.open("POST", url);

    // The data sent is what the user provided in the form
    XHR.send(FD);
  };
  return (
    <>
      <form
        id="new-recipe"
        class="space-y-4 md:space-y-6"
        method="post"
        onsubmit={handleSubmit}
        action="http://localhost:8200/recipes/"
      >
        <Show when={Object.keys(formErrors()).length > 0}>
          <div class="errors">
            <For each={Object.keys(formErrors())}>
              {(field) => (
                <>
                  <ul class="erro-list">
                    <For each={Object.keys(formErrors()[field])}>
                      {(fieldError) => <li>{fieldError}</li>}
                    </For>
                  </ul>
                </>
              )}
            </For>
          </div>
        </Show>
        <div class="p-3 py-5 md:space-y-3 sm:p-5">
          <div class="flex flex-wrap gap-y-2 pb-4">
            <div class="w-full">
              <FormInput
                type="text"
                name="title"
                label="Name"
                autocomplete="off"
                dynamicValue={name}
                required={true}
              />
            </div>
            <div class="flex w-full gap-x-4">
              <div class="w-full md:w-1/2">
                <FormInput
                  type="number"
                  name="cooking_time"
                  label="Cooking time (minutes)"
                  min="0"
                  required={true}
                />
              </div>
              <div class="w-full md:w-1/2">
                <FormInput
                  type="number"
                  name="servings"
                  label="Servings"
                  value="2"
                  required={true}
                />
              </div>
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
                  when={!existingIngredients.loading && !unitOptions.loading}
                  fallback={
                    <>
                      <p class="py-12 text-center">Loading options...</p>
                    </>
                  }
                >
                  <div>
                    <For each={ingredients()}>
                      {(ingredient) => (
                        <>
                          <>
                            <div class="flex">
                              <div class="grow">
                                <RecipeIngredientForm
                                  id={ingredient.id}
                                  options={selectOptionsIngredients()}
                                  unitOptions={selectOptionsUnits()}
                                />
                              </div>
                              <div class="grow-0 flex items-end ml-2">
                                <button
                                  class="btn btn-accent !py-1 !px-2 !my-3"
                                  disabled={ingredients().length < 2}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeElement(
                                      ingredient.id,
                                      ingredients,
                                      setIngredients
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
                  <button
                    class="btn btn-accent"
                    onClick={addNewRecipeIngredient}
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
                <Index each={references()}>
                  {(reference, index) => (
                    <>
                      <div class="mb-2 flex">
                        <div class="grow">
                          <FormInput
                            type="text"
                            name="references[]"
                            label={`Reference ${index + 1}`}
                            autocomplete="off"
                            required={false}
                            value={reference().value()}
                            id={reference().id}
                            onChange={changeReference}
                          />
                        </div>

                        <div class="grow-0 flex items-end ml-2">
                          <button
                            class="btn btn-accent !py-1 !px-2 !my-1"
                            disabled={references().length < 2}
                            onClick={(e) => {
                              e.preventDefault();
                              removeElement(
                                reference().id,
                                references,
                                setReferences
                              );
                            }}
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Index>
                <button class="btn btn-accent" onClick={addNewReference}>
                  Add new reference +
                </button>
              </div>
            </CollapseComponent>
          </div>
          <div>
            <Show
              when={!existingTags.loading}
              fallback={
                <>
                  <p class="py-12 text-center">Loading tags...</p>
                </>
              }
            >
              <SelectInput
                label={"Tags"}
                name={"tags"}
                options={tagSelectOptions()}
                allowCreate={true}
              />
            </Show>
          </div>

          <div class="flex flex-wrap mb-6">
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
          <button type="submit" class="w-full btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </>
  );
}
