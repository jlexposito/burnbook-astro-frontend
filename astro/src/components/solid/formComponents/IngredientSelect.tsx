// solid Select
import { Select, createOptions } from "@thisbeyond/solid-select";

// custom css
import "@styles/SelectInput.css";

// types
import type { Ingredient, SelectValueChangeCallback } from "@utils/interfaces";
import type { Component } from "solid-js";

import { createMemo, createUniqueId, createSignal } from "solid-js";

import LabelComponent from "@solidcomponents/formComponents/LabelComponent";

const IngredientSelect: Component<{
  label: string;
  name: string;
  options: Ingredient[];
  initialValue?: Ingredient;
  required?: boolean;
  onChange?: SelectValueChangeCallback<Ingredient>;
}> = (props) => {
  const inputId = createUniqueId();
  const initialName = props?.initialValue?.name;
  const initialPrefix = props?.initialValue?.prefix;
  const required = props?.required ? props.required : true;

  const createOptionsArray = (elements: Ingredient[]) => {
    let options: item[] = [];
    for (let i = 0; i < elements?.length; i++) {
      let opt = elements[i];
      if (typeof opt !== "object") {
        continue;
      }
      let value = opt?.name;
      let label = value;
      if ("prefix" in opt && opt.prefix.length) {
        label = `${opt.prefix} ${value}`;
      }
      options.push({
        label: label,
        value: value,
        disabled: false,
        ...opt,
      });
    }
    return options;
  };

  type item = Ingredient & {
    value: string;
    label: string;
    disabled?: boolean;
  };

  const format = (item: item, type: "option" | "value") => {
    const label = item?.label ? item.label : "error";
    if (type === "option") {
      return label;
    }
    const value = item?.value;
    return value ? value : label;
  };

  const optionsArray = createMemo(() => {
    return createOptionsArray(props.options);
  });

  const selectedValue = createMemo(() => {
    return optionsArray().find(
      (ingredient: item) =>
        ingredient?.name === initialName &&
        ingredient?.prefix === initialPrefix,
    );
  });

  const ingredientOptions = createMemo(() => {
    return createOptions(optionsArray(), {
      createable: true,
      key: "label",
    });
  });

  const onChange = (item: item) => {
    if (typeof props.onChange !== "undefined") {
      props.onChange(item);
    }

    if (item) {
      let value = "value" in item ? item.value : item?.label;
      setValue(value);
    } else {
      setValue("");
    }
  };

  const [value, setValue] = createSignal(
    props?.initialValue ? props.initialValue.name : "",
  );

  return (
    <div class="recipe-ingredient">
      <LabelComponent label={props.label} id={inputId} required={required} />
      <Select
        id={inputId}
        class="custom"
        {...ingredientOptions()}
        initialValue={selectedValue()}
        format={format}
        onChange={onChange}
        placeholder=""
      />
      <input type="hidden" name={props.name} value={value()} />
    </div>
  );
};

export default IngredientSelect;
