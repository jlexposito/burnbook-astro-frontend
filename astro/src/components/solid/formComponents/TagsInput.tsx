import "@styles/TagsInput.css";
import * as zagTagsInput from "@zag-js/tags-input";

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

  function isNotEmptyString(element: string) {
    return element.trim().length;
  }
  let nonEmptyIntialValue = merged.initialValue.some(isNotEmptyString);
  const disabled = false || props.disabled;
  const initialValue = nonEmptyIntialValue ? merged.initialValue : [];

  let config: zagTagsInput.Context = {
    id: createUniqueId(),
    max: 10,
    blurBehavior: "add",
    name: merged.name,
    value: initialValue,
    validate(details) {
      // no repeated
      return !details?.values?.includes(details.inputValue);
    },
  };

  const [state, send] = useMachine(zagTagsInput.machine(config));
  const api = createMemo(() =>
    zagTagsInput.connect(state, send, normalizeProps)
  );

  return (
    <div {...api().rootProps} class="tagsInput">
      <LabelComponent id={api().labelProps.for} label={props.label} />
      <div
        classList={{ focused: state.hasTag("focused") }}
        class="input"
        {...api().controlProps}
      >
        <For each={api().value}>
          {(value, index) => (
            <span>
              <div {...api().getItemProps({ index: index(), value })}>
                <span>{value}</span>
                <button
                  {...api().getItemDeleteTriggerProps({ index: index(), value })}
                >
                  &#x2715;
                </button>
              </div>
              <input {...api().getItemInputProps({ index: index(), value })} />
            </span>
          )}
        </For>
        <input
          placeholder={props.placeholder ? props.placeholder : ""}
          {...api().inputProps}
        />
        <input type="hidden" name={merged.name} value={api().value.join(",")} />
      </div>
    </div>
  );
}
