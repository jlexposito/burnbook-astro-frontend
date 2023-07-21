import { Component, mergeProps} from "solid-js";


const LabelComponent: Component<{
    label: string;
    id: string;
    classes?: string;
}> = (props) => {
  const merged = mergeProps(
    {
      classes:
        "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 hover:cursor-pointer",
    },
    props
  );
  return (
    <>
      <label
        class={merged.classes}
        for={props.id}
      >
        {props.label}
      </label>
    </>
  );
};

export default LabelComponent;
