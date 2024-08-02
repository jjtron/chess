'use client'
import Board from '@/app/ui/Board';

export default function Dnd() {
    return (
      <Board opponent={'self'} isOpponentSelf={true} />
    );
}
