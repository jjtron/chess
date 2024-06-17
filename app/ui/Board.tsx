import React, {useState} from 'react';
import {DndContext} from '@dnd-kit/core';
import {Draggable} from './Draggable';
import {Droppable} from './Droppable';
import clsx from 'clsx';

export default function Board() {
    const [activeDraggable, setActiveDraggable] = useState('');
    const draggables: {[key: string]: JSX.Element } = {
        'p1': <Draggable id='p1'><img src='/knight-b.svg'/></Draggable>,
        'p2': <Draggable id='p2'><img src='/queen-w.svg'/></Draggable>
    }
    const init: {[key: string]: [string, JSX.Element]} = {
        '11': ['p1', draggables.p1],
        '12': ['p2', draggables.p2]
    };
    const [squares, setSquares] = useState(init);

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
                                        className={clsx('h-[80px] w-[80px] flex flex-row items-center justify-center',
                                            {
                                                'bg-white text-black' : n % 2 === 0,
                                                'bg-gray-500 text-white' : n % 2 === 1
                                            }
                                        )}
                                    >
                                        <Droppable id={`${rank}${file}`} >
                                            {(() => {
                                                const draggable = Object.keys(squares).find((square) => {
                                                    return square === `${rank}${file}`;
                                                })
                                                // [1] is the array storage cell of the draggable being dropped, (i.e., if one is dropped)
                                                // see init variable
                                                return draggable ? squares[`${rank}${file}`][1] : <div className="h-[78px] w-[78px]"></div>
                                            })()}
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
        const newSquares = {...squares};

        // ensure no collison with a draggable already in the intended droppable
        if (over &&
            Object.keys(newSquares).find((square) => {
                return square === over.id;
            })) {
            return;
        }

        // find the rank-file from which the draggable was moved
        const wasRankFile = Object.keys(newSquares).find((square) => {
            return newSquares[square][0] === activeDraggable;
        });

        if (over && wasRankFile && (over.id !== wasRankFile)) {
            newSquares[over.id] = [activeDraggable, draggables[activeDraggable]];
            delete newSquares[wasRankFile];
            setSquares(newSquares);
        }
    }

    function handleDragStart(e: any){
        setActiveDraggable(e.active.id);
    }
  }