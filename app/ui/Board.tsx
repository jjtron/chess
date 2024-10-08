'use client'
import React, {useState, useEffect, useReducer, useRef} from 'react';
import {DndContext, useSensors, useSensor, MouseSensor, TouchSensor,} from '@dnd-kit/core';
import {draggables, setup, capturedPieces, kingRookMovedRecord} from '../lib/pieces';
import chess from 'chess';
import {getBlackMove, getPieceMove, getPrisonerExchange,
        getBlackAiMove, getCastleStatus} from '../lib/actions';
import {PieceMove} from '../lib/interfaces';
import Squares from './Squares';
import Alert from '../Alert';
import { useAlertContext } from "../alertContext";

export const gameClient = chess.create({ PGN : true });
export var checkMate: boolean = false;
gameClient.on('checkmate', () => { checkMate = true; });
export var promote: boolean = false;
gameClient.on('promote', () => { promote = true; });
import { useWebSocketContext } from "../webSocketContext";

const initIsBoardOpenByBoth: boolean =  false;
const reducerOne = (state: any, action: any) => {
    if (action) {
        state = true;
        return state;
    } else {
        state = false;
        return state;
    }
};

export default function Board(
    { adversaryID, registrationID, isOpponentSelf } :
    {
        adversaryID: string,
        registrationID: string,
        isOpponentSelf: boolean
    }) 
{
    const [isBoardOpenByBoth, dispatchOne] = useReducer(reducerOne, initIsBoardOpenByBoth);
    const handleBoth = () => { dispatchOne(true); }

    const [activeDraggable, setActiveDraggable] = useState('');
    const [squares, setSquares] = useState(setup);
    const [blackMoveHighlight, setBlackMoveHighlight] = useState('');
    const [castleFen, setCastleFen] = useState('');
    const [remoteMove, setRemoteMove] = useState({ adversaryID: '', pieceMove: {dest: '', src: '', notation: '', }, color: ''});
    const [nextMoveColor, setNextMoveColor] = useState('White');
    const [whoMovesNext, setWhoMovesNext] = useState('undetermined');
    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor);
    const sensors = useSensors(mouseSensor, touchSensor);
    const castleText = 'To castle, move King first, rook will follow';
    const opponentSelf = isOpponentSelf;
    const socket = useWebSocketContext();
    const { onOpen } = useAlertContext();
    const castleAlertWhite = useRef(false);
    const castleAlertBlack = useRef(false);
    const sourceSquare = useRef('');

    useEffect(() => {
        if (isBoardOpenByBoth === true) {return;}
        new Promise((resolve, reject) => {
            socket.emit('open_board', adversaryID);
            socket.on('board_open_by_both', (response) => {
                response ? resolve(true) : reject();
            });
        }).then(() => {
            handleBoth();
        }).catch(() => {
            console.log('something went wrong');
        });
    }, [isBoardOpenByBoth, adversaryID, socket])
    
    useEffect(() => {
        // ignore first useEffect that executes handleRemoteMove()
        if (remoteMove.adversaryID === '') { return; }
        // update the GameClient
        const r = gameClient.move(remoteMove.pieceMove.notation);
        const color = r.move.postSquare.piece.side.name.charAt(0);

        // see if there was a capture
        let capturedDraggableId: string | null = null;
        if (r.move.capturedPiece) {
            // get the id of the captured draggable
            capturedDraggableId = squares[remoteMove.pieceMove.dest][0];
            // Update the list of captured pieces
            capturedPieces.push(capturedDraggableId);
        }

        // Create a new setup configuration
        const newSquares = {...squares};

        if (promote) {
            // if this is a promotion . . .
            promote = false;
            const pieceType = remoteMove.pieceMove.notation.charAt(2).toLowerCase();
            const newDraggable: JSX.Element | undefined = getPrisonerExchange(remoteMove.color, pieceType);
            if (newDraggable === undefined) { throw Error('Failure to exchange for promotion'); }
            newSquares[remoteMove.pieceMove.dest] = [newDraggable.props.id, newDraggable];
        } else {
            // assign the active draggable identifier and its corresponding draggable object to the over.id
            const nextMoveDraggable: [ string, JSX.Element ] = squares[remoteMove.pieceMove.src];
            newSquares[remoteMove.pieceMove.dest] = [nextMoveDraggable[0], nextMoveDraggable[1]];
        }
        // delete the square from the newSquares configuration from which the draggable came from
        delete newSquares[remoteMove.pieceMove.src];

        // castling moves rook along after the king is moved
        if (remoteMove.pieceMove.notation === 'O-O') {
            if (color === 'b') {
                newSquares['f8'] = ['rb2', draggables['rb2']];
                delete newSquares['h8'];
            } else {
                newSquares['f1'] = ['rw2', draggables['rw2']];
                delete newSquares['h1'];
            }
        }

        if (remoteMove.pieceMove.notation === 'O-O-O') {
            if (color === 'b') {
                newSquares['d8'] = ['rb1', draggables['rb1']];
                delete newSquares['a8'];
            } else {
                newSquares['d1'] = ['rw1', draggables['rw1']];
                delete newSquares['a1'];
            }
        }

        // highlight the square where black is going to move to
        setBlackMoveHighlight(remoteMove.pieceMove.dest);

        // set new squares configuration
        setSquares(newSquares);

        if (capturedDraggableId) {
            // delete the captured draggable from the draggables 
            delete draggables[capturedDraggableId];
        }

        // un-highlight the square where opponent is going to move to
        // NOTE: 'setBlackMoveHighlight' is used to serve the dual mode
        //       for both black and white remote moving; 
        //       both white and black utilize the algorithm
        setTimeout(() => {
            setBlackMoveHighlight(``);
            if (checkMate) {
                onOpen('checkmate', 'Better luck next time');
                checkMate = false;
            }
            if (gameClient.getStatus().isCheck) {
                onOpen('check', 'You are under attack!');
                gameClient.getStatus().isCheck = false;
            }
        }, 500);

        // set that a king or rook has moved if one has moved
        if (kingRookMovedRecord.hasOwnProperty(remoteMove.pieceMove.src)) {
            kingRookMovedRecord[remoteMove.pieceMove.src][0] = true;
        }

        // Reset the remoteMove constant because a re-render will be caused by setSquares (above).
        // The const squares is required in the useEffect dependency array or a Lint Warning occurs.
        setRemoteMove({ adversaryID: '', pieceMove: {dest: '', src: '', notation: '', }, color: ''});

        setNextMoveColor(color === 'w' ? 'Black' : 'White');

        setWhoMovesNext(registrationID);

    }, [remoteMove]);

    useEffect(() => {
        const nextMoves = gameClient.getStatus().notatedMoves;
        if (!opponentSelf && adversaryID === 'machine' && !checkMate && 
            Object.keys(nextMoves).length > 0 && 
            nextMoves[Object.keys(nextMoves)[0]].src.piece.side.name === 'black')
        {
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
                        onOpen('checkmate', 'Better luck next time');
                        checkMate = false;
                    }
                    if (gameClient.getStatus().isCheck) {
                        onOpen('check', 'You are under attack!');
                        gameClient.getStatus().isCheck = false;
                    }
                }, 500);

                // set that a king or rook has moved if one has moved
                if (kingRookMovedRecord.hasOwnProperty(blackMove.src)) {
                    kingRookMovedRecord[blackMove.src][0] = true;
                }

                setNextMoveColor('White');

                setWhoMovesNext(registrationID);

            }).catch((e) => {
                console.log(e);
            });
        }
    }), [squares];

    socket.on('remote_move', (move) => {
        setRemoteMove(move);
    });

    async function handleDragEnd({over} : {over: any}) {

      try {
        // if the user decided to abort his move, i.e. put the piece back where it started
        if (over.id === sourceSquare.current) { return; }

        if (!(whoMovesNext === registrationID ||
              whoMovesNext === 'undetermined' ||
              whoMovesNext === 'self')) {
            onOpen('error', 'It\'s not your turn');
            return;
        }
        if (!(adversaryID === 'self' || adversaryID === 'machine') && !isBoardOpenByBoth) {
            onOpen('error', 'Your opponent hasn\'t opened the board yet');
            return;
        }

        const pieceMove: PieceMove | undefined = getPieceMove(squares, activeDraggable, gameClient, over.id);

        if (pieceMove === undefined) {
            onOpen('error', `'Invalid move'.\n Although the error is undetermined,
                             it is most likely that you are moving out of 
                             turn or trying to move a peice of the wrong color`);
            return;
        }

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
        const castleFEN = getCastleStatus(gameClient, newSquares, kingRookMovedRecord, color);
        const castlinAlert: string[] = [
            'To castle, move your King and the Rook will follow.',
            '----------------------------------------------------',
            'Castling permitted if ...',
            '* There are no pieces between the king and the rook.',
            '* Neither the king nor the rook has previously moved.',
            '* The king does not pass through or finish on a square that is attacked by an enemy piece.',
            '* The king is not currently in check.'
        ]
        if ( color === 'w' && (castleFEN.indexOf('Q') > -1 ||  castleFEN.indexOf('K') > -1) && castleAlertWhite.current === false ) {
            onOpen('castle', castlinAlert);                    
            castleAlertWhite.current = true;
        }
        if ( color === 'b' && (castleFEN.indexOf('q') > -1 ||  castleFEN.indexOf('k') > -1) && castleAlertBlack.current === false ) {
            onOpen('castle', castlinAlert);
            castleAlertBlack.current = true;
        }

        if (isOpponentSelf) {
            if (checkMate) {
                onOpen('checkmate', 'You have vanquished your most formidable foe!');
                checkMate = false;
            }
        }

        if (adversaryID === 'machine') {
            if (gameClient.getStatus().isCheck) {
                onOpen('check', 'Your opponent seems unfraid!');
                gameClient.getStatus().isCheck = false;
            }
        }

        if (isOpponentSelf) {
            if (gameClient.getStatus().isCheck) {
                onOpen('check', 'Good move; your alter-ego should be afraid!');
                gameClient.getStatus().isCheck = false;
            }
        }

        setNextMoveColor(color === 'w' ? 'Black' : 'White');

        setWhoMovesNext(adversaryID);

        socket.emit('move', {
            adversaryID: adversaryID,
            pieceMove: pieceMove
        });

      } catch(e) {
        console.log(e);
      }
    }

    function handleDragStart(e: any) {
        const srcSq = Object.keys(squares).find((square) => {
            return squares[square][0] === e.active.id;
        });
        if (srcSq) { sourceSquare.current = srcSq; }
        setActiveDraggable(e.active.id);
    }

    return (
        <>
        <Alert />
        <DndContext id="42721f6b-df8b-45e5-aa5e-0d6a830e2032"
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                    sensors={sensors}
        >
            <Squares
                castleFen={castleFen}
                castleText={castleText}
                blackMoveHighlight={blackMoveHighlight}
                squares={squares}
                nextMoveColor={nextMoveColor}
                isBoardOpenByBoth={isBoardOpenByBoth}
                overRideDuality={adversaryID === 'self' || adversaryID === 'machine'}
            />
        </DndContext>
        </>
    );
}