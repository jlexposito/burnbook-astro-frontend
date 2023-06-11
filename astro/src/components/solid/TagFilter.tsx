import { useStore } from '@nanostores/solid';
import { 
    For,
    onMount,
    createSignal,
    Show 
 } from "solid-js";

import { Tag } from "@utils/interfaces";
import { filterTags } from '@utils/recipeStore';
import TagFilterButton from '@solidcomponents/TagFilterButton';


export default function TagFilters(props: {tagsdata: Array<Tag>}) {
    const [tags, setTagsData] = createSignal([]);
    const $activeFilter = useStore(filterTags);

    onMount(() => {
        const highlightedTags = props.tagsdata == null ? [] : 
            props.tagsdata.filter((tag) => {return tag.highligthed});
        setTagsData(highlightedTags);
    });


    const isActive = (tagname: string): boolean => {
        if ($activeFilter().length)
            return $activeFilter().indexOf(tagname) >= 0;
        return false;
    }

    return (
    <>
        <Show when={(tags() && tags().length)}>
            <div class="fixed bottom-0 w-full last:pb-1 last:md:pb-4">
                <div class="filter tags items-center justify-center flex flex-row flex-wrap gap-2 gap-y-1">
                    <For each={tags()}> 
                        {(tag) => <TagFilterButton active={isActive(tag.name)} tagname={tag.name} clearButton={false} />}
                    </For>
                    <TagFilterButton active={false} tagname={''} clearButton={true} />
                </div>
            </div>
        </Show>
    </>   
    )
}