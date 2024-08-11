import {PieceMove, BoardState, NotatedMoves} from './interfaces';
import {draggables} from './pieces';
import {AlgebraicGameClient} from 'chess';
import {Draggable} from '../ui/Draggable';
import Image from 'next/image';
import { stockfish } from '../lib/stockfish';

export const NEXT_PUBLIC_WSENDPOINT = process.env.NEXT_PUBLIC_WSENDPOINT;

export function getCastleStatus(gameClient: any, squares: BoardState, kingRookMovedRecord: any, color: string) {
    /*
        1 There are no pieces between the king and the rook.
        2 Neither the king nor the rook has previously moved.
        3 The king does not pass through or finish on a square that is attacked by an enemy piece.
          (not tested for in this algorithm)
        4 The king is not currently in check. (not tested for in this algorithm)
    */
   // test condition 1
    let FENarray: string[] = [];
    const squareGroups: any = {
        Q: ['b1','c1','d1'],
        K: ['f1','g1'],
        q: ['b8','c8','d8'],
        k: ['f8','g8']
    }
    Object.keys(squareGroups).forEach((group: string) => {
        if (Object.keys(squares).filter((square: string) => {
            if (squareGroups[group].length === 3) {
                return square === squareGroups[group][0] || square === squareGroups[group][1] || square === squareGroups[group][2];
            } else {
                return square === squareGroups[group][0] || square === squareGroups[group][1];
            }
        }).length === 0) {
            FENarray.push(group);
        }
    });
    /* REMOVED (but saved for posterity)
        because the gameClient itself will prevent castling under this condition
            // test condition 2
            // create list of negated castling-options by examining the kingRookMovedRecord variable
            const negatedCastlingOptions: string[] = Object.keys(kingRookMovedRecord).filter((moveSquare) => {
                return kingRookMovedRecord[moveSquare][0] === true;
            }).map((moveSquare) => {
                return kingRookMovedRecord[moveSquare][1];
            }).join('').split('');
            // remove the negated castling-options from the FENarray
            negatedCastlingOptions.forEach((negated) => {
                const index = FENarray.indexOf(negated);
                if (index > -1) {
                    FENarray.splice(index, 1);
                }
            });
            console.log(FENarray)
    */
    return FENarray;
}

export function getBlackMove(
    gameClient: AlgebraicGameClient,
    blackAiMove: string
): PieceMove | undefined {
  try {
    // pick the next move by matching dest and source of the AI move
    // with the one found in the notatedMoves array
    const notatedMoves : NotatedMoves = gameClient.getStatus().notatedMoves;
    const theNextAiMove = Object.keys(notatedMoves).find((move) => {
        return (
            notatedMoves[move].src.file === blackAiMove.charAt(0) &&
            notatedMoves[move].src.rank === Number(blackAiMove.charAt(1)) &&
            notatedMoves[move].dest.file === blackAiMove.charAt(2) &&
            notatedMoves[move].dest.rank === Number(blackAiMove.charAt(3))
        )
    });

    // `${sourceFile}${sourceRank}` is the location of the source
    // `${destFile}${destRank}` is the location of the destination
    if (theNextAiMove) {
        return {
            dest: `${blackAiMove.charAt(2)}${blackAiMove.charAt(3)}`,
            src: `${blackAiMove.charAt(0)}${blackAiMove.charAt(1)}`,
            notation: theNextAiMove
        };
    } else {
        throw Error('Error getting next move for black');
    }

  } catch(e) {
        console.log(e);
  }
}

// This function works for both black and white when the checkbox
// for playing against one's self is set
export function getPieceMove(
    squares: BoardState,
    activeDraggable: string,
    gameClient: AlgebraicGameClient,
    overId: string
): PieceMove | undefined {
  try {
    // find the rank-file from which the draggable was moved
    const wasFileRank = Object.keys(squares).find((square) => {
        return squares[square][0] === activeDraggable;
    });

    if (overId && wasFileRank && (overId !== wasFileRank)) {
        /*  Determine the gameClient move notation from its list of available, legal moves
            by searching out the 'src' Square that matches the location of the draggable source
        */
        // 1) Consider it's source coordinates: wasFileRank (file and rank)
        //    and it's pieceType (1st char of over.id)
        const [sourceFile, sourceRank] = wasFileRank.split('');
        const [destFile, destRank] = overId.split('');
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
        // Make a copy of the notated moves status
        const nextMoves = gameClient.getStatus().notatedMoves;

        // search through it for a match of the src in terms of rank, file, and pieceType
        const notation = Object.keys(nextMoves).find((move: any) => {
            return (nextMoves[move].src.rank === Number(sourceRank) &&
                    nextMoves[move].src.file === sourceFile &&
                    nextMoves[move].src.piece.type.toLowerCase() === pieceType &&
                    nextMoves[move].dest.rank === Number(destRank) &&
                    nextMoves[move].dest.file === destFile)
        });

        if (!notation) { return undefined; }

        return {
            dest: `${destFile}${destRank}`,
            src: `${sourceFile}${sourceRank}`,
            notation: notation
        };
    } 
  } catch(e) {
        console.log(e);
  }
}

