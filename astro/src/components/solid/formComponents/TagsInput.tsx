import "@styles/TagsInput.css";
import * as tagsInput from "@zag-js/tags-input";

import LabelComponent from "./LabelComponent";
import { getTags } from "@utils/api";

import { normalizeProps, useMachine } from "@zag-js/solid";
import { createMemo, createUniqueId, For, mergeProps, createResource, Show } from "solid-js";

export function TagsInput(props: {
  name: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
  initialValue?: string[];
  suggestedTags?: { id: number; name: string; highlighted: boolean }[];
}) {
  const merged = mergeProps(
    { disabled: false, initialValue: [], name: "" },
    props
  );

  // Fetch tags from your API if not provided via props
  const [fetchedTags] = createResource(
    () => !props.suggestedTags,
    getTags
  );

  // Map and sort tags: Highlighted first, then alphabetical
  const availableTags = createMemo(() => {
    const raw = props.suggestedTags || fetchedTags() || [];
    if (!Array.isArray(raw)) return [];

    const normalized = raw
      .map((item) => (typeof item === "string" ? { name: item, highlighted: false } : item))
      .filter((item) => item && item.name);

    // Sort: Highlighted first, then alphabetical by name
    return normalized
      .sort((a, b) => {
        if (a.highlighted !== b.highlighted) {
          return b.highlighted ? 1 : -1; // Highlighted comes first
        }
        return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }); // Alphabetical (Spanish locale)
      })
      .map((item) => item.name);
  });

  const initialValue = merged.initialValue.filter((v) => v.trim().length > 0);

  const service = useMachine(tagsInput.machine, {
    id: createUniqueId(),
    name: merged.name,
    max: 10,
    blurBehavior: "add",
    disabled: merged.disabled,
    defaultValue: initialValue,

    validate({ value, inputValue }) {
      return !value.includes(inputValue);
    },
  });

  const api = createMemo(() =>
    tagsInput.connect(service, normalizeProps)
  );

  return (
    <div {...api().getRootProps()} class="tagsInput">
      <LabelComponent
        id={api().getLabelProps().for}
        label={props.label}
      />

      {/* Suggested Tags Quick Buttons */}
      <Show when={availableTags().length > 0}>
        <div 
          class="suggested-tags-container" 
          style={{ display: "flex", "flex-wrap": "wrap", gap: "6px", "margin-bottom": "8px" }}
        >
          <For each={availableTags()}>
            {(tagName) => {
              const isSelected = createMemo(() => api().value.includes(tagName));
              return (
                <button
                  type="button"
                  disabled={isSelected() || merged.disabled}
                  onClick={() => api().addValue(tagName)}
                  class="suggested-tag-pill"
                  classList={{ "is-selected": isSelected() }}
                  style={{
                    cursor: isSelected() ? "not-allowed" : "pointer",
                    opacity: isSelected() ? "0.5" : "1",
                  }}
                >
                  + {tagName}
                </button>
              );
            }}
          </For>
        </div>
      </Show>

      <div
        class="input"
        classList={{ focused: api().focused }}
        {...api().getControlProps()}
      >
        <For each={api().value}>
          {(value, index) => (
            <span {...api().getItemProps({ index: index(), value })}>
              <div
                {...api().getItemPreviewProps({ index: index(), value })}
              >
                <span>{value}</span>
                <button
                  type="button"
                  {...api().getItemDeleteTriggerProps({
                    index: index(),
                    value,
                  })}
                >
                  &#x2715;
                </button>
              </div>

              <input
                {...api().getItemInputProps({
                  index: index(),
                  value,
                })}
              />
            </span>
          )}
        </For>

        <input
          placeholder={props.placeholder}
          {...api().getInputProps()}
        />

        <input
          type="hidden"
          name={merged.name}
          value={api().value.join(",")}
        />
      </div>
    </div>
  );
}
