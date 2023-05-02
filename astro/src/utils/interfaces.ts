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