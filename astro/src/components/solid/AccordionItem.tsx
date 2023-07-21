import { Component } from "solid-js";

const AccordionItem: Component<{
    title: string;
    children: JSXElement;
    api: Accessor<accordion.PublicApi<PropTypes>>;
}> = (props) => {
  
  return (
    <div {...api().getItemProps({ value: props.title })}>
    <h3>
      <button {...api().getTriggerProps({ value: props.title })}>
        {props.title}
      </button>
    </h3>
    <div {...api().getContentProps({ value: props.title })}>
      { props.children }
    </div>
  </div>
    );
};