import {
	JSX,
	Component,
	createUniqueId,
	mergeProps,
	onMount,
	splitProps,
	SplitProps as _SplitProps,
} from "solid-js";
import LabelComponent from "./LabelComponent";

type SplitProps<T, K extends (readonly (keyof T)[])[]> = T extends unknown
	? _SplitProps<T, K>
	: never;

type InputTypes = "text" | "input" | "textarea" | "number";

type Test<T extends InputTypes = InputTypes> = {
	id?: string;
	name?: string;
	label?: string;
	dynamicValue?: any | null;
	required?: boolean;
	onChange?: any;
} & (T extends "textarea"
	? JSX.TextareaHTMLAttributes<HTMLTextAreaElement> & { type: T }
	: JSX.InputHTMLAttributes<HTMLInputElement> & { type?: T });

const FormInput: Component<Test> = (props) => {
	const id = props.id || createUniqueId();
	const handleKeyPress = (event: Event): void => {
		event.preventDefault();
		event.stopPropagation();
	};

	const merged = mergeProps(
		{
			type: "text" as const,
			classes: "max-w-full w-full px-3",
			onKeyPress: handleKeyPress,
		},
		props,
	);
	let label = props.label || props.name;
	const [_, htmlattributes] = splitProps(props, [
		"label",
		"onChange",
	]) as SplitProps<typeof props, ["label"[]]>;

	return (
		<>
			<LabelComponent id={id} label={label} required={props.required} />
			{htmlattributes.type === "textarea" ? (
				<textarea id={id} class={merged.classes} {...htmlattributes} />
			) : (
				<input
					id={id}
					class={merged.classes}
					{...htmlattributes}
					onChange={(e) => {
						if (typeof props.onChange === "function") {
							props.onChange(id, e.target.value);
						}
					}}
				/>
			)}
		</>
	);
};

export default FormInput;
