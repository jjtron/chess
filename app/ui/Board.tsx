import {DndContext} from '@dnd-kit/core';
import {Draggable} from './Draggable';
import {Droppable} from './Droppable';
import clsx from 'clsx';

export default function Board() {

    return (
        <div className="flex flex-col">
            {[1, 2, 3, 4 ,5 ,6, 7, 8].map((rank: number, i: number) => {
                return (
                    <div key={rank} className="flex flex-row">
                        {[1, 2, 3, 4 ,5 ,6, 7, 8].map((file: number, j: number) => {
                            const n = i + j;
                            return (
                                <div key={file} 
                                     className={clsx("h-[80px] w-[80px]",
                                        {"bg-white" : n % 2 === 0, "bg-black" : n % 2 === 1},
                                        {"text-black" : n % 2 === 0, "text-white" : n % 2 === 1}
                                     )}
                                >
                                    {rank}{file}
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    );
  }