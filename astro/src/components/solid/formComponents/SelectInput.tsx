import "@styles/SelectInput.css";

import * as combobox from "@zag-js/combobox";
import { normalizeProps, useMachine } from "@zag-js/solid";
import {
  type Component,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  Show,
  mergeProps,
} from "solid-js";
import LabelComponent from "./LabelComponent";
import type {
  ComboboxOption,
  Unit,
  ValueChangeCallback,
} from "@utils/interfaces";

type SelectInputType = {
  options: ComboboxOption[];
  label: string;
  allowCreate?: boolean;
  callback?: ValueChangeCallback;
  classes?: string;
  inputBehavior?: "autocomplete" | "none" | "autohighlight";
  name?: string;
  required?: boolean;
  value?: string[];
  selectionBehavior?: "replace" | "clear" | "preserve";
};

export const SelectInput: Component<SelectInputType> = (props) => {
  const [options, setOptions] = createSignal<ComboboxOption[]>(props.options);
  const inputId = createUniqueId();
  const merged = mergeProps(
    {
      required: false,
      inputBehavior: "autocomplete",
      openOnClick: true,
      selectionBehavior: "replace",
    },
    props,
  );

  const collection = combobox.collection({
    items: merged.options,
    itemToValue: (item) => item.value,
    itemToString: (item) => item.label,
  });

  const clearValue = merged.selectionBehavior === "clear";

  const [state, send] = useMachine(
    combobox.machine({
      id: inputId,
      collection,
      name: merged.name,
      inputBehavior: merged.inputBehavior,
      openOnClick: merged.openOnClick,
      value: merged?.value,
      selectionBehavior: merged.selectionBehavior,
      onOpenChange(details) {
        if (!details.open) return;
        setOptions(options());
      },
      onValueChange(details) {
        if (typeof merged.callback !== "undefined") {
          merged.callback(details);
        }
        if (clearValue) api().clearValue();
      },
      onInputValueChange({ value }) {
        const filtered = props.options.filter((item) =>
          item.label.toLowerCase().includes(value.toLowerCase()),
        );
        if (filtered.length > 0) {
          let firstOption = filtered.at(0);
          if (firstOption?.value) {
            api().highlightValue(firstOption.value);
          }
        }
        setOptions(filtered.length > 0 ? filtered : options());
      },
    }),
    {
      context: { collection },
    },
  );

  const api = createMemo(() => combobox.connect(state, send, normalizeProps));

  return (
    <div class="zagSelect">
      <div {...api().rootProps}>
        <LabelComponent
          {...api().labelProps}
          id={api().labelProps.for}
          label={props.label}
          required={merged.required}
        />
        <div class="relative">
          <div {...api().controlProps}>
            <input
              class={merged.classes}
              required={merged.required}
              {...api().inputProps}
            />
            <button {...api().triggerProps}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 1024 1024"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
              </svg>
            </button>
          </div>
          <div {...api().contentProps}>
            <Show when={options().length > 0 || merged.allowCreate}>
              <ul>
                <For each={options()}>
                  {(item, index) => (
                    <li
                      {...api().getItemProps({
                        item,
                      })}
                    >
                      {item.new ? (
                        <span>
                          Create <span class="newOption">{item.label}</span>
                        </span>
                      ) : (
                        item.label
                      )}
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};
