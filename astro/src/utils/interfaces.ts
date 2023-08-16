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
}

export type RecipeIngredient = {
    quantity: number;
    unit: string;
    ingredient: Ingredient;
}

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
}
export interface TagInterface {
    id: number;
    name: string;
    highligthed: boolean;
}

export type Tag = {
    id: number;
    name: string;
    highligthed: boolean;
}

export type ImageSources = {
    src: string,
    srcSet: string,
    sizes: string
}

export type Unit = {
    name: string;
}

export type Option = {
    name: string;
    label?: string;
};

export type ComboboxOption = {
    label: string;
    code: string;
    disabled: boolean;
    new?: boolean;
};
