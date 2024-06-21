'use client'
import React, {useState, useEffect} from 'react';
import {DndContext, useSensors, useSensor, MouseSensor, TouchSensor,} from '@dnd-kit/core';
import {Droppable} from './Droppable';
import {draggables, setup, capturedPieces} from '../lib/pieces';
import clsx from 'clsx';
import chess, { Square } from 'chess';
import {getBlackMove} from '../lib/actions';

export const gameClient = chess.create({ PGN : true });
export var checkMate: boolean = false;
gameClient.on('checkmate', () => { checkMate = true; });

export default function Board() {
    const [activeDraggable, setActiveDraggable] = useState('');
    const [squares, setSquares] = useState(setup);
    const [blackMoveHighlight, setBlackMoveHighlight] = useState('');
    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor);
    const sensors = useSensors(mouseSensor, touchSensor);

    useEffect(() => {
        const nextMoves = gameClient.getStatus().notatedMoves;
        if (checkMate) {
            alert('Checkmate');
            return;
        }
        if (nextMoves[Object.keys(nextMoves)[0]].src.piece.side.name === 'black') {
            ( async () => {
              try {
                // get destination and source squares
                const blackMove: { dest: string; src: string } | undefined = await getBlackMove(squares, gameClient);
                if (blackMove === undefined) { throw Error(''); }

                // create new setup configuration
                const nextMoveDraggable: [ string, JSX.Element ] = squares[blackMove.src];
                const newSquares = {...squares};
                newSquares[blackMove.dest] = [nextMoveDraggable[0], nextMoveDraggable[1]];
                delete newSquares[blackMove.src];

                // highlight the square where black is going to move to
                setBlackMoveHighlight(blackMove.dest);
                
                // set new squares configuration
                setSquares(newSquares);

                // un-highlight the square where black is going to move to
                setTimeout(() => setBlackMoveHighlight(``), 1500);

              } catch(e) {
                    console.log(e);
              }
            })();
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
                                            { 'bg-white text-black transition-color duration-1000' : n % 2 === 0 && blackMoveHighlight !== `${file}${rank}`,
                                              'bg-gray-500 text-white transition-color duration-1000' : n % 2 === 1 && blackMoveHighlight !== `${file}${rank}`,
                                              'bg-red-500 transition-color duration-1000 ease-out' : `${file}${rank}` === blackMoveHighlight}
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
                <a href="https://greenchess.net/index.php">Chess piece images by Green Chess</a>
            </div>
        </DndContext>
    );

    function handleDragEnd({over} : {over: any}) {
      try {
        const newSquares = {...squares};

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
                const r = gameClient.move(notation);
                if (r.move.capturedPiece) {
                    const draggableId = newSquares[over.id][0];
                    const draggable = draggables[draggableId]; 
                    capturedPieces[draggableId] = draggable;
                }
                
            } else {
                // whatever the move requested, it is not legal
                throw Error('Invalid notation')
            }
            // Create a new setup configuration
            // 1) assign the active draggable identifier and its corresponding draggable object to the over.id
            newSquares[over.id] = [activeDraggable, draggables[activeDraggable]];
            // 2) delete the square from the newSquares configuration from which the draggable came from
            delete newSquares[wasFileRank];
            // 3) set the new config
            setSquares(newSquares);
        }
      } catch(e) {
        console.log(e);
      }
    }

    function handleDragStart(e: any){
        setActiveDraggable(e.active.id);
    }
}