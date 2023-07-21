import { Component } from "solid-js";
import { Select, createOptions } from "@thisbeyond/solid-select";

import "@thisbeyond/solid-select/style.css";
import "@styles/Select.css"

const SelectInput: Component<{
  id: string;
  options: string[];
  name: string;
  placeholder?: string;
}> = (props) => {
  const selectProps = createOptions(
    [
      { name: "apple", label: "test" },
      { name: "banana" },
      { name: "pear" },
      { name: "pineapple" },
      { name: "kiwi" },
    ],
    {
      key: "name",
      createable: true,
    }
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


