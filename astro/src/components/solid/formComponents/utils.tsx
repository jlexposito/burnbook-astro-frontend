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

export const createOptionsArray = (elements: (Ingredient | Unit)) => {
  let options: any[] = [];
  for (let i = 0; i < elements?.length; i++) {
    let opt = elements[i];
    if (typeof opt !== "object") {
      continue;
    }
    let value = opt?.name;
    let label = value;
    if ("prefix" in opt && opt.prefix.length) {
      label = `${opt.prefix} ${value}`;
    }
    options.push({
      label: label,
      value: value,
      disabled: false,
      ...opt,
    });
  }
  return options;
};

export const formatOptions = (item: any, type: "option" | "value") => {
  const label = item?.label ? item.label : "error";
  if (type === "option") {
    return label;
  }
  const value = item?.value;
  return value ? value : label;
};
