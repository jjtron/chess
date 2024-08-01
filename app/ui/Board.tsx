'use client'
import React, {useState, useEffect} from 'react';
import {DndContext, useSensors, useSensor, MouseSensor, TouchSensor,} from '@dnd-kit/core';
import {Droppable} from './Droppable';
import {draggables, setup, capturedPieces, kingRookMovedRecord} from '../lib/pieces';
import chess from 'chess';
import {getBlackMove, getPieceMove, getPrisonerExchange,
        getBlackAiMove, getCastlingStatus} from '../lib/actions';
import {PieceMove} from '../lib/interfaces';
import Squares from './Squares';

export const gameClient = chess.create({ PGN : true });
export var checkMate: boolean = false;
gameClient.on('checkmate', () => { checkMate = true; });
export var check: boolean = false;
gameClient.on('check', () => { check = true; });
export var promote: boolean = false;
gameClient.on('promote', () => { promote = true; });
import { useWebSocketContext } from "../webSocketContext";

export default function Board({opponent} : { opponent: string }) {
    const [activeDraggable, setActiveDraggable] = useState('');
    const [squares, setSquares] = useState(setup);
    const [opponentSelf, setOpponentSelf] = useState(true);
    const [blackMoveHighlight, setBlackMoveHighlight] = useState('');
    const [castleFen, setCastleFen] = useState('');
    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor);
    const sensors = useSensors(mouseSensor, touchSensor);
    const castleText = 'To castle, move King first, rook will follow';
    const socket = useWebSocketContext();

    useEffect(() => {
        const nextMoves = gameClient.getStatus().notatedMoves;
        if (!opponentSelf && !checkMate && Object.keys(nextMoves).length > 0 && nextMoves[Object.keys(nextMoves)[0]].src.piece.side.name === 'black') {

            getBlackAiMove(gameClient, castleFen).then((blackAiMove) => {
                // get destination and source squares using the blackAiMove to pull
                // from the gameClient set of next-moves-possible
                const blackMove: PieceMove | undefined = getBlackMove(gameClient, blackAiMove);
                if (blackMove) {
                    console.log('blackMove', blackMove.notation);
                }
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

    useEffect(() => {
        socket.on('remote_move', (move) => {
            // update the GameClient
            const r = gameClient.move(move.pieceMove.notation);
            const color = r.move.postSquare.piece.side.name.charAt(0);

            // see if there was a capture
            let capturedDraggableId: string | null = null;
            if (r.move.capturedPiece) {
                // get the id of the captured draggable
                capturedDraggableId = squares[move.dest][0];
                // Update the list of captured pieces
                capturedPieces.push(capturedDraggableId);
            }

            // Create a new setup configuration
            console.log('socket move squares', squares);
            const newSquares = {...squares};

            if (promote) {
                // if this is a promotion . . .
                promote = false;
                const pieceType = move.pieceMove.notation.charAt(2).toLowerCase();
                const newDraggable: JSX.Element | undefined = getPrisonerExchange(move.color, pieceType);
                if (newDraggable === undefined) { throw Error('Failure to exchange for promotion'); }
                newSquares[move.pieceMove.dest] = [newDraggable.props.id, newDraggable];
            } else {
                // assign the active draggable identifier and its corresponding draggable object to the over.id
                const nextMoveDraggable: [ string, JSX.Element ] = squares[move.pieceMove.src];
                newSquares[move.pieceMove.dest] = [nextMoveDraggable[0], nextMoveDraggable[1]];
            }
            // delete the square from the newSquares configuration from which the draggable came from
            delete newSquares[move.pieceMove.src];

            if (move.pieceMove.notation === 'O-O') {
                newSquares['f8'] = ['rb2', draggables['rb2']];
                delete newSquares['h8'];
            }

            if (move.pieceMove.notation === 'O-O-O') {
                newSquares['d8'] = ['rb1', draggables['rb1']];
                delete newSquares['a8'];
            }

            // highlight the square where black is going to move to
            setBlackMoveHighlight(move.pieceMove.dest);
            
            // set new squares configuration
            console.log('socket move newSquares', newSquares);
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
            if (kingRookMovedRecord.hasOwnProperty(move.pieceMove.src)) {
                kingRookMovedRecord[move.pieceMove.src][0] = true;
            }

            const castleString = getCastlingStatus(gameClient, kingRookMovedRecord, 'w');
            setCastleFen(castleString);
            // reset check variable in case there has been a check
            // (getCastlingStatus examines the check variable to determine castling status)
            check = false;

        })
    }, [socket]);

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
        console.log('drag move squares', squares);
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
        console.log('drag move', newSquares);

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
        
        socket.emit('move', {
            opponent: opponent,
            pieceMove: pieceMove,
            color: color
        });

      } catch(e) {
        console.log(e);
      }
    }

    function handleDragStart(e: any){
        setActiveDraggable(e.active.id);
    }

    return (
        <DndContext id="42721f6b-df8b-45e5-aa5e-0d6a830e2032"
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                    sensors={sensors}
        >
            <Squares
                opponentSelf={opponentSelf}
                setOpponentSelf={setOpponentSelf}
                castleFen={castleFen}
                castleText={castleText}
                blackMoveHighlight={blackMoveHighlight}
                squares={squares}
            />
        </DndContext>
    );
}