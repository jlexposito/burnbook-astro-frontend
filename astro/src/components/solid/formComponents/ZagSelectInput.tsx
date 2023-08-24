import "@styles/ZagSelectInput.css";

import * as combobox from "@zag-js/combobox";
import { normalizeProps, useMachine } from "@zag-js/solid";
import {
	Component,
	createMemo,
	createSignal,
	createUniqueId,
	For,
	Show,
} from "solid-js";
import LabelComponent from "./LabelComponent";
import { ComboboxOption } from "@utils/interfaces";

export function SelectInput(props: {
	options: ComboboxOption[];
	name: string;
	label: string;
	allowCreate?: boolean;
}) {
	const [options, setOptions] = createSignal<ComboboxOption[]>(props.options);
	const [selectedNewOption, setNewSelectedOption] = createSignal("");
	const inputId = createUniqueId();
	const allowCreation = props.allowCreate || false;

	const createNewOption = (
		label: string,
		code: string,
		disabled: boolean,
	) => {
		return {
			label: label,
			code: code,
			disabled: disabled,
			new: true,
		};
	};

	const [state, send] = useMachine(
		combobox.machine({
			id: inputId,
			name: props.name,
			inputBehavior: "autohighlight",
			allowCustomValue: allowCreation,
			openOnClick: true,
			onOpen() {
				if (
					api().inputValue.trim().length &&
					!api().isInputValueEmpty
				) {
					console.log(selectedNewOption());
					let newOption = createNewOption(
						selectedNewOption(),
						selectedNewOption(),
						false,
					);
					setOptions([...props.options, newOption]);
				} else {
					setOptions(props.options);
				}
			},
			onInputChange({ value }) {
				setNewSelectedOption(value);
				const filtered = props.options.filter((item) =>
					item.label.toLowerCase().includes(value.toLowerCase()),
				);
				if (allowCreation) {
					let newValue = {
						label: value,
						code: value,
						disabled: false,
						new: true,
					};
					filtered.push(newValue);
					setOptions(filtered);
					api().setValue(value);
				} else {
					setOptions(filtered.length > 0 ? filtered : props.options);
				}
			},
		}),
	);

	const api = createMemo(() => combobox.connect(state, send, normalizeProps));

	return (
		<div class="zagSelect">
			<div {...api().rootProps}>
				<LabelComponent
					{...api().labelProps}
					id={api().labelProps.for}
					label={props.label}
				/>
				<div class="relative">
					<div {...api().controlProps}>
						<input {...api().inputProps} />
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
						<Show when={options().length > 0 || allowCreation}>
							<ul>
								<For each={options()}>
									{(item, index) => (
										<li
											{...api().getOptionProps({
												label: item.label,
												value: item.code,
												index: index(),
												disabled: item.disabled,
											})}
										>
											{item.new ? (
												<span>
													Create{" "}
													<span class="newOption">
														{item.label}
													</span>
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
}
