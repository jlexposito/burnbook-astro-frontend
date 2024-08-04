import type { CollectionEntry } from "astro:content";

import {
  type Accessor,
  createMemo,
  createResource,
  createSignal,
  createUniqueId,
  For,
  Index,
  type JSX,
  type ResourceReturn,
  Show,
} from "solid-js";
import { isServer } from "solid-js/web";

// Utils
import { getTags } from "@utils/api";
import type {
  ComboboxOption,
  Tag,
  referenceFormValue,
  RecipeInterface,
} from "@utils/interfaces";
import {
  createSelectOptions,
  removeElement,
} from "@solidcomponents/formComponents/utils";

// Components
import CollapseComponent from "@solidcomponents/CollapseComponent";
import FormInput from "@solidcomponents/formComponents/FormInput";
import { TagsInput } from "@solidcomponents/formComponents/TagsInput";

// Stores
import { $tokens } from "@stores/apiStore";
import IngredientsForm from "@solidcomponents/forms/IngredientsForm";

export default function RecipeForm(props: {
  action: string;
  recipe?: CollectionEntry<'recipes'>;
}) {
  const recipe = props.recipe;

  const createNewReference = (initialValue: string) => {
    const [value, setValue] = createSignal(initialValue);
    return {
      id: createUniqueId(),
      value: value,
      setValue: setValue,
    };
  };

  // References
  const recipeReferences = recipe?.data?.references;
  let numberOfInitialReferences = 2;
  let initialReferences = [];

  if (recipeReferences) {
    numberOfInitialReferences = 1;
    for (let i = 0; i < recipeReferences.length; i++) {
      initialReferences.push(createNewReference(recipeReferences[i]));
    }
  }
  for (let i = 0; i < numberOfInitialReferences; i++) {
    initialReferences.push(createNewReference(""));
  }
  const [references, setReferences] =
    createSignal<referenceFormValue[]>(initialReferences);

  const addNewReference: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
    e,
  ): void => {
    e.preventDefault();
    let newReference = createNewReference("");
    setReferences([...references(), newReference]);
  };

  if (!isServer) {
    // Catchall to avoid collapsing when pressing the "backspace"
    let input = document.getElementById("new-recipe");

    if(input) {
      // Execute a function when the user presses a key on the keyboard
      input.addEventListener("keypress", function (event) {
        if ("type" in event.target) {
          const targetType = event.target?.type;
          if (targetType === "textarea" || targetType == "submit") {
            return true;
          }
        }
  
        if (event.key === "Enter") {
          event.preventDefault();
        }
      });
    }
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
    const formMethod = recipe ? "PUT" : "POST";

    // Define what happens on successful data submission
    XHR.addEventListener("load", (event: ProgressEvent<XMLHttpRequest>) => {
      let response = event.target.responseText;
      let responseStatus = event.target.status;
      if (responseStatus == 401) {
        alert("Please login again");
        window.open("/login", "_blank");
      }

      // All 2xx are okay
      if (Math.floor(responseStatus / 100) != 2) {
        console.log("Something went wrong");
        let errors;
        try {
          errors = JSON.parse(response).errors;
        } catch (error) {
          errors = {
            text: response,
          };
        }
        console.log(errors);
        setFormErrors(errors);
      } else {
        let id = "";
        if (recipe?.data?.id) {
          id = recipe.data.id.toString();
        } else {
          let json_res = JSON.parse(response);
          id = json_res.recipe;
        }

        alert("Created successfully !");
        window.location.replace(`/recipe/${id}`);
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
                value={recipe?.data?.title}
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
                  value={recipe?.data?.cooking_time}
                  required={true}
                />
              </div>
              <div class="w-full md:w-1/2">
                <FormInput
                  type="number"
                  name="servings"
                  label="Raciones"
                  required={true}
                  value={recipe ? recipe.data?.servings : "2"}
                />
              </div>
            </div>
            <div class="flex w-full justify-between">
              <div>
                <FormInput
                  label="Imagen"
                  type="file"
                  name="image"
                  alt="Recipe image"
                />
              </div>
              <Show when={recipe}>
                <div>
                  <p>Imagen existente</p>
                  <a href={recipe.data?.image} target="_blank">
                    <img width="300" height="300" src={recipe.data?.image} />
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
                value={recipe ? recipe.body : ""}
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
              <IngredientsForm recipe={recipe} />
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
                      <div class="mb-2 flex items-end">
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

                        <div class="ml-2 flex grow-0 items-center">
                          <button
                            class="btn !my-0 !px-2 !py-3"
                            disabled={references().length < 2}
                            onClick={(e) => {
                              e.preventDefault();
                              removeElement(
                                reference().id,
                                references,
                                setReferences,
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
              initialValue={recipe?.data?.tags}
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
