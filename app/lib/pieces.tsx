import {Draggable} from '../ui/Draggable';

export const draggables: {[key: string]: JSX.Element } = {
    'pw1': <Draggable id='pw1'><img src='/pawn-w.svg'/></Draggable>,
    'pw2': <Draggable id='pw2'><img src='/pawn-w.svg'/></Draggable>,
    'pw3': <Draggable id='pw3'><img src='/pawn-w.svg'/></Draggable>,
    'pw4': <Draggable id='pw4'><img src='/pawn-w.svg'/></Draggable>,
    'pw5': <Draggable id='pw5'><img src='/pawn-w.svg'/></Draggable>,
    'pw6': <Draggable id='pw6'><img src='/pawn-w.svg'/></Draggable>,
    'pw7': <Draggable id='pw7'><img src='/pawn-w.svg'/></Draggable>,
    'pw8': <Draggable id='pw8'><img src='/pawn-w.svg'/></Draggable>,

    'rw1': <Draggable id='rw1'><img src='/rook-w.svg'/></Draggable>,
    'rw2': <Draggable id='rw2'><img src='/rook-w.svg'/></Draggable>,
    'kw1': <Draggable id='kw1'><img src='/knight-w.svg'/></Draggable>,
    'kw2': <Draggable id='kw2'><img src='/knight-w.svg'/></Draggable>,
    'bw1': <Draggable id='bw1'><img src='/bishop-w.svg'/></Draggable>,
    'bw2': <Draggable id='bw2'><img src='/bishop-w.svg'/></Draggable>,
    'kw': <Draggable id='kw'><img src='/king-w.svg'/></Draggable>,
    'qw': <Draggable id='qw'><img src='/queen-w.svg'/></Draggable>,
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