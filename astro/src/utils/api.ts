import { axiosClient } from "@utils/apiClient";
import { Recipe, Tag } from "@utils/interfaces";

//TODO: use interfaces to ensure types
export function getRecipes() : Promise<Recipe[]>|null {
    return axiosClient.get('/recipes/');
}

export function getRecipe(id : number) : Promise<Recipe>|null {
  return axiosClient.get(`/recipes/${id}/`);
}

export function getTags() : Promise<Tag[]>|null {
  return axiosClient.get(`/tags/`);
}