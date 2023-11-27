import { type Accessor, type Resource, type Setter } from "solid-js";
import type {
  Ingredient,
  Unit,
  ComboboxOption,
  Tag,
  recipeIngredientFormValue,
  referenceFormValue,
} from "@utils/interfaces";

type selectElementType = Unit | Ingredient | Tag
type selectOptionType = ComboboxOption[]

export const createSelectOptions = (
  elements: Resource<selectElementType[]>,
): selectOptionType => {
  let options: selectOptionType = [];

  for (let i = 0; i < elements()?.length; i++) {
    let opt = elements()[i];
    let value = opt.name;
    if ("prefix" in opt && opt.prefix.length) {
      value = `${opt.prefix} ${value}`;
    }
    options.push({
      label: value,
      value: value,
      disabled: false,
      element: opt
    });
  }
  return options;
};

type formValues = recipeIngredientFormValue | referenceFormValue

export const removeElement = (
  id: string,
  elements: Accessor<formValues[]>,
  setElements: Setter<formValues[]>,
): void => {
  const elementPos = elements()
    .map(function (x) {
      return x.id;
    })
    .indexOf(id);
  if (elementPos > -1) {
    let newElements : formValues[] = [...elements()];
    newElements.splice(elementPos, 1);
    setElements(newElements);
  }
};
