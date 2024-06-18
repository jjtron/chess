import {Draggable} from '../ui/Draggable';
import Image from 'next/image';

export const draggables: {[key: string]: JSX.Element } = {
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
    'kw1': <Draggable id='kw1'><Image priority src='/knight-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'kw2': <Draggable id='kw2'><Image priority src='/knight-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'bw1': <Draggable id='bw1'><Image priority src='/bishop-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'bw2': <Draggable id='bw2'><Image priority src='/bishop-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'kw': <Draggable id='kw'><Image priority src='/king-w.svg' width="60" height="60" alt="piece"/></Draggable>,
    'qw': <Draggable id='qw'><Image priority src='/queen-w.svg' width="60" height="60" alt="piece"/></Draggable>,
}
export const setup: {[key: string]: [string, JSX.Element]} = {
    'a2': ['pw1', draggables.pw1],
    'b2': ['pw2', draggables.pw2],
    'c2': ['pw3', draggables.pw3],
    'd2': ['pw4', draggables.pw4],
    'e2': ['pw5', draggables.pw5],
    'f2': ['pw6', draggables.pw6],
    'g2': ['pw7', draggables.pw7],
    'h2': ['pw8', draggables.pw8],
    'a1': ['rw1', draggables.rw1],
    'b1': ['kw1', draggables.kw1],
    'c1': ['bw1', draggables.bw1],
    'd1': ['kw', draggables.kw],
    'e1': ['qw', draggables.qw],
    'f1': ['bw2', draggables.bw2],
    'g1': ['kw2', draggables.kw2],
    'h1': ['rw2', draggables.rw2]
};