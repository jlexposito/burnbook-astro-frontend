import { createSignal, createEffect } from "solid-js";

export function createDebouncedSignal(valueAccessor: () => string, delay = 300) {
  const [debounced, setDebounced] = createSignal(valueAccessor());
  let timeout: any;

  createEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => setDebounced(valueAccessor()), delay);
  });

  return debounced;
}
