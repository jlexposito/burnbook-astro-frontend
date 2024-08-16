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

  const FILETYPES = ['avif', 'webp', 'jpeg']
  const imageSources = (): ImageSources[] => {
    return FILETYPES.map((filetype) => srcSet(imageSizes, props.filename, filetype));
  };

  props = mergeProps(
    {
      classes: "",
      lazyLoad: false,
      sizes: imageSources().slice().shift().sizes
    },
    props,
  );

  const sources = imageSources()

  const generatePictureSource = (source: ImageSources) => { 
    return (
      <source
        srcset={source.srcSet}
        sizes={props.sizestring}
        src={source.src}
      />
    )
  }

  const generateImageSource = (source: ImageSources) => { 
    return (
      <img
        srcset={source.srcSet}
        sizes={props.sizestring}
        src={source.src}
        width={props.width}
        height={props.height}
        alt={props.altTitle}
        class={props.classes}
        loading={props.lazyLoad ? "lazy" : "eager"}
      />
    )
  }


  return (
    <picture class={props.classes}>
        {
          sources.map((source, index) => (
            (index === sources.length - 1) ?
            ( 
              generatePictureSource(source)
            ): (
              generateImageSource(source)
              
            )
          ))
        }
      </picture> 
    
  );
};

export default OptimizedImage;
