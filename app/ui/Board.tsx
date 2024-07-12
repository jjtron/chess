'use client'
import React, {useState, useEffect} from 'react';
import {DndContext, useSensors, useSensor, MouseSensor, TouchSensor,} from '@dnd-kit/core';
import {Droppable} from './Droppable';
import {draggables, setup, capturedPieces} from '../lib/pieces';
import clsx from 'clsx';
import chess from 'chess';
import {getBlackMove, getWhiteMove, getPrisonerExchange, getBlackAiMove} from '../lib/actions';
import {PieceMove} from '../lib/interfaces';
import { FaLink } from "react-icons/fa";

export const gameClient = chess.create({ PGN : true });
export var checkMate: boolean = false;
gameClient.on('checkmate', () => { checkMate = true; });
export var promote: boolean = false;
gameClient.on('promote', () => { promote = true; });

export default function Board() {
    const [activeDraggable, setActiveDraggable] = useState('');
    const [squares, setSquares] = useState(setup);
    const [opponentSelf, setOpponentSelf] = useState(false);
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
        if (!opponentSelf && nextMoves[Object.keys(nextMoves)[0]].src.piece.side.name === 'black') {
              try {
                // get destination and source squares
                const blackMove: PieceMove | undefined = getBlackMove(squares, gameClient);
                if (blackMove === undefined) { throw Error(''); }

                // update the GameClient
                const r = gameClient.move(blackMove.notation);
                const color = r.move.postSquare.piece.side.name.charAt(0);

                // see if there was a capture
                let capturedDraggableId: string | null = null;
                if (r.move.capturedPiece) {
                    // get the id of the captured draggable
                    capturedDraggableId = squares[blackMove.dest][0];
                    // Update the list of captured pieces
                    capturedPieces.push(capturedDraggableId);
                }

                // Create a new setup configuration
                const newSquares = {...squares};

                if (promote) {
                    // if this is a promotion . . .
                    promote = false;
                    const pieceType = blackMove.notation.charAt(2).toLowerCase();
                    const newDraggable: JSX.Element | undefined = getPrisonerExchange(color, pieceType);
                    if (newDraggable === undefined) { throw Error('Failure to exchange for promotion'); }
                    newSquares[blackMove.dest] = [newDraggable.props.id, newDraggable];
                } else {
                    // assign the active draggable identifier and its corresponding draggable object to the over.id
                    const nextMoveDraggable: [ string, JSX.Element ] = squares[blackMove.src];
                    newSquares[blackMove.dest] = [nextMoveDraggable[0], nextMoveDraggable[1]];
                }
                // delete the square from the newSquares configuration from which the draggable came from
                delete newSquares[blackMove.src];

                // highlight the square where black is going to move to
                setBlackMoveHighlight(blackMove.dest);
                
                // set new squares configuration
                setSquares(newSquares);

                if (capturedDraggableId) {
                    // delete the captured draggable from the draggables 
                    delete draggables[capturedDraggableId];
                }
                getBlackAiMove(gameClient);

                // un-highlight the square where black is going to move to
                setTimeout(() => setBlackMoveHighlight(``), 1500);

              } catch(e) {
                    console.log(e);
              }
        }
    }), [squares, blackMoveHighlight];

    return (
        <DndContext id="42721f6b-df8b-45e5-aa5e-0d6a830e2032"
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                    sensors={sensors}
        >
            <div className='flex flex-col items-center'>
                <div className="text-2xl">Chess</div>
                <div className="flex flex-row border-[1px] border-white rounded-md px-2 mb-2">
                    <p className="pr-2">Play against myself</p>
                    <input type="checkbox" onClick={() => {setOpponentSelf(!opponentSelf)}}/>
                </div>
                {[8, 7, 6, 5, 4, 3, 2, 1].map((rank: number, i: number) => {
                    return (
                        <div key={rank} className='flex flex-row'>
                            {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((file: string, j: number) => {
                                const n = i + j;
                                return (
                                    <div key={file} 
                                        className={clsx('md:h-[80px] md:w-[80px] h-[40px] w-[40px] flex flex-row items-center justify-center',
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
                                                return draggable ? squares[`${file}${rank}`][1] : <div className="md:h-[78px] md:w-[78px] h-[38px] w-[38px]"></div>
                                            })()}
                                        </Droppable>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
                <a href="https://greenchess.net/index.php" className="flex flex-row mt-2">
                    <p className="pr-2">Chess piece images by Green Chess</p>
                    <FaLink className="mt-1"/>
                </a>
            </div>
        </DndContext>
    );

    async function handleDragEnd({over} : {over: any}) {
      try {

        const whiteMove: PieceMove | undefined = getWhiteMove(squares, activeDraggable, gameClient, over.id);
        if (whiteMove === undefined) { throw Error('Failure to register white move'); }

        // update the GameClient
        const r = gameClient.move(whiteMove.notation);
        const color = r.move.postSquare.piece.side.name.charAt(0);

        // see if there was a capture
        let capturedDraggableId: string | null = null;
        if (r.move.capturedPiece) {
            // get the id of the captured draggable
            capturedDraggableId = squares[over.id][0];
            // Update the list of captured pieces
            capturedPieces.push(capturedDraggableId);
        }

        // Create a new setup configuration
        const newSquares = {...squares};

        if (promote) {
            // if this is a promotion . . .
            promote = false;
            const pieceType = whiteMove.notation.charAt(2).toLowerCase();
            const newDraggable: JSX.Element | undefined = getPrisonerExchange(color, pieceType);
            if (newDraggable === undefined) { throw Error('Failure to exchange for promotion'); }
            newSquares[over.id] = [newDraggable.props.id, newDraggable];
        } else {
            // assign the active draggable identifier and its corresponding draggable object to the over.id
            newSquares[over.id] = [activeDraggable, draggables[activeDraggable]];
        }

        // delete the square from the newSquares configuration from which the draggable came from
        delete newSquares[whiteMove.src];

        // set the new config
        setSquares(newSquares);

        if (capturedDraggableId) {
            // delete the captured draggable from the draggables 
            delete draggables[capturedDraggableId];
        }

      } catch(e) {
        console.log(e);
      }
    }

    function handleDragStart(e: any){
        setActiveDraggable(e.active.id);
    }
}