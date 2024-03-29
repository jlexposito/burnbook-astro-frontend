import { type Component, mergeProps } from "solid-js";

const LabelComponent: Component<{
  label: string;
  id: string;
  classes?: string;
  required?: boolean;
}> = (props) => {
  const merged = mergeProps(
    {
      classes:
        "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 hover:cursor-pointer",
      required: false,
    },
    props,
  );
  let label = props.label;
  if (merged.required) label = `${label} *`;

  return (
    <>
      <label class={merged.classes} for={props.id}>
        {label}
      </label>
    </>
  );
};

export default LabelComponent;
