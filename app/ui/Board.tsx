'use client'
import React, {useState, useEffect} from 'react';
import {DndContext, useSensors, useSensor, MouseSensor, TouchSensor,} from '@dnd-kit/core';
import {Droppable} from './Droppable';
import {draggables, setup, capturedPieces, kingRookMovedRecord} from '../lib/pieces';
import clsx from 'clsx';
import chess from 'chess';
import {getBlackMove, getPieceMove, getPrisonerExchange,
        getBlackAiMove, getCastlingStatus} from '../lib/actions';
import {PieceMove} from '../lib/interfaces';
import { FaLink } from "react-icons/fa";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3001";

export const gameClient = chess.create({ PGN : true });
export var checkMate: boolean = false;
gameClient.on('checkmate', () => { checkMate = true; });
export var check: boolean = false;
gameClient.on('check', () => { check = true; });
export var promote: boolean = false;
gameClient.on('promote', () => { promote = true; });

export default function Board() {
    const [activeDraggable, setActiveDraggable] = useState('');
    const [squares, setSquares] = useState(setup);
    const [opponentSelf, setOpponentSelf] = useState(false);
    const [blackMoveHighlight, setBlackMoveHighlight] = useState('');
    const [castleFen, setCastleFen] = useState('');
    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor);
    const sensors = useSensors(mouseSensor, touchSensor);
    const castleText = 'To castle, move King first, rook will follow';
    const [response, setResponse] = useState("");

    useEffect(() => {
      const socket = socketIOClient(ENDPOINT);
      socket.on("time", data => {
        console.log(data);
        setResponse(data);
      });
    }, []);

    useEffect(() => {
        const nextMoves = gameClient.getStatus().notatedMoves;
        if (!opponentSelf && !checkMate && Object.keys(nextMoves).length > 0 && nextMoves[Object.keys(nextMoves)[0]].src.piece.side.name === 'black') {

            getBlackAiMove(gameClient, castleFen).then((blackAiMove) => {
                // get destination and source squares using the blackAiMove to pull
                // from the gameClient set of next-moves-possible
                const blackMove: PieceMove | undefined = getBlackMove(gameClient, blackAiMove);
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

                if (blackMove.notation === 'O-O') {
                    newSquares['f8'] = ['rb2', draggables['rb2']];
                    delete newSquares['h8'];
                }

                if (blackMove.notation === 'O-O-O') {
                    newSquares['d8'] = ['rb1', draggables['rb1']];
                    delete newSquares['a8'];
                }

                // highlight the square where black is going to move to
                setBlackMoveHighlight(blackMove.dest);
                
                // set new squares configuration
                setSquares(newSquares);

                if (capturedDraggableId) {
                    // delete the captured draggable from the draggables 
                    delete draggables[capturedDraggableId];
                }

                // un-highlight the square where black is going to move to
                setTimeout(() => {
                    setBlackMoveHighlight(``);
                    if (checkMate) {
                        alert('Checkmate');
                        checkMate = false;
                    }
                }, checkMate? 500 : 1500);

                // set that a king or rook has moved if one has moved
                if (kingRookMovedRecord.hasOwnProperty(blackMove.src)) {
                    kingRookMovedRecord[blackMove.src][0] = true;
                }

                const castleString = getCastlingStatus(gameClient, kingRookMovedRecord, 'w');
                setCastleFen(castleString);
                // reset check variable in case there has been a check
                // (getCastlingStatus examines the check variable to determine castling status)
                check = false;

            }).catch((e) => {
                console.log(e);
            });
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
                    <input type="checkbox" defaultChecked={opponentSelf} onClick={() => {setOpponentSelf(!opponentSelf)}}/>
                </div>
                <div className='flex flex-row justify-between w-[640px]'>
                    <div className={clsx('border rounded border-white text-xs px-1 mb-1', {'invisible' : !castleFen.includes('q')})}>{castleText}</div>
                    <div className={clsx('border rounded border-white text-xs px-1 mb-1', {'invisible' : !castleFen.includes('k')})}>{castleText}</div>
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
                <div className='flex flex-row justify-between w-[640px]'>
                    <div className={clsx('border rounded border-white text-xs px-1 mt-1', {'invisible' : !castleFen.includes('Q')})}>{castleText}</div>
                    <div className={clsx('border rounded border-white text-xs px-1 mt-1', {'invisible' : !castleFen.includes('K')})}>{castleText}</div>
                </div>
                <a href="https://greenchess.net/index.php" className="flex flex-row mt-2">
                    <p className="pr-2">Chess piece images by Green Chess</p>
                    <FaLink className="mt-1"/>
                </a>
            </div>
        </DndContext>
    );

    async function handleDragEnd({over} : {over: any}) {
      try {

        const pieceMove: PieceMove | undefined = getPieceMove(squares, activeDraggable, gameClient, over.id);
        if (pieceMove === undefined) { throw Error('Failure to register piece move'); }

        // update the GameClient
        const r = gameClient.move(pieceMove.notation);
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
            const pieceType = pieceMove.notation.charAt(2).toLowerCase();
            const newDraggable: JSX.Element | undefined = getPrisonerExchange(color, pieceType);
            if (newDraggable === undefined) { throw Error('Failure to exchange for promotion'); }
            newSquares[over.id] = [newDraggable.props.id, newDraggable];
        } else {
            // assign the active draggable identifier and its corresponding draggable object to the over.id
            newSquares[over.id] = [activeDraggable, draggables[activeDraggable]];
        }

        // delete the square from the newSquares configuration from which the draggable came from
        delete newSquares[pieceMove.src];

        if (pieceMove.notation === 'O-O') {
            if (color === 'w') {
                newSquares['f1'] = ['rw2', draggables['rw2']];
                delete newSquares['h1'];
            } else {
                newSquares['f8'] = ['rb2', draggables['rb2']];
                delete newSquares['h8'];
            }
        }

        if (pieceMove.notation === 'O-O-O') {
            if (color === 'w') {
                newSquares['d1'] = ['rw1', draggables['rw1']];
                delete newSquares['a1'];
            } else {
                newSquares['d8'] = ['rb1', draggables['rb1']];
                delete newSquares['a8'];
            }
        }

        // set the new config
        setSquares(newSquares);

        if (capturedDraggableId) {
            // delete the captured draggable from the draggables 
            delete draggables[capturedDraggableId];
        }

        // set that a king or rook has moved if one has moved
        if (kingRookMovedRecord.hasOwnProperty(pieceMove.src)) {
            kingRookMovedRecord[pieceMove.src][0] = true;
        }

        const castleString = getCastlingStatus(gameClient, kingRookMovedRecord, color === 'w' ? 'b' : 'w');
        setCastleFen(castleString);
        // reset check variable in case there has been a check
        // (getCastlingStatus examines the check variable to determine castling status)
        check = false;

        if (checkMate) {
            setTimeout(() => { alert('Checkmate'); }, 500);
        }

      } catch(e) {
        console.log(e);
      }
    }

    function handleDragStart(e: any){
        setActiveDraggable(e.active.id);
    }
}