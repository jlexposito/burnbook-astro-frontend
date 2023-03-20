import { axiosClient } from "./apiClient";


export function getRecipes(){
    return axiosClient.get('/recipes');
}

export function getRecipe(id) {
  return axiosClient.get(`/recipes/${id}/`);
}