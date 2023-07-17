import { apiTokens, setApiTokens } from '@utils/apiStore'
import { createSignal } from "solid-js";
import { toaster } from "@kobalte/core";
import ToastNotification from './ToastNotification';


export default function LoginForm() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  const login = (username: string, password: string): void => {
    let id: number;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8100/token/");
    xhr.setRequestHeader("Content-Type", "application/json");
    let jsonData = JSON.stringify({ username: username, password: password });

    //send the form data
    xhr.send(jsonData);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status == 200) {
          let tokens = JSON.parse(xhr.response);
          setApiTokens(tokens);
          window.location.replace("/recipe/newrecipe");
        } else if (xhr.status == 401) {
          id = toaster.show((props) => (
            <ToastNotification message="Invalid credentials" title="Error" toastId={props.toastId}/>
          ));
        } else {
          id = toaster.show((props) => (
            <ToastNotification message="Something went wrong" title="Error" toastId={props.toastId}/>
          ));
        }
      }
    };
  };

  const handleSubmit = (event: Event): void => {
    event.preventDefault();
    login(username(), password());
  };
  return (
    <>
      <form
        id="login"
        class="space-y-4 md:space-y-6"
        action="#"
        onsubmit={handleSubmit}
      >
        <div>
          <label
            for="username"
            class="cursor-pointer block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
          />
        </div>
        <div>
          <label
            for="password"
            class="cursor-pointer block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bk-accent bk-accent-hover text-white border border-bk-accent-dark focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700"
        >
          Sign in
        </button>
      </form>
    </>
  );
}
