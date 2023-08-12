import { axiosClient } from "@utils/apiClient";
import { Recipe, Tag, Ingredient, Unit } from "@utils/interfaces";

export function getRecipes() : Promise<Recipe[]>|null {
    return axiosClient.get('/recipes/');
}

export function getRecipe(id : String) : Promise<Recipe>|null {
  return axiosClient.get(`/recipes/${id}/`);
}

export function getTags() : Promise<Tag[]>|null {
  return axiosClient.get(`/tags/`);
}

export function getIngredients() : Promise<Ingredient[]>|null {
  return axiosClient.get(`/ingredients/`);
}

export function getUnits() : Promise<Unit[]>|null {
  return axiosClient.get(`/units/`);
}
