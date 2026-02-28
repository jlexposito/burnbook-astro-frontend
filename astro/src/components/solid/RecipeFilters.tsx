import { createMemo, createSignal, For, Show } from "solid-js";

type Props = {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
};

export function TagSelector(props: Props) {
  const [query, setQuery] = createSignal("");

  const normalizedQuery = createMemo(() =>
    query().toLowerCase().trim()
  );

  const selectedTags = createMemo(() =>
    props.selected.filter(tag =>
      tag.toLowerCase().includes(normalizedQuery())
    )
  );

  const availableTags = createMemo(() =>
    props.tags
      .filter(tag => !props.selected.includes(tag))
      .filter(tag =>
        tag.toLowerCase().includes(normalizedQuery())
      )
  );

  const onKeyToggle = (e: KeyboardEvent, tag: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      props.onToggle(tag);
    }
  };

  return (
    <div class="tag-selector">
      {/* Search */}
      <input
        type="text"
        placeholder="Search tags…"
        value={query()}
        onInput={e => setQuery(e.currentTarget.value)}
        aria-label="Search tags"
      />

      {/* Selected */}
      <Show when={selectedTags().length > 0}>
        <div class="tag-section">
          <h4>
            Selected
            <span class="badge">{selectedTags().length}</span>
          </h4>

          <div class="tags" role="list">
            <For each={selectedTags()}>
              {tag => (
                <button
                  class="tag selected"
                  role="listitem"
                  tabindex="0"
                  aria-pressed="true"
                  onClick={() => props.onToggle(tag)}
                  onKeyDown={e => onKeyToggle(e, tag)}
                >
                  {tag}
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* Available */}
      <Show when={availableTags().length > 0}>
        <div class="tag-section">
          <h4>Available</h4>

          <div class="tags" role="list">
            <For each={availableTags()}>
              {tag => (
                <button
                  class="tag"
                  role="listitem"
                  tabindex="0"
                  aria-pressed="false"
                  onClick={() => props.onToggle(tag)}
                  onKeyDown={e => onKeyToggle(e, tag)}
                >
                  {tag}
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}
