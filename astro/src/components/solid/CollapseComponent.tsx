import "@styles/CollapseComponent.css";

import { JSX, Component, createSignal } from "solid-js";
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
  let classes = "CollapseTransition";
  if (props.classes) {
    classes = `${classes} ${props.classes}`;
  }

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
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          {props.title}
        </button>
        <span class="ChevronButton hover:cursor-pointer">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="transition:transform 200ms ease-out;"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </div>
      <Collapse value={isExpanded()} class={classes}>
        {props.children}
      </Collapse>
    </div>
  );
};
export default CollapseComponent;
