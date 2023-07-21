import { JSX, Component, mergeProps, splitProps, SplitProps as _SplitProps } from "solid-js";
import LabelComponent from "./LabelComponent";
import { v4 as uuidv4 } from "uuid";


type SplitProps<T, K extends (readonly (keyof T)[])[]> = T extends unknown ? _SplitProps<T, K> : never;

type InputTypes = "text" | "input" | "textarea" | "number";

type Test<T extends InputTypes = InputTypes> = {
  name?: string;
  label?: string;
} & (T extends "textarea"
  ? JSX.TextareaHTMLAttributes<HTMLTextAreaElement> & { type: T }
  : JSX.InputHTMLAttributes<HTMLInputElement> & { type?: T });

const FormInput: Component<Test> = (props) => {
  const merged = mergeProps(
    {
      type: "text" as const,
      classes:
        "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500",
    },
    props
  );
  const id = uuidv4();
  const label = props.label || props.name
  const [_, htmlattributes] = splitProps(props, ["label"]) as SplitProps<typeof props, ["label"[]]>;

  return (
    <>
      <LabelComponent id={id} label={label} />
      {htmlattributes.type === "textarea" ? (
        <textarea id={id} class={merged.classes} {...htmlattributes} />
      ) : (
        <input id={id} class={merged.classes} {...htmlattributes} />
      )}
    </>
  );
};

export default FormInput;
