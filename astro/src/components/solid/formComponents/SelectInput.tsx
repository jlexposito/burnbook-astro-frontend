// solid Select
import { Select, createOptions } from "@thisbeyond/solid-select";

// custom css
import "@styles/SelectInput.css";

// types
import type { Component } from "solid-js";
import { createUniqueId, createSignal, splitProps } from "solid-js";

import LabelComponent from "@solidcomponents/formComponents/LabelComponent";
import { twMerge } from "tailwind-merge";

const SelectInput: Component<{
  config: any;
  label: string;
  name: string;
  initialValue: string;
  classes?: string;
  required?: boolean;
  format?: any;
}> = (props) => {
  const inputId = createUniqueId();
  const [local, otherProps] = splitProps(props, [
    "classes",
    "required",
    "label",
    "initialValue",
    "format",
    // "onChangeCallback",
  ]);
  const classes = twMerge("custom", local.classes);
  const required = local?.required === true;
  console.log(otherProps)


  const onChange = (item: any) => {
    const onChangeCallback = props.config?.onChangeCallback;
    if (typeof onChangeCallback !== "undefined") {
      onChangeCallback(item);
    }
    if (item) {
      setValue(item.value);
    }
  };

  const [value, setValue] = createSignal(
    props?.initialValue ? props.initialValue : "",
  );

  return (
    <div class="recipe-ingredient">
      <LabelComponent required={required} label={props.label} id={inputId} />
      <Select
        id={inputId}
        class={classes}
        {...otherProps.config}
        onChange={onChange}
        format={local?.format}
      />
      <input type="hidden" name={props.name} value={value()} />
    </div>
  );
};

export { SelectInput };
