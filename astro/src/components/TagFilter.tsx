import { useStore } from '@nanostores/solid';
import { setFilterTags, filterTags, tags } from '../recipeStore';

import Tag from './Tag';

import { For, onMount } from "solid-js";

export default function TagFilters() {
    const $tags = useStore(tags);
    const $ActiveFilter = useStore(filterTags);

    const highlightedTags = $tags().filter((tag) => {return tag.highligthed});

    const setTagFilter = (tagname: string, event: Event) => {
        console.log('clicked');
        console.log(tagname);
    }

    onMount(async () => {
        setFilterTags('cena');
    })

    return (
     <>
        <div class="fixed bottom-0 w-full last:pb-4">
            <div class="filter tags justify-center flex gap-2">
                <Tag active={true} tagname='Works' />
                <For each={highlightedTags}> 
                    {(tag) => <Tag active={true} tagname={tag.name} />}
                </For>
            </div>
        </div>
     </>   
    )
}