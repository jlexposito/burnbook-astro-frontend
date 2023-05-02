import { axiosClient } from "./apiClient";
import { Recipe } from "./interfaces";

//TODO: use interfaces to ensure types
export function getRecipes() : Recipe[]|null {
    return axiosClient.get('/recipes');
}

export function getRecipe(id) : Recipe|null {
  return axiosClient.get(`/recipes/${id}/`);
}