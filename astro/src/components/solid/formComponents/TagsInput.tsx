import "@styles/TagsInput.css";
import * as tagsInput from "@zag-js/tags-input";

import LabelComponent from "./LabelComponent";

import { normalizeProps, useMachine } from "@zag-js/solid";
import { createMemo, createUniqueId, For, mergeProps } from "solid-js";

export function TagsInput(props: {
  name: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
  initialValue?: string[];
}) {
  const merged = mergeProps(
    { disabled: false, initialValue: [], name: "" },
    props
  );

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

  // connect() takes the service directly
  const api = createMemo(() =>
    tagsInput.connect(service, normalizeProps)
  );

  return (
    <div {...api().getRootProps()} class="tagsInput">
      <LabelComponent
        id={api().getLabelProps().for}
        label={props.label}
      />

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