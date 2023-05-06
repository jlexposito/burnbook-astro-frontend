export default function Tag(props: {active: boolean, tagname: string}) {
    const setTagFilter = (tagname: string, event: Event) => {
        console.log('clicked');
    }

    return (
     <>
        <button
            onClick={ ev => setTagFilter(props.tagname, ev)}
            class="tagbutton bg-amber-300 text-md hover:ring-amber-500 hover:ring-2 hover:cursor-pointer hover:bg-amber-500 active:bg-amber-500 px-3 py-2 rounded-full"
        >{props.tagname}</button>
        
     </>   
    )
}