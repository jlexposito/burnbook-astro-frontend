// types
import {
  type Recipe,
  type Tag,
  type Ingredient,
  type Unit,
  type LoginResult,
} from "@utils/interfaces";

import { axiosClient, axiosClientNoIntercept } from "@utils/apiClient";
import { updateTokens } from "@stores/apiStore";

export function getRecipes(): Promise<Recipe[]> | null {
  return axiosClient.get("/recipes/");
}

export function getRecipe(id: String): Promise<Recipe> | null {
  return axiosClient.get(`/recipes/${id}/`);
}

export function getTags(): Promise<Tag[]> | null {
  return axiosClient.get(`/tags/`);
}

export function getIngredients(): Promise<Ingredient[]> | null {
  return axiosClient.get(`/ingredients/`);
}

export function getUnits(): Promise<Unit[]> | null {
  return axiosClient.get(`/units/`);
}

export function doLogin(
  username: string,
  password: string,
): Promise<LoginResult> {
  let loginData = JSON.stringify({
    username: username,
    password: password,
  });
  return axiosClientNoIntercept.post("/token/", loginData);
}

export function loginWithCredentials(
  username: string,
  password: string,
): LoginResult {
  let result: LoginResult = {
    success: false,
    message: "Something went wrong",
  };
  let id: number;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8100/token/");
  xhr.setRequestHeader("Content-Type", "application/json");
  let jsonData = JSON.stringify({
    username: username,
    password: password,
  });

  //send the form data
  xhr.send(jsonData);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      console.log(xhr.status);
      if (xhr.status == 200) {
        console.log("HERE WE ARE");
        let tokens = JSON.parse(xhr.response);
        updateTokens(tokens);
        result.success = true;
        result.message = "Login successfully";
      } else if (xhr.status == 401) {
        console.log("Invalid creds");
        result.message = "Invalid credentials";
        alert(result.message);
      }
    }
    return result;
  };
}
