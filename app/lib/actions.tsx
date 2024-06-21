import {draggables, capturedPieces} from './pieces';
import {Square} from 'chess';

export async function getBlackMove(squares: any, gameClient: any) {
  try {
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

    // `${sourceFile}${sourceRank}` is the location of the source
    // `${destFile}${destRank}` is the location of the destination
    // nextMoveDraggable[0] is the identity of the draggable component JSX.Element
    // nextMoveDraggable[1] is the actual draggable component JSX.Element
    // nextMove is the notation to be passed into the gameClient.move(<whatever>);
    const r = gameClient.move(nextMove);
    if (r.move.capturedPiece) {
        const draggableId = squares[`${destFile}${destRank}`][0];
        const draggable = draggables[draggableId]; 
        capturedPieces[draggableId] = draggable;
    }
    return { dest: `${destFile}${destRank}`, src: `${sourceFile}${sourceRank}`};

  } catch(e) {
        console.log(e);
  }
}
