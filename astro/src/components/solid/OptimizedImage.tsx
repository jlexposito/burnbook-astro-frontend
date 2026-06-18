import { getOptimizedImage } from "@utils/images/getOptimizedImage";
import type { ImageSlot } from "@utils/images/imageSlots";

type Props = {
  filename: string;
  slot?: ImageSlot;
  altTitle?: string;
  class?: string;
  loading?: "lazy" | "eager";
  highPriority?: boolean;
};

export default function OptimizedImage(props: Props) {
  const image = getOptimizedImage(props.filename, props.slot ?? "full");

  if (!image) return null;

  const fallback = image.fallback;
  const isProd = import.meta.env.PROD;
  return (
    <picture class={props.class}>
      {image.sources.map((source) => (
        <source
          srcset={source.srcSet}
          sizes={source.sizes}
          type={`image/${source.type}`}
        />
      ))}

      <img
        // src={fallback.src}
        srcset={fallback.srcSet}
        sizes={fallback.sizes}
        alt={props.altTitle ?? ""}
        class={props.class}
        loading={props.loading ?? "lazy"}
        fetchpriority={props.highPriority ? "high" : undefined}
        crossorigin={isProd ? "anonymous" : undefined}
      />
    </picture>
  );
}