export function getPrisonerExchange(color: string, pieceType: string): JSX.Element | undefined {
    try {
        // set the string value for the Image src
        const imgStrings: any = {
            q: 'queen',
            g: 'queen', // not sure, but I think the author of node-chess means to use q, not g
                        // so, I put this in here to cover his presumed mistake
            n: 'knight',
            b: 'bishop',
            r: 'rook'
        }
        const imgString: string = `/${imgStrings[pieceType]}-${color}.svg`;

        // filter out the pieces that match the specified kind of piece fr the exchange
        const pieces: string[] = Object.keys(draggables).filter((id) => id.charAt(0) === pieceType && id.charAt(1) === color);
        // determine the next highest number of the third character ...
        let idNumber: number = 0;
        pieces.forEach((piece: string) => {
            if (Number(piece.charAt(2)) > idNumber) {
                idNumber = Number(piece.charAt(2));
            }
        });
        idNumber++; // ... to avoid having dulicate ids
        const idString = `${pieceType}${color}${idNumber.toString()}`;
        
        // add the new draggable to the draggable list
        draggables[idString] = <Draggable id={idString}><Image priority src={imgString} width="60" height="60" alt="piece"/></Draggable>;
        return draggables[idString];

    } catch(e) {
        console.log(e);
    }
}

export function getBlackAiMove(gameClient: any, castleFen: string) {
    return new Promise<string>((resolve, reject) => {
        try {
            const boardState = gameClient.getStatus().board.squares;
            const fenSortedBoardState = getFenSortedBoardState(boardState);
            // build the FEN string
            let fen: string = '';
            fenSortedBoardState.forEach((square: any, i: number) => {
                if (square.piece === null) {
                    fen += 0;
                } else {
                    const side = square.piece.side.name;
                    const type = (side === 'white') ? square.piece.type.toUpperCase() : square.piece.type ;
                    if (type.toLowerCase() === 'knight') {
                        fen += type.charAt(1);
                    } else {
                        fen += type.charAt(0);
                    }
                }
                if ((i + 1) % 8 === 0) {
                    fen += '/';
                }
            });

            let fenSplit: string[] = [];
            let emptySquareNumber = 0;
            fen.split('').forEach((char: string) => {
                if (char === '0') {
                    emptySquareNumber++;
                } else {
                    if (emptySquareNumber > 0) {
                        fenSplit.push(emptySquareNumber + '');
                    }
                    emptySquareNumber = 0;
                    fenSplit.push(char);
                }
            });
            fen = fenSplit.join('') + ' b' + ' ' + castleFen;
            const DEPTH = 4;
            // get the artificailly intelligent best next move
            if (typeof stockfish !== 'undefined') {
                stockfish.postMessage(`position fen ${fen}`);
                stockfish.postMessage(`go depth ${DEPTH}`);
                stockfish.onmessage = (e: any) => {
                    if (e.data.search('bestmove') === 0) {
                        resolve(e.data.substring(9, 13));
                    }
                };
            }
        } catch (e) {
            reject('Error getting AI next move');
        }
    });
}

function compare( a: any, b: any ) {
    if ( a.rank > b.rank ){ return -1; }
    if ( a.rank < b.rank ){ return 1; }
    return 0;
}

function getFenSortedBoardState(boardState: any): any {
    // resort the board state to match the FEN specification 
    let fenSortedBoardState: any[] = [];
    for (let i = 8; i > 0; i--) {
        fenSortedBoardState = fenSortedBoardState.concat(
            boardState.filter((square: any) => {
                return square.rank === i;
            }).sort(compare)
        );
    }
    return fenSortedBoardState;
}