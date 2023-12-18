// solid Select
import "@thisbeyond/solid-select/style.css";
import { Select, createOptions } from "@thisbeyond/solid-select";

// custom css
import "@styles/SelectInput.css";

// types
import type { Ingredient, SelectValueChangeCallback } from "@utils/interfaces";
import type { Component } from "solid-js";
import { createMemo, createUniqueId, createSignal } from "solid-js";

import LabelComponent from "@solidcomponents/formComponents/LabelComponent";

const IngredientForm: Component<{
  options: Ingredient[];
  name: string;
  initialValue?: Ingredient;
  onChange?: SelectValueChangeCallback<Ingredient>;
}> = (props) => {
  const inputId = createUniqueId();
  const initialName = props?.initialValue?.name;
  const initialPrefix = props?.initialValue?.prefix;

  const createOptionsArray = (elements: Ingredient[]) => {
    let options: IngredientOption[] = [];
    for (let i = 0; i < elements?.length; i++) {
      let opt = elements[i];
      let value = opt.name;
      if ("prefix" in opt && opt.prefix.length) {
        value = `${opt.prefix} ${value}`;
      }
      options.push({
        label: value,
        disabled: false,
        ...opt,
      });
    }
    return options;
  };

  type item = {
    value: Ingredient | string;
    label: string;
    prefix?: string;
    name?: string;
  };

  const format = (item: Ingredient | item, type: "option" | "value") => {
    // This is a little hack since we receive a different object from the fuzzySearch
    if ("name" in item) {
      let label = `${item.prefix}  ${item.name}`;
      return type === "option" ? label : item.name;
    }
    let value = item?.value ? item.value.name : item.label;
    return type === "option" ? item.label : value;
  };

  const optionsArray = createMemo(() => {
    return createOptionsArray(props.options);
  });

  const selectedValue = createMemo(() => {
    return optionsArray().find(function (ingredient: IngredientOption) {
      return (
        ingredient.name == initialName && ingredient.prefix == initialPrefix
      );
    });
  });

  const ingredientOptions = createMemo(() => {
    return createOptions(optionsArray(), {
      createable: true,
      filterable: true,
      key: "label",
    });
  });

  type IngredientOption = Ingredient & {
    label: string;
    disabled: boolean;
  };

  const onChange = (item: IngredientOption) => {
    if (typeof props.onChange !== "undefined") {
      props.onChange(item);
    }
    if (item) {
      setValue(item.name);
    }
  };

  const [value, setValue] = createSignal(
    props?.initialValue ? props.initialValue.name : "",
  );

  return (
    <>
      <LabelComponent label="Ingrediente" id={inputId} />
      <Select
        id={inputId}
        class="custom"
        {...ingredientOptions()}
        initialValue={selectedValue()}
        format={format}
        onChange={onChange}
      />
      <input type="hidden" value={value()} />
    </>
  );
};

export default IngredientForm;
