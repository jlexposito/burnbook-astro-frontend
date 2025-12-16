import { type Component, mergeProps } from "solid-js";

import { srcSet } from "@utils/optimizeImage";
import type { ImageFileFormat, ImageSources, ImgSizeTypes, ImgSizes } from "@utils/interfaces";

const OptimizedImage: Component<{
  sizes: ImgSizes;
  sizeType: ImgSizeTypes; 
  filename: string;
  altTitle: string;
  width: number;
  height: number;
  classes: string;
  lazyLoad: boolean;
  quality?: number;
  highPriority?: boolean;
}> = (props) => {
  const quality = 100
  const FILETYPES = ['avif', 'webp', 'jpeg']
  const imageSources = (): ImageSources[] => {
    let sources: ImageSources[] = []
    FILETYPES.forEach((filetype : ImageFileFormat) => sources.push(
      srcSet(props.sizes, props.filename, filetype, props.sizeType)
    ));
    return sources
  };

  props = mergeProps(
    {
      classes: "",
      lazyLoad: false,
      sizes: imageSources().slice().shift()
    },
    props,
  );

  const sources = imageSources()

  const generatePictureSource = (source: ImageSources) => { 
    return (
      <source
        srcset={source.srcSet}
        sizes={source.sizes}
        type={`image/${source.type}`}
        />
    )
  }

  const generateImageSource = (source: ImageSources) => { 
    return (
      <img
        srcset={source.srcSet}
        sizes={source.sizes}
        src={source.src}
        width={props.width}
        height={props.height}
        alt={props.altTitle}
        class={props.classes}
        loading={props.lazyLoad ? "lazy" : "eager"}
        type={`image/${source.type}`}
        {...(props.highPriority ? { fetchPriority: "high" } : {})}
      />
    )
  }


  return (
    <picture class={props.classes}>
        {
          sources.map((source, index) => (
            (index === sources.length - 1) ?
            ( 
              generateImageSource(source)
            ): (
              generatePictureSource(source)
            )
          ))
        }
      </picture> 
    
  );
};

export default OptimizedImage;
