import {Square} from 'chess';

export type PieceMove = {
    dest: string;
    src: string;
    notation: string;
}

export type BoardState = {[key: string]: [string, JSX.Element]}

export type NotatedMoves = {[key: string]: { dest: Square; src: Square }};