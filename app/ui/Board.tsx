'use client'
import React, {useState, useEffect} from 'react';
import {DndContext, useSensors, useSensor, MouseSensor, TouchSensor,} from '@dnd-kit/core';
import {Droppable} from './Droppable';
import {draggables, setup} from '../lib/pieces';
import clsx from 'clsx';
import chess from 'chess';

export const gameClient = chess.create();

export default function Board() {
    const [activeDraggable, setActiveDraggable] = useState('');
    const [squares, setSquares] = useState(setup);
    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor);
    const sensors = useSensors(mouseSensor, touchSensor);

    return (
        <DndContext id="42721f6b-df8b-45e5-aa5e-0d6a830e2032"
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                    sensors={sensors}
        >
            <div className='flex flex-col items-center'>
                {[8, 7, 6, 5, 4, 3, 2, 1].map((rank: number, i: number) => {
                    return (
                        <div key={rank} className='flex flex-row'>
                            {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((file: string, j: number) => {
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
                                        <Droppable id={`${file}${rank}`} >
                                            {(() => {
                                                const draggable = Object.keys(squares).find((square) => {
                                                    return square === `${file}${rank}`;
                                                })
                                                // [1] is the array storage cell of the draggable being dropped, (i.e., if one is dropped)
                                                // see init variable
                                                return draggable ? squares[`${file}${rank}`][1] : <div className="h-[78px] w-[78px]"></div>
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
        const wasFileRank = Object.keys(newSquares).find((square) => {
            return newSquares[square][0] === activeDraggable;
        });

        if (over && wasFileRank && (over.id !== wasFileRank)) {
            newSquares[over.id] = [activeDraggable, draggables[activeDraggable]];
            delete newSquares[wasFileRank];
            setSquares(newSquares);
            gameClient.move(over.id);
        }
    }

    function handleDragStart(e: any){
        setActiveDraggable(e.active.id);
    }
  }