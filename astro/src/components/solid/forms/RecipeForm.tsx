import {
  type Accessor,
  createMemo,
  createResource,
  createSignal,
  createUniqueId,
  For,
  Index,
  type JSX,
  type Resource,
  type ResourceReturn,
  type Setter,
  Show,
} from "solid-js";
import { isServer } from "solid-js/web";

// Utils
import { getIngredients, getUnits, getTags } from "@utils/api";
import {
  type Ingredient,
  type Unit,
  type ComboboxOption,
  type Tag,
  type referenceFormValue,
  type recipeIngredientFormValue,
  type RecipeInterface,
  type RecipeIngredient
} from "@utils/interfaces";

// Components
import CollapseComponent from "@solidcomponents/CollapseComponent";
import FormInput from "@solidcomponents/formComponents/FormInput";
import RecipeIngredientForm from "@solidcomponents/formComponents/RecipeIngredientForm";
import { TagsInput } from "@solidcomponents/formComponents/TagsInput";

// Stores
import { $tokens } from "@stores/apiStore";

export default function RecipeForm(props: { action: string, recipe?: RecipeInterface }) {
  const recipe = props.recipe;
  const createSelectOptions = (
    elements: Resource<Unit[] | Ingredient[] | Tag[]>
  ): ComboboxOption[] => {
    let options: ComboboxOption[] = [];
    elements()?.forEach((opt, _) => {
      options.push({
        label: opt.name,
        value: opt.name,
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
    ingredientData?: RecipeIngredient
  ) => ({
    id: createUniqueId(),
    ingredientData: ingredientData
  });

  // References
  const recipeReferences = recipe?.references
  let numberOfInitialReferences = 2;
  let initialReferences = [];

  if (recipeReferences) {
    numberOfInitialReferences = 1;
    for (let i = 0; i < recipeReferences.length; i++) {
      initialReferences.push(createNewReference(recipeReferences[i]))
    }
  }
  for (let i = 0; i < numberOfInitialReferences; i++) {
    initialReferences.push(createNewReference(""));
  }
  const [references, setReferences] =
    createSignal<referenceFormValue[]>(initialReferences);

  // Ingredients
  const recipeIngredients = recipe?.ingredients;
  let numberOfInitialIngredients = 2;
  let initialIngredients = [];
  if (recipeIngredients) {
    numberOfInitialIngredients = 0
    for (let i = 0; i < recipeIngredients.length; i++) {
      // const name = recipeIngredients[i].ingredient.name
      // const prefix = recipeIngredients[i].ingredient.prefix
      // const unit = recipeIngredients[i].unit
      // const quantity = recipeIngredients[i].quantity
      initialIngredients.push(ingredientFormElement(
        recipeIngredients[i]
      ))
    }
  }
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

  if (!isServer) {
    // Catchall to avoid collapsing when pressing the "backspace"
    let input = document.getElementById("new-recipe");

    // Execute a function when the user presses a key on the keyboard
    input.addEventListener("keypress", function (event) {
      const targetType = event.target?.type;
      if (targetType === "textarea" || targetType == "submit") {
        return true;
      }
      if (event.key === "Enter") {
        event.preventDefault();
      }
    });
  }

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

    // Bind the FormData object and the form element
    const form: HTMLFormElement = event.target;
    const FD = new FormData(form);
    const XHR = new XMLHttpRequest();
    const formMethod = recipe? 'PUT':'POST';

    // Define what happens on successful data submission
    XHR.addEventListener("load", (event: ProgressEvent<XMLHttpRequest>) => {
      let response = event.target.responseText;
      let responseStatus = event.target.status
      if (responseStatus == 401) {
        alert("Please login again");
        window.open("/login", "_blank");
      }
      if (responseStatus !== 201 && responseStatus !== 202) {
        console.log("Something went wrong");
        let errors;
        try {
          errors = JSON.parse(response).errors;
        } catch (error) {
          errors = {
            text: response,
          };
        }
        setFormErrors(errors);
      } else {
        let json_res = JSON.parse(response);
        alert("Created successfully !");
        window.location.replace(`/recipe/${json_res.recipe}`)
      }
    });

    // Define what happens in case of error
    XHR.addEventListener("error", (event) => {
      alert("Something went wrong, please try again.");
    });

    // Set up our request
    const url = form.action;
    XHR.open(formMethod, url);

    const accessToken = $tokens.get().access;
    XHR.setRequestHeader("Authorization", "Bearer " + accessToken);

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
        action={props.action}
      >
        <Show when={Object.keys(formErrors()).length > 0}>
          <div class="errors">
            <For each={Object.keys(formErrors())}>
              {(field) => (
                <>
                  <ul class="erro-list">
                    <For each={formErrors()[field]}>
                      {(fieldError) => (
                        <li>
                          <strong class="font-bold">{field}</strong> -{" "}
                          {fieldError}
                        </li>
                      )}
                    </For>
                  </ul>
                </>
              )}
            </For>
          </div>
        </Show>
        <div class="p-3 py-5 sm:p-5 md:space-y-3">
          <div class="flex flex-wrap gap-y-4 pb-4 md:gap-y-6 md:pb-6">
            <div class="w-full">
              <FormInput
                type="text"
                name="title"
                label="Nombre"
                autocomplete="off"
                // dynamicValue={name}
                value={recipe?.title}
                required={true}
              />
            </div>
            <div class="flex w-full gap-x-4">
              <div class="w-full md:w-1/2">
                <FormInput
                  type="number"
                  name="cooking_time"
                  label="Tiempo de preparacion (minutos)"
                  min="0"
                  value={recipe?.cooking_time}
                  required={true}
                />
              </div>
              <div class="w-full md:w-1/2">
                <FormInput
                  type="number"
                  name="servings"
                  label="Raciones"
                  required={true}
                  value={recipe? recipe.servings : '2'}
                />
              </div>
            </div>
            <div class="flex justify-between w-full">
              <div>
                <FormInput label="Imagen" type="file" name="image" alt="Recipe image"/>
              </div>
              <Show when={recipe}>
                <div>
                  <p>Imagen existente</p>
                  <a href={recipe.image} target="_blank">
                    <img width="300" height="300" src={recipe.image} />
                  </a>
                </div>
              </Show>
            </div>
          </div>

          <div class="mb-6 flex flex-wrap">
            <div class="w-full">
              <FormInput
                type="textarea"
                name="instructions"
                label="Instrucciones"
                rows="10"
                autocomplete="off"
                style={"min-height: 200px;"}
                value={recipe? recipe.instructions : ''}
                required={true}
              />
            </div>
          </div>

          <div class="pb-4 md:pb-6">
            <CollapseComponent
              expanded={true}
              titleClasses="w-full py-3 rounded-lg"
              classes="py-3"
              title="🍏 Ingredientes 🍏"
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
                      {(ingredient, index) => (
                        <>
                          <>
                            <div class="flex border-b-2 pb-3">
                              <div class="grow">
                                <p>Ingrediente {index() + 1}</p>
                                <RecipeIngredientForm
                                  id={ingredient.id}
                                  options={selectOptionsIngredients()}
                                  unitOptions={selectOptionsUnits()}
                                  ingredientData={ingredient.ingredientData}
                                />
                              </div>
                              <div class="ml-2 flex grow-0 items-end">
                                <button
                                  class="btn !my-3 !px-2 !py-1"
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

          <div class="pb-4 md:pb-6">
            <CollapseComponent
              expanded={true}
              titleClasses="w-full py-3"
              classes="py-3"
              title="🔗 Referencias 🔗"
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
                            label={`Referencia ${index + 1}`}
                            autocomplete="off"
                            required={false}
                            value={reference().value()}
                            id={reference().id}
                            onChange={changeReference}
                          />
                        </div>

                        <div class="ml-2 flex grow-0 items-end">
                          <button
                            class="btn !my-1 !px-2 !py-1"
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
                  Nueva referencia +
                </button>
              </div>
            </CollapseComponent>
          </div>
          <div class="pb-4 md:pb-6">
            <TagsInput
              name={"tags"}
              placeholder={"tags (separados por coma)"}
              label={"tags"}
              initialValue={recipe?.tags}
            />
          </div>

          <button type="submit" class="btn btn-primary w-full">
            Guardar
          </button>
        </div>
      </form>
    </>
  );
}
