import {PieceMove, BoardState, NotatedMoves} from './interfaces';
import {draggables} from './pieces';
import {AlgebraicGameClient} from 'chess';
import {Draggable} from '../ui/Draggable';
import Image from 'next/image';

export function getBlackMove(squares: BoardState, gameClient: AlgebraicGameClient): PieceMove | undefined {
  try {
    // pick a next move at random
    const notatedMoves : NotatedMoves = gameClient.getStatus().notatedMoves;
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

    // `${sourceFile}${sourceRank}` is the location of the source
    // `${destFile}${destRank}` is the location of the destination
    return {
        dest: `${destFile}${destRank}`,
        src: `${sourceFile}${sourceRank}`,
        notation: nextMove
    };

  } catch(e) {
        console.log(e);
  }
}

export function getWhiteMove(
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
