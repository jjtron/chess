'use client'
import {useState} from 'react';
import Board from '@/app/ui/Board';
const DEVENDPOINT = "http://localhost:3003";
const PRODENDPOINT = "https://portfolio.gp-web-dev.com:8445";
import socketIOClient from "socket.io-client";
export const socket = socketIOClient(DEVENDPOINT);

export default function Dnd() {
  const [showboard, setShowboard] = useState(false);
  const [username, setUsername] = useState('');
  function handleClick() {
    setShowboard(true);
  }
  function handleUsername(e: any) {
    setUsername(e.target.value);
  }

  if (showboard) {
    return <Board username={username} socket={socket} />
  } else {
    return (<>
      <input type='text' value={username} onChange={handleUsername} className='text-black' />
      <button onClick={handleClick}>Click Me</button>
    </>)
  }
}