'use client'
import Board from '@/app/ui/Board';
const DEVENDPOINT = "http://localhost:3003";
const PRODENDPOINT = "https://portfolio.gp-web-dev.com:8445";
import socketIOClient from "socket.io-client";
export const socket = socketIOClient(DEVENDPOINT);

export default function Home() {
  const username: string = 'me';
  return (
    <Board username={username} socket={socket} />
  );
}