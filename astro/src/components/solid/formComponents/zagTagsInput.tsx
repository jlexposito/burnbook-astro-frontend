import "@styles/TagsInput.css";
import * as tagsInput from "@zag-js/tags-input";

import LabelComponent from "./LabelComponent";
import { ComboboxOption } from "@utils/interfaces";

import { normalizeProps, useMachine } from "@zag-js/solid";
import { createMemo, createUniqueId, For } from "solid-js";

export function TagsInput(props: {
  name: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
  initialValue?: string[];
}) {
  const disabled = false || props.disabled;
  let config = {
    id: createUniqueId(),
    max: 10,
    name: props.name,
    blurBehavior: "add",
  };
  console.log(props.name);

  if (props.initialValue) {
    config["value"] = props.initialValue;
  }

  const [state, send] = useMachine(tagsInput.machine(config));
  const api = createMemo(() => tagsInput.connect(state, send, normalizeProps));

  return (
    <div {...api().rootProps} class="tagsInput">
      <LabelComponent id={api().labelProps.for} label={props.label} />
      <div {...api().controlProps}>
        <For each={api().value}>
          {(value, index) => (
            <span>
              <div {...api().getTagProps({ index: index(), value })}>
                <span>{value} </span>
                <button
                  {...api().getTagDeleteTriggerProps({ index: index(), value })}
                >
                  &#x2715;
                </button>
              </div>
              <input {...api().getTagInputProps({ index: index(), value })} />
            </span>
          )}
        </For>
        <input
          placeholder={props.placeholder ? props.placeholder : ""}
          {...api().inputProps}
        />
      </div>
    </div>
  );
}
