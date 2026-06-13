import { type Component, mergeProps } from "solid-js";
import { getOptimizedImage } from "@utils/optimizeImage";

const OptimizedImage: Component<{
  filename: string;
  altTitle: string;

  class?: string;
  lazyLoad?: boolean;
  highFetchPriority?: boolean;
}> = (props) => {
  /* Fixture while we keep /media/filename.extension in recipes */
  const getFilename = (path: string): string => {
    return path.split("/").pop() ?? "";
  };
  const merged = mergeProps(
    {
      class: "",
      lazyLoad: true,
      highFetchPriority: false,
    },
    props,
  );
  const filename = getFilename(props.filename);
  const image = getOptimizedImage(filename);

  if (!image) {
    return <img src={filename} alt={props.altTitle} class={merged.class} />;
  }

  return (
    <picture class={merged.class}>
      {image.sources.map((source, i) =>
        i < image.sources.length - 1 ? (
          <source
            type={`image/${source.type}`}
            srcset={source.srcSet}
            sizes="100vw"
          />
        ) : (
          <img
            src={source.src}
            srcset={source.srcSet}
            sizes="100vw"
            alt={props.altTitle}
            class={merged.class}
            loading={merged.lazyLoad ? "lazy" : "eager"}
            decoding="async"
            {...(merged.highFetchPriority ? { fetchpriority: "high" } : {})}
          />
        ),
      )}
    </picture>
  );
};

export default OptimizedImage;
