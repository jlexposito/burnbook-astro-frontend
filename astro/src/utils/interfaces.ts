import { type Accessor, type Setter } from "solid-js";
import { type ValueChangeDetails } from "@zag-js/combobox";

export interface RecipeInterface {
  id: number;
  title: string;
  ingredients: Array<RecipeIngredient>;
  servings: number;
  image?: string;
  cooking_time: number;
  instructions: string;
  references: Array<string>;
  tags: Array<string>;
}

export type Ingredient = {
  name: string;
  prefix: string;
};

export type RecipeIngredient = {
  quantity?: number;
  unit: string;
  ingredient: Ingredient;
};

export type Recipe = {
  id: number;
  title: string;
  ingredients: Array<RecipeIngredient>;
  servings: number;
  image: string;
  cooking_time: number;
  instructions: string;
  references: Array<string>;
  tags: Array<string>;
};
export interface TagInterface {
  id: number;
  name: string;
  highligthed: boolean;
}

export type Tag = {
  id: number;
  name: string;
  highligthed: boolean;
};

export type ImageSources = {
  src: string;
  srcSet: string;
  sizes: string;
};

export type Unit = {
  name: string;
};

export type Option = {
  name: string;
  label?: string;
};

export type ComboboxOption = {
  label: string;
  value: string;
  disabled: boolean;
  new?: boolean;
  element?: Ingredient | Unit;
};

export type referenceFormValue = {
  id: string;
  value: Accessor<string>;
  setValue: Setter<string>;
};

export type recipeIngredientFormValue = {
  id: string;
  ingredient: RecipeIngredient;
};

export type LoginResult = {
  success: boolean;
  message: string;
};

export interface SelectValueChangeCallback<T> {
  (item: T);
}

export type selectElementType = Unit | Ingredient | Tag;
export type selectOptionType = ComboboxOption[];
export type formValues = recipeIngredientFormValue | referenceFormValue;
