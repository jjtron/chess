import {Draggable} from '../ui/Draggable';
import Image from 'next/image';
import {BoardState} from './interfaces';

export var draggables: {[key: string]: JSX.Element } = {
    'pw1': <Draggable id='pw1'><Image priority src='/pawn-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'pw2': <Draggable id='pw2'><Image priority src='/pawn-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'pw3': <Draggable id='pw3'><Image priority src='/pawn-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'pw4': <Draggable id='pw4'><Image priority src='/pawn-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'pw5': <Draggable id='pw5'><Image priority src='/pawn-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'pw6': <Draggable id='pw6'><Image priority src='/pawn-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'pw7': <Draggable id='pw7'><Image priority src='/pawn-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'pw8': <Draggable id='pw8'><Image priority src='/pawn-w.svg' width="60" height="60" alt="piece"/></Draggable>,

    'rw1': <Draggable id='rw1'><Image priority src='/rook-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'rw2': <Draggable id='rw2'><Image priority src='/rook-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'nw1': <Draggable id='nw1'><Image priority src='/knight-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'nw2': <Draggable id='nw2'><Image priority src='/knight-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'bw1': <Draggable id='bw1'><Image priority src='/bishop-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'bw2': <Draggable id='bw2'><Image priority src='/bishop-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'kw': <Draggable id='kw'><Image priority src='/king-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'qw1': <Draggable id='qw1'><Image priority src='/queen-w.svg' width="60" height="60" alt="piece"/></Draggable>,

    'pb1': <Draggable id='pb1'><Image priority src='/pawn-b.svg' width="60" height="60" alt="piece"/></Draggable>,
    'pb2': <Draggable id='pb2'><Image priority src='/pawn-b.svg' width="60" height="60" alt="piece"/></Draggable>,
    'pb3': <Draggable id='pb3'><Image priority src='/pawn-b.svg' width="60" height="60" alt="piece"/></Draggable>,
    'pb4': <Draggable id='pb4'><Image priority src='/pawn-b.svg' width="60" height="60" alt="piece"/></Draggable>,
    'pb5': <Draggable id='pb5'><Image priority src='/pawn-b.svg' width="60" height="60" alt="piece"/></Draggable>,
    'pb6': <Draggable id='pb6'><Image priority src='/pawn-b.svg' width="60" height="60" alt="piece"/></Draggable>,
    'pb7': <Draggable id='pb7'><Image priority src='/pawn-b.svg' width="60" height="60" alt="piece"/></Draggable>,
    'pb8': <Draggable id='pb8'><Image priority src='/pawn-b.svg' width="60" height="60" alt="piece"/></Draggable>,

    'rb1': <Draggable id='rb1'><Image priority src='/rook-b.svg' width="60" height="60" alt="piece"/></Draggable>,
    'rb2': <Draggable id='rb2'><Image priority src='/rook-b.svg' width="60" height="60" alt="piece"/></Draggable>,
    'nb1': <Draggable id='nb1'><Image priority src='/knight-b.svg' width="60" height="60" alt="piece"/></Draggable>,
    'nb2': <Draggable id='nb2'><Image priority src='/knight-b.svg' width="60" height="60" alt="piece"/></Draggable>,
    'bb1': <Draggable id='bb1'><Image priority src='/bishop-b.svg' width="60" height="60" alt="piece"/></Draggable>,
    'bb2': <Draggable id='bb2'><Image priority src='/bishop-b.svg' width="60" height="60" alt="piece"/></Draggable>,
    'kb': <Draggable id='kb'><Image priority src='/king-b.svg' width="60" height="60" alt="piece"/></Draggable>,
    'qb1': <Draggable id='qb1'><Image priority src='/queen-b.svg' width="60" height="60" alt="piece"/></Draggable>,
}
export const setup: BoardState = {
    'a2': ['pw1', draggables.pw1],
    'b2': ['pw2', draggables.pw2],
    'c2': ['pw3', draggables.pw3],
    'd2': ['pw4', draggables.pw4],
    'e2': ['pw5', draggables.pw5],
    'f2': ['pw6', draggables.pw6],
    'g2': ['pw7', draggables.pw7],
    'h2': ['pw8', draggables.pw8],
    'a1': ['rw1', draggables.rw1],
    'b1': ['nw1', draggables.nw1],
    'c1': ['bw1', draggables.bw1],
    'd1': ['qw1', draggables.qw1],
    'e1': ['kw', draggables.kw],
    'f1': ['bw2', draggables.bw2],
    'g1': ['nw2', draggables.nw2],
    'h1': ['rw2', draggables.rw2],

    'a7': ['pb1', draggables.pb1],
    'b7': ['pb2', draggables.pb2],
    'c7': ['pb3', draggables.pb3],
    'd7': ['pb4', draggables.pb4],
    'e7': ['pb5', draggables.pb5],
    'f7': ['pb6', draggables.pb6],
    'g7': ['pb7', draggables.pb7],
    'h7': ['pb8', draggables.pb8],
    'a8': ['rb1', draggables.rb1],
    'b8': ['nb1', draggables.nb1],
    'c8': ['bb1', draggables.bb1],
    'd8': ['qb1', draggables.qb1],
    'e8': ['kb', draggables.kb],
    'f8': ['bb2', draggables.bb2],
    'g8': ['nb2', draggables.nb2],
    'h8': ['rb2', draggables.rb2]
};

// capturedPieces is useless at this point, but left in the code 
// in case an idea arises which might make it useful
export var capturedPieces: string[] = [];

export var kingRookMovedRecord: any = {
    // each property has an array
    // 1st element is whether or not the piece on that square has moved
    // 2nd element is which FEN castling character should be negated as a result of a move
    a1: [false, 'Q'],
    e1: [false, 'QK'],
    h1: [false, 'K'],
    a8: [false, 'q'],
    e8: [false, 'qk'],
    h8: [false, 'k'],
}