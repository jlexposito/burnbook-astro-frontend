import type { CollectionEntry } from "astro:content";

import {
  createMemo,
  createSignal,
  createUniqueId,
  For,
  Index,
  type JSX,
  Show,
} from "solid-js";
import { isServer } from "solid-js/web";

// Utils
import {
  ImgSizeTypes,
  type ImgSizes,
  type referenceFormValue,
} from "@utils/interfaces";
import {
  removeElement,
  createOptionsArray
} from "@solidcomponents/formComponents/utils";

// Components
import CollapseComponent from "@solidcomponents/CollapseComponent";
import FormInput from "@solidcomponents/formComponents/FormInput";
import { TagsInput } from "@solidcomponents/formComponents/TagsInput";
import { createOptions } from "@thisbeyond/solid-select";
import { SelectInput } from "@solidcomponents/formComponents/SelectInput";

// Stores
import { $tokens } from "@stores/apiStore";
import IngredientsForm from "@solidcomponents/forms/IngredientsForm";
import OptimizedImage from "@solidcomponents/OptimizedImage";

const imgSizes : ImgSizes = {
  sizes: [
    {
    size: 220,
    media: "220px"
    }
  ]
}

const statusOptions = [
  {
    "name": "Tried"
  },
  {
    "name": "Draft"
  },
  {
    "name": "New"
  },
]

export default function RecipeForm(props: {
  action: string;
  recipe?: CollectionEntry<'recipes'>;
}) {
  const recipe = props.recipe;

  const noImage = import.meta.env.PUBLIC_DEFAULT_IMAGE;

  const image = (): string => {
    return recipe.data?.image ? recipe.data?.image : noImage;
  };

  const status = recipe?.data?.status;
  const statusOptionsArray = createMemo(() => {
    return createOptionsArray(statusOptions);
  });

  const selectedStatusValue = createMemo(() => {
    return statusOptionsArray().find((option: item) => option?.value === status);
  });


  const StatusesConfig = createMemo(() => {
    let optionsConfig = createOptions(statusOptionsArray(), {
      key: "label",
    });
    optionsConfig["placeholder"] = "";
    return optionsConfig;
  });

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
        alert("Created successfully !");
        if (recipe?.data?.id) {
          // Removes /edit/
          let url = window.location.href
          url = url.split('/').slice(0, -2).join('/');
          window.location.replace(url);
        }
        // Redirect to base url if its a new recipe
        window.location.replace('/');
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
              <div class="w-full md:w-1/3">
                <FormInput
                  type="number"
                  name="cooking_time"
                  label="Tiempo de preparacion (minutos)"
                  min="0"
                  value={recipe?.data?.cooking_time}
                  required={true}
                />
              </div>
              <div class="w-full md:w-1/3">
                <FormInput
                  type="number"
                  name="servings"
                  label="Raciones"
                  required={true}
                  value={recipe ? recipe.data?.servings : "2"}
                />
              </div>
              <div class="w-full md:w-1/3">
                <SelectInput
                  label="Estado"
                  name="state"
                  initialValue={selectedStatusValue()}
                  classes={"text-center justify-center"}
                  required={true}
                  config={StatusesConfig()}
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
                <div class="min-w-[160px]">
                  <p class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 hover:cursor-pointer">Imagen actual</p>
                  <a href={image()} target="_blank">
                  { !image() ? (
                    <div>
                      <span>(Sin imagen)</span>
                    </div>
                  ) : (
                    <OptimizedImage
                      lazyLoad={false}
                      width={160}
                      height={90}
                      classes="w-full h-[128px] md:h-[256px] object-cover"
                      altTitle={recipe.data?.title}
                      filename={image()}
                      sizes={imgSizes}
                      sizeType={ImgSizeTypes.width}
                    />
                  )}
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
              titleClasses="w-full py-3 rounded-lg border-2 border-secondary-dark/40"
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
                            class="btn my-0! px-2! py-3!"
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
