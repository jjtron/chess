'use client'
import Board from '@/app/ui/Board';

export default function Dnd() {
    return (
      <Board adversaryID={'machine'} registrationID={'na'} isOpponentSelf={false} />
    );
}
