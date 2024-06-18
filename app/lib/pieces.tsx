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
    '71': ['pw1', draggables.pw1],
    '72': ['pw2', draggables.pw2],
    '73': ['pw3', draggables.pw3],
    '74': ['pw4', draggables.pw4],
    '75': ['pw5', draggables.pw5],
    '76': ['pw6', draggables.pw6],
    '77': ['pw7', draggables.pw7],
    '78': ['pw8', draggables.pw8],
    '81': ['rw1', draggables.rw1],
    '82': ['kw1', draggables.kw1],
    '83': ['bw1', draggables.bw1],
    '84': ['kw', draggables.kw],
    '85': ['qw', draggables.qw],
    '86': ['bw2', draggables.bw2],
    '87': ['kw2', draggables.kw2],
    '88': ['rw2', draggables.rw2]
};