import { file } from "@babel/types";
import { ImageSources } from "./interfaces";
import OptimizedImage from "../components/solid/OptimizedImage";

const baseUrl = import.meta.env.PUBLIC_IMAGE_BASE;
const optimizeImages = import.meta.env.PUBLIC_OPTIMIZE_IMAGES || 0;

export const getFilename = (url: string): string => {
    return url.split("/").slice(-1).shift();
}
export const imgSrc = (filename:string, width:number) : string => {
    let url = baseUrl + (baseUrl.endsWith("/") ? "" : "/")
    return `${url}pipeline?file=${filename}&operations=[{"operation":"convert","params":{"type":"jpeg"}},{"operation":"resize","params":{"width":${width},"type":"jpeg"}}]`
}

export const srcSet = (widthSizes: Array<number>, url: string) : ImageSources => {
    let result = {
        'src': '',
        'srcSet': '',
        'sizes': ''
    }
    console.log(optimizeImages ? 'true':'false')
    if (optimizeImages != 1) {
        result['src'] = url
        return result
    }

    if (!widthSizes || widthSizes.length == 0)
        return result

    // Make a copy with .slice()
    var biggestRes : number = widthSizes.slice().shift()
    var srcSets : Array<string> = []
    var sizes : Array<string> = []
    let filename = getFilename(url)

    if (widthSizes.length == 1) {
        biggestRes = widthSizes.shift()
    } else {
        let sortedWidthSizes = widthSizes.slice().sort((a,b)=>a-b)
        biggestRes = sortedWidthSizes.slice(-1).shift()
        sortedWidthSizes.forEach((size, index) => {
            // See format in https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
            let srcSet = `${imgSrc(filename, size)} ${size}w` 
            srcSets.push(srcSet)
            let querySize = ''
            if (index == sortedWidthSizes.length - 1) {
                querySize = `${size}px`
            } else {
                querySize = `(max-width: ${size}px) ${size}px`
            }
            sizes.push(querySize)
        })
    }
    result['src'] = imgSrc(filename, biggestRes)
    result['srcSet'] = srcSets.join(', ')
    result['sizes'] = sizes.join(', ')
    
    return result
}