
import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

export function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });
  {/*
    the attributes are
      {
        "role": "button",
        "tabIndex": 0,
        "aria-disabled": false,
        "aria-roledescription": "draggable",
        "aria-describedby": "DndDescribedBy-0"
      }
    the listeners are
      {
        onPointerDown: ƒunction,
        onKeyDown: ƒunction
      }
  */}
  const style = {
    // Outputs `translate3d(x, y, 0)`
    /* How come not as follows ... ?
          transform: CSS.Translate.toString({transform})
    */
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}
