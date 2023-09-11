import { type Component, mergeProps } from "solid-js";

import { srcSet } from "@utils/optimizeImage";
import { type ImageSources } from "@utils/interfaces";

const OptimizedImage: Component<{
  widthSizes: Array<number>;
  filename: string;
  altTitle: string;
  width: number;
  height: number;
  classes: string;
  lazyLoad: boolean;
  sizes?: string;
}> = (props) => {

  const imageSources = (): ImageSources => {
    return srcSet(props.widthSizes, props.filename, "webp");
  };

  props = mergeProps(
    {
      classes: "",
      lazyLoad: false,
      sizes: imageSources().sizes
    },
    props,
  );

  return (
    <img
      class={props.classes}
      width={props.width}
      height={props.height}
      src={imageSources().src}
      srcset={imageSources().srcSet}
      sizes={props.sizes}
      loading={props.lazyLoad ? "lazy" : "eager"}
      alt={props.altTitle}
    />
  );
};

export default OptimizedImage;
