import type { ImageSources, ImgSizes, ImgSizeTypes } from "@utils/interfaces";

const baseUrl = import.meta.env.PUBLIC_IMAGE_BASE || "";
const optimizeImages = import.meta.env.PUBLIC_OPTIMIZE_IMAGES || 0;
const baseCDNUrl = baseUrl + (baseUrl.endsWith("/") ? "" : "/");

export const getFilename = (url: string): string => {
  return url.split("/").slice(-1).shift();
};
export const imgSrc = (
  filename: string,
  size: number,
  format: string,
  type: ImgSizeTypes
): string => {
  // Resize operation
  let url = `${baseCDNUrl}resize?file=${filename}&${type}=${size}`;
  // convert image to the desired format
  if (!filename.endsWith(format)) {
    url += `&type=${format}`;
  }
  return url;
};

export const srcSet = (
  sizeObj: ImgSizes, 
  url: string,
  format: string,
): ImageSources => {
  let result = {
    src: "",
    srcSet: "",
    sizes: "",
  };

  if (optimizeImages != 1) {
    result["src"] = url;
    return result;
  }

  if (!sizeObj.sizes || sizeObj.sizes.length == 0) return result;

  // Make a copy with .slice()
  var biggestRes: number = sizeObj.sizes.slice().shift();
  var srcSets: Array<string> = [];
  var sizes: Array<string> = [];
  let filename = getFilename(url);

  if (sizeObj.sizes.length > 1) {
    let sortedWidthSizes = sizeObj.sizes.slice().sort((a, b) => a - b);
    biggestRes = sortedWidthSizes.slice(-1).shift();
    sortedWidthSizes.forEach((size, index) => {
      // See format in https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
      let srcSet = `${imgSrc(filename, size, format, sizeObj.type)} ${size}w`;
      srcSets.push(srcSet);
      let querySize = "";
      if (index == sortedWidthSizes.length - 1) {
        querySize = `${size}px`;
      } else {
        querySize = `(max-width: ${size}px) ${size}px`;
      }
      sizes.push(querySize);
    });
  }
  result["src"] = imgSrc(filename, biggestRes, format, sizeObj.type);
  result["srcSet"] = srcSets.join(", ");
  result["sizes"] = sizes.join(", ");

  return result;
};
