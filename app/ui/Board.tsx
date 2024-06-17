import React, {useState} from 'react';
import {DndContext} from '@dnd-kit/core';
import {Draggable} from './Draggable';
import {Droppable} from './Droppable';
import clsx from 'clsx';

export default function Board() {
    const [parent, setParent] = useState('droppable11');
    const [parent2, setParent2] = useState('droppable12');
    const [activeDraggable, setActiveDraggable] = useState(null);
    const draggable = (
      <Draggable id='draggable'>
        <img src='/github.png'/>
      </Draggable>
    );
    const draggable2 = (
        <Draggable id='draggable2'>
          <img src='/linkedin.png'/>
        </Draggable>
    );

    return (
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <div className='flex flex-col items-center'>
                {[1, 2, 3, 4 ,5 ,6, 7, 8].map((rank: number, i: number) => {
                    return (
                        <div key={rank} className='flex flex-row'>
                            {[1, 2, 3, 4 ,5 ,6, 7, 8].map((file: number, j: number) => {
                                const n = i + j;
                                return (
                                    <div key={file} 
                                        className={clsx('h-[80px] w-[80px] flex items-center',
                                            {
                                                'bg-white text-black' : n % 2 === 0,
                                                'bg-black text-white' : n % 2 === 1
                                            }
                                        )}
                                    >
                                        {rank}{file}
                                        <Droppable id={`droppable${rank}${file}`} >
                                            {(() => {
                                                if (parent === `droppable${rank}${file}`) {
                                                    return draggable;
                                                } else if (parent2 === `droppable${rank}${file}`) {
                                                    return draggable2;
                                                } else {
                                                    return 'Drop here';
                                                }
                                            })()}
                                            {/* {parent === `droppable${rank}${file}` ? draggable : 'Drop here'} */}
                                        </Droppable>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </DndContext>
    );

    function handleDragEnd({over} : {over: any}) {
        if (activeDraggable === 'draggable') {
            setParent(over ? over.id : null);
        } else {
            setParent2(over ? over.id : null);
        }
    }

    function handleDragStart(e: any){
        setActiveDraggable(e.active.id);
    }
  }