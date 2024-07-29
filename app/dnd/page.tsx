'use client'
import Board from '@/app/ui/Board';

export default function Home() {
  const username: string = 'me';
  return (
    <Board username={username} />
  );
}