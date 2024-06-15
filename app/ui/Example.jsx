'use client'
import React, {useState} from 'react';
import {DndContext} from '@dnd-kit/core';
import {Draggable} from './Draggable';
import {Droppable} from './Droppable';

export default function Example() {
  const [parent, setParent] = useState(null);
  const draggable = (
    <Draggable id="draggable">
      Go ahead, drag me.
    </Draggable>
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* if the 'parent' var is NULL (!parent === true),
          then the Draggable component exists outside of the Droppable component,
          i.e. the following expression yields <Draggable . . . />;
      */}

      {!parent ? draggable : null}

      {/* but if the 'parent' var is NOT NULL,
          then the Draggable component does NOT exist outside of the Droppable component,
          but rather . . .
      */}
      <Droppable id="droppable">
        {/* . . . the parent var, being equal to 'droppable',
            makes the Draggable component exist inside the Droppable component,
            i.e. the following expression yields <Draggable . . . />;
        */}
        {parent === "droppable" ? draggable : 'Drop here'}
      </Droppable>
    </DndContext>
  );

  function handleDragEnd({over}) {
    {/*  if Draggable is dropped outside of the Droppable component,
         then over = null.
         But if Draggable is dropped inside the Droppable component,
         then over = {id: 'droppable', rect: Rect, data: {…}, disabled: false}
    */}
    setParent(over ? over.id : null);
  }
}

  