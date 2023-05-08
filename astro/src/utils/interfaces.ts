export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
    prefix: string;
}

export interface Recipe {
    id: number;
    title: string;
    ingredients: Array<Ingredient>;
    servings: number;
    image: string;
    cooking_time: number;
    instructions: string;
    references: Array<string>;
    tags: Array<string>;
}

export type IngredientType = {
    name: string;
    quantity: number;
    unit: string;
    prefix: string;
}

export type RecipeType = {
    id: number;
    title: string;
    ingredients: Array<IngredientType>;
    servings: number;
    image: string;
    cooking_time: number;
    instructions: string;
    references: Array<string>;
    tags: Array<string>;
}
export interface Tag {
    id: number;
    name: string;
    highligthed: boolean;
}

export type TagType = {
    id: number;
    name: string;
    highligthed: boolean;
}

export type ImageSources = {
    src: string,
    srcSet: string,
    sizes: string
}