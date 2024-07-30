'use client'
import {useState, useEffect} from 'react';
import Board from '@/app/ui/Board';
import { useWebSocketContext } from "../webSocketContext";

export default function Dnd() {
  const [showboard, setShowboard] = useState(false);
  const [username, setUsername] = useState('');
  const [opponent, setOpponent] = useState('');
  const socket = useWebSocketContext();
  const promise = new Promise((resolve, reject) => {
    socket.on('myid', function(data: any) {
      resolve(data);
    });
  });

  function handleClick() {
    if (username && opponent) {
      setShowboard(true);
    }
  }
  function handleUsername(e: any) {
    setUsername(e.target.value);
  }
  function handleOpponent(e: any) {
    setOpponent(e.target.value);
  }
  function handleTest() {
    socket.emit('i am client', username);
    promise.then((data) => {
      console.log(data);
    }).catch((e) => {
      console.log(e);
    });
  }

  if (showboard) {
    return <Board username={username} />
  } else {
    return (
      <div className='p-2'>
        <div className='py-1'>
          <p>Username</p>
          <input type='text' value={username} onChange={handleUsername} className='px-1 text-black' />
        </div>
        <div className='py-1'>
          <p>Opponent</p>
          <input type='text' value={opponent} onChange={handleOpponent} className='px-1 text-black' />
        </div>
        <div className='p-2'>
          <button onClick={handleClick}  className='py-1 bg-slate-300 border border-white rounded-md text-black'>Start Playing</button>
        </div>
        <div className='p-2'>
          <button onClick={handleTest}  className='py-1 bg-slate-300 border border-white rounded-md text-black'>Register</button>
        </div>
      </div>
    );
  }
}