import { createSignal } from "solid-js";

//Components
import { toaster } from "@kobalte/core";
import ToastNotification from "@solidcomponents/ToastNotification";

//Stores
import { $tokens, updateTokens } from "@stores/apiStore";

export default function LoginForm() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  const login = (username: string, password: string): void => {
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
        if (xhr.status == 200) {
          let tokens = JSON.parse(xhr.response);
          updateTokens(tokens);
          window.location.replace("/recipe/newrecipe");
        } else if (xhr.status == 401) {
          id = toaster.show((props) => (
            <ToastNotification
              message="Invalid credentials"
              title="Error"
              toastId={props.toastId}
            />
          ));
        } else {
          id = toaster.show((props) => (
            <ToastNotification
              message="Something went wrong"
              title="Error"
              toastId={props.toastId}
            />
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
            class="mb-2 block cursor-pointer text-sm font-medium text-gray-900"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="email"
            class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm "
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
            class="mb-2 block cursor-pointer text-sm font-medium text-gray-900"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </div>

        <button
          type="submit"
          class="bk-accent bk-accent-hover border-bk-accent-dark w-full rounded-lg border px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
        >
          Sign in
        </button>
      </form>
    </>
  );
}
