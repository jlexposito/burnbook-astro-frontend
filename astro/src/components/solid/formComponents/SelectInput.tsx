import { Component } from "solid-js";
import { Select, createOptions } from "@thisbeyond/solid-select";

import "@thisbeyond/solid-select/style.css";
import "@styles/Select.css"

type SelectOiption = { 
  name: string;
  label?: string;
}

const SelectInput: Component<{
  id: string;
  options: SelectOiption[];
  name: string;
  placeholder?: string;
  createable?: boolean;
}> = (props) => {
  const defaultOptions =  [
    { name: "fallbackOption", label: "fallback" },
    { name: "fallback2" },
  ]
  const createable = props.createable || false;
  const selectOptions = props.options || defaultOptions
  let selectConfig = {
    key: "name"
  }
  if (createable) {
    Object.assign(selectConfig, {createable: true});
  }
  const selectProps = createOptions(
    selectOptions,
    selectConfig,
  );
  return <Select 
    class="autofill-select"
    placeholder={props.placeholder}
    id={props.id}
    name={props.name}
    {...selectProps}
  />;

  
};

export default SelectInput;


