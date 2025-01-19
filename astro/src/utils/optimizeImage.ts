import type { ImageSources, ImgSizes, ImgSizeTypes, ImageFileFormat } from "@utils/interfaces";

const baseUrl = import.meta.env.PUBLIC_IMAGE_BASE || "";
const optimizeImages = import.meta.env.PUBLIC_OPTIMIZE_IMAGES || 0;
const baseCDNUrl = baseUrl + (baseUrl.endsWith("/") ? "" : "/");

export const getFilename = (url: string): string => {
  return url.split("/").slice(-1).shift();
};
export const imgSrc = (
  filename: string,
  size: number,
  ImageFormat: ImageFileFormat,
  type: ImgSizeTypes,
  quality?: number
): string => {
  const width = type === 'width' ? size : 0
  const height = type === 'height' ? size : 0
  const imgQuality = quality ? quality : 60

  const path =
    // Resize operation
    `/size:${width}:${height}` +
    `/resizing_type:fill` +
    (imgQuality ? `/quality:${imgQuality}` : "") +
    // `/sharpen:0.5` +
    `/plain/local:///${filename}` +
    `@${ImageFormat}`
  const url = `${baseCDNUrl}insecure${path}`

  return url;
};

export const srcSet = (
  sizeObj: ImgSizes,
  url: string,
  imageFormat: ImageFileFormat,
  sizeType: ImgSizeTypes,
  quality?: number,
): ImageSources => {
  let result = {
    src: "",
    srcSet: "",
    sizes: "",
    type: "",
  };

  if (optimizeImages != 1) {
    result["src"] = url;
    return result;
  }

  if (!sizeObj.sizes || sizeObj.sizes.length == 0) return result;

  // Make a copy with .slice() and set the biggest to the first one
  var biggestRes: number = sizeObj.sizes.slice().shift().size;
  var srcSets: Array<string> = [];
  var sizes: Array<string> = [];
  let filename = getFilename(url);

  if (sizeObj.sizes.length > 1) {
    let sortedWidthSizes = sizeObj.sizes.slice().sort((a, b) => a.size - b.size);
    biggestRes = sortedWidthSizes.slice(-1).shift().size;
    sortedWidthSizes.forEach((imgSize, index) => {
      let size = imgSize.size
      // See ImageFormat in https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
      let srcSet = `${imgSrc(filename, size, imageFormat, sizeType, quality)} ${size}w`;
      srcSets.push(srcSet);
      let querySize = "";
      if (index == sortedWidthSizes.length - 1) {
        querySize = `${size}px`;
      } else {
        querySize = `(max-width: ${size}px) ${size}px`;
      }
      sizes.push(querySize);
    });
  } else if (sizeObj.sizes.length == 1) {
    let size = sizeObj.sizes.slice().shift().size
    sizes.push(`${size}px`);
    let srcSet = `${imgSrc(filename, size, imageFormat, sizeType, quality)} ${size}w`;
    srcSets.push(srcSet)
  }
  
  result["src"] = imgSrc(filename, biggestRes, imageFormat, sizeType);
  result["srcSet"] = srcSets.join(", ");
  result["sizes"] = sizes.join(", ");
  result["type"] = imageFormat

  return result;
};
