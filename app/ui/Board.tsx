'use client'
import React, {useState, useEffect} from 'react';
import {DndContext, useSensors, useSensor, MouseSensor, TouchSensor,} from '@dnd-kit/core';
import {Droppable} from './Droppable';
import {draggables, setup} from '../lib/pieces';
import clsx from 'clsx';
import chess, { Square } from 'chess';

export const gameClient = chess.create({ PGN : true });

export default function Board() {
    const [activeDraggable, setActiveDraggable] = useState('');
    const [squares, setSquares] = useState(setup);
    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor);
    const sensors = useSensors(mouseSensor, touchSensor);

    useEffect(() => {
        const nextMoves = gameClient.getStatus().notatedMoves;
        if (nextMoves[Object.keys(nextMoves)[0]].src.piece.side.name === 'black') {
            getBlackMove();
        }
    });

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
            /*  Determine the gameClient move notation from its list of available, legal moves
                by searching out the 'src' Square that matches the location of the draggable source
            */
            // 1) Consider it's source coordinates: wasFileRank (file and rank)
            //    and it's pieceType (1st char of over.id)
            const [sourceFile, sourceRank] = wasFileRank.split('');
            const [destFile, destRank] = over.id.split('');
            let pieceType: string = activeDraggable.charAt(0) !== 'p' ? `${activeDraggable.charAt(0)}` : 'pawn';
            switch (pieceType) {
                case 'pawn': break;
                case 'n': pieceType = 'knight'; break;
                case 'b': pieceType = 'bishop'; break;
                case 'r': pieceType = 'rook'; break;
                case 'q': pieceType = 'queen'; break;
                case 'k': pieceType = 'king'; break;
            }
            ;
            // 2) Make a copy of the notated moves status
            const nextMoves = gameClient.getStatus().notatedMoves;

            // search through it for a match of the src in terms of rank, file, and pieceType
            const notation = Object.keys(nextMoves).find((move: any) => {
                return (nextMoves[move].src.rank === Number(sourceRank) &&
                        nextMoves[move].src.file === sourceFile &&
                        nextMoves[move].src.piece.type.toLowerCase() === pieceType &&
                        nextMoves[move].dest.rank === Number(destRank) &&
                        nextMoves[move].dest.file === destFile)
            });
            if (notation) {
                gameClient.move(notation);
            } else {
                // whatever the move requested, it is not legal
                return;
            }
            // Create a new setup configuration
            // 1) assign the active draggable identifier and its corresponding draggable object to the over.id
            newSquares[over.id] = [activeDraggable, draggables[activeDraggable]];
            // 2) delete the square from the newSquares configuration from which the draggable came from
            delete newSquares[wasFileRank];
            // 3) set the new config
            setSquares(newSquares);
        }
    }

    function handleDragStart(e: any){
        setActiveDraggable(e.active.id);
    }

    async function getBlackMove() {
        const newSquares = {...squares};

        // pick a next move at random
        const notatedMoves : {[key: string]: { dest: Square; src: Square }} = gameClient.getStatus().notatedMoves;
        const movesArray = Object.keys(notatedMoves);
        const max: number = movesArray.length;
        const min: number = 0;
        const nextMoveIndex = Math.floor(Math.random() * (max - min) + min);
        const nextMove = movesArray[nextMoveIndex];

        // find the source (file, rank, and pieceType of the next move)
        const sourceFile = notatedMoves[nextMove].src.file;
        const sourceRank = notatedMoves[nextMove].src.rank;
        const destFile = notatedMoves[nextMove].dest.file;
        const destRank = notatedMoves[nextMove].dest.rank;

        // get the nextmove draggable component
        const nextMoveDraggable = newSquares[`${sourceFile}${sourceRank}`];

        // `${file}${rank}` is the location of the source
        // pieceType is pawn, knight, bishop, etc
        // nextMoveDraggable[0] is the identity of the draggable component JSX.Element
        // nextMoveDraggable[1] is the actual draggable component JSX.Element
        // nextMove is the notation to be passed into the gameClient.move(<whatever>);
        gameClient.move(nextMove);

        newSquares[`${destFile}${destRank}`] = [nextMoveDraggable[0], nextMoveDraggable[1]];
        delete newSquares[`${sourceFile}${sourceRank}`];
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSquares(newSquares);
    }
  }