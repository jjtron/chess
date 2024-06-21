import {draggables, capturedPieces} from './pieces';
import {Square, AlgebraicGameClient} from 'chess';

export function getBlackMove(squares: {[key: string]: [string, JSX.Element]}, gameClient: AlgebraicGameClient): { dest: string; src: string } | undefined {
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
        capturedPieces.push(draggableId);
    }
    return { dest: `${destFile}${destRank}`, src: `${sourceFile}${sourceRank}`};

  } catch(e) {
        console.log(e);
  }
}

export function getWhiteMove(
    squares: {[key: string]: [string, JSX.Element]},
    activeDraggable: string,
    gameClient: AlgebraicGameClient,
    overId: string
): { dest: string; src: string } | undefined {
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
        if (notation) {
            const r = gameClient.move(notation);
            if (r.move.capturedPiece) {
                const draggableId = squares[overId][0];
                capturedPieces.push(draggableId);
            }
            
        } else {
            // whatever the move requested, it is not legal
            throw Error('Invalid notation')
        }

        return { dest: `${destFile}${destRank}`, src: `${sourceFile}${sourceRank}`};
    } 
  } catch(e) {
        console.log(e);
  }
}

export function getPrisonerExchange(color: string): JSX.Element | undefined {
    try {

        // filter out a list of the pieces by color
        const prisonerList = capturedPieces.filter((piece: string) => piece.charAt(1) === color);

        // find the type of prisoner available for exchnage in one exists
        const prisonerTypeExchange: string | undefined = ['q', 'r', 'n', 'b'].find((prisonerSought: string) => {
            return prisonerList.find((prisonerChoice: string) => {
                return prisonerChoice.charAt(0) === prisonerSought;
            })
        });
        if (prisonerTypeExchange === undefined) {
            return undefined;
        }

        // get id of the prisoner to be exchanged
        const prisonerId: string | undefined = prisonerList.find((prisoner: string) => prisoner.charAt(0) === prisonerTypeExchange);
        if (prisonerId === undefined) {
            return undefined;
        }

        return draggables[prisonerId];

    } catch(e) {
        console.log(e);
    }
}
