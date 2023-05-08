import { useStore } from '@nanostores/solid';
import { For, onMount, createSignal } from "solid-js";

import { TagType } from "../../utils/interfaces";
import { filterTags } from '../../utils/recipeStore';
import Tag from './Tag';


export default function TagFilters(props: {tagsdata: Array<TagType>}) {
    const [tags, setTagsData] = createSignal([]);
    const $activeFilter = useStore(filterTags);


    onMount(() => {
        const highlightedTags = props.tagsdata.filter((tag) => {return tag.highligthed});
        setTagsData(highlightedTags);
    });


    function isActive(tagname: string): boolean {
        if ($activeFilter().length)
            return $activeFilter().indexOf(tagname) >= 0;
        return false;
    }

    return (
     <>
        <div class="fixed bottom-0 w-full last:pb-4">
            <div class="filter tags justify-center flex gap-2">
                <For each={tags()}> 
                    {(tag) => <Tag active={isActive(tag.name)} tagname={tag.name} clearButton={false} />}
                </For>
                <Tag active={false} tagname={''} clearButton={true} />
            </div>
        </div>
     </>   
    )
}