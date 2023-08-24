import { Component, mergeProps } from "solid-js";

import { srcSet } from "@utils/optimizeImage";
import { ImageSources } from "@utils/interfaces";

const OptimizedImage: Component<{
	widthSizes: Array<number>;
	filename: string;
	altTitle: string;
	width: number;
	height: number;
	classes: string;
	lazyLoad: boolean;
}> = (props) => {
	props = mergeProps(
		{
			classes: "",
			lazyLoad: false,
		},
		props,
	);

	const imageSources = (): ImageSources => {
		return srcSet(props.widthSizes, props.filename, "webp");
	};

	return (
		<img
			class={props.classes}
			width={props.width}
			height={props.height}
			src={imageSources().src}
			srcset={imageSources().srcSet}
			sizes={imageSources().sizes}
			loading={props.lazyLoad ? "lazy" : "eager"}
			alt={props.altTitle}
		/>
	);
};

export default OptimizedImage;
