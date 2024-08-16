import { type Component, mergeProps } from "solid-js";

import { srcSet } from "@utils/optimizeImage";
import type { ImageSources, ImgSizeTypes, ImgSizes } from "@utils/interfaces";

const OptimizedImage: Component<{
  sizes: Array<number>;
  sizeType: ImgSizeTypes; 
  filename: string;
  altTitle: string;
  width: number;
  height: number;
  classes: string;
  lazyLoad: boolean;
  sizestring: string;
}> = (props) => {
  const imageSizes: ImgSizes = {
    type: props.sizeType,
    sizes: props.sizes
  }
  const imageSources = (): ImageSources => {
    return srcSet(imageSizes, props.filename, "webp");
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
      srcset={imageSources().srcSet}
      sizes={props.sizestring}
      width={props.width}
      height={props.height}
      src={imageSources().src}
      loading={props.lazyLoad ? "lazy" : "eager"}
      alt={props.altTitle}
    />
  );
};

export default OptimizedImage;
