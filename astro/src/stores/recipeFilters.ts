import { createSignal } from "solid-js";

export const [filters, setFilters] = createSignal({
  search: "",
  activeTags: [] as string[],
  maxTime: null as number | null,
  open: true, // filter panel open/closed
});
