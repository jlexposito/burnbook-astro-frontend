import '../../styles/Tag.css'

import { Show } from "solid-js";

import { clearTagFilters, updateTagFilter } from '../../utils/recipeStore.js';


export default function Tag(props: {active: boolean, tagname: string, clearButton: boolean}) {
    const setFilter = (tagname: string, event: Event) => {
        updateTagFilter(tagname);
    }

    const clearFilters = (event: Event) => {
        clearTagFilters();
    }

    function activeClassName() {
        return props.active ?  'active' : '';
    }

    return (
     <>
        { props.clearButton ? 
            <button 
                onClick={ ev => clearFilters(ev)}
                class="tag"
                aria-aria-label="Clear filters"
            >
                <span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg></span>
            </button> : 
            <button
                onClick={ ev => setFilter(props.tagname, ev)}
                class={`${activeClassName()} tag`}
            >
                <Show when={props.active}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"/></svg>
                </Show>
                <span>{props.tagname}</span>
            </button>
        }
        
     </>   
    )
}