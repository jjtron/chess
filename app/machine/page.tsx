'use client'
import Board from '@/app/ui/Board';

export default function Dnd() {
    return (
      <Board opponent={'machine'} isOpponentSelf={false} />
    );
}
