import { 
  Component,
  mergeProps
} from "solid-js";

import { srcSet } from '../../utils/optimizeImage';
import { ImageSources } from "../../utils/interfaces";

const OptimizedImage: Component<{
    widthSizes: Array<number>,
    filename: string,
    altTitle: string,
    classes: string
}> = (props) => {
    props = mergeProps({
        classes: '',
    }, props);

    const imageSources = (): ImageSources => {
        return srcSet(props.widthSizes, props.filename);
    }
  
    return (
        <img class={props.classes} src={imageSources().src} srcset={imageSources().srcSet} sizes={imageSources().sizes} alt={props.altTitle}/> 
    )
  ;
};

export default OptimizedImage;