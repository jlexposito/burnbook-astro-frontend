import { JSX, Component } from "solid-js";

import { createSignal } from "solid-js";
import { Collapse } from "solid-collapse";

const CollapseComponent: Component<{
  title: string;
  expanded?: boolean;
  titleClasses?: string;
  classes?: string;
  children: JSX.Element;
}> = (props) => {
  let expanded = props.expanded || false;
  const [isExpanded, setIsExpanded] = createSignal(expanded);
  const toggleExpanded = (event: Event): void => {
    event.preventDefault();
    setIsExpanded(!isExpanded());
  };

  return (
    <div
      classList={{
        collapsable: true,
        expanded: isExpanded(),
      }}
    >
      <div class="title" onClick={toggleExpanded}>
        <button
          class={props.titleClasses ? props.titleClasses : "toggleButton"}
          onClick={(event) => {event.preventDefault();}}
        >
          {props.title}
        </button>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </div>
      <Collapse value={isExpanded()} class="my-transition">
        {props.children}
      </Collapse>
    </div>
  );
};
export default CollapseComponent;
