import { createSignal } from "solid-js";

//Stores
import { $tokens, updateTokens } from "@stores/apiStore";
import { LoginResult } from "@utils/interfaces";

import { doLogin } from "@utils/api";

export default function LoginForm() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  const handleSubmit = (event: Event): void => {
    event.preventDefault();
    const res = doLogin(username(), password());
    res
      .then((res) => {
        console.log(res);
        updateTokens(res.data);
        window.location.replace("/recipe/newrecipe");
        // res.data.args; // { hello: 'world' }
      })
      .catch((reason) => {
        console.log(reason);
        alert("Invalid credentials");
      });
  };
  return (
    <>
      <form
        id="login"
        class="space-y-4 md:space-y-6"
        action="#"
        method="post"
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
              console.log(`updating username: ${e.target.value}`);
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
              console.log(`updating password: ${e.target.value}`);
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
