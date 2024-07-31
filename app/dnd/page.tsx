'use client'
import {useState, useEffect} from 'react';
import Board from '@/app/ui/Board';
import { useWebSocketContext } from "../webSocketContext";
import clsx from 'clsx';

export default function Dnd() {
  const [showboard, setShowboard] = useState(false);
  const [username, setUsername] = useState('');
  const [opponent, setOpponent] = useState('');
  const [registrationID, setRegistrationID] = useState('');
  const [message, setMessage] = useState('');
  const [messageResponse, setMessageResponse] = useState('');
  const socket = useWebSocketContext();
  const promise = new Promise((resolve, reject) => {
    socket.on('registrationID', function(socketID: string) {
      resolve(socketID);
    });
  });

  socket.on('message_to_opponent', function(message: { message: string, from: string}) {
    setMessage(message.message);
    socket.emit('hand_shake_response', message.from )
  });

  socket.on('response_from_opponent', function (messageResponse) {
    setMessageResponse(messageResponse);
  });

  (() => {
    socket.emit('register');
    promise.then((registrationID) => {
      if (typeof registrationID === 'string') {
        setRegistrationID(registrationID);
      }
    });
  })();

  function handleHandshake() {
    socket.emit('hand_shake', opponent);
  }

  function handleSetOpponent(e: any) {
    setOpponent(e.target.value);
  }

  if (showboard) {
    return <Board username={username} opponent={opponent} />
  } else {
    return (
      <div className='p-2'>
        <div className='p-2'>
          <p>Your registrationID is
            <span className={clsx('pl-2', {'hidden' : !!registrationID })} >. . .</span>
            <span className='pl-1 text-lime-500'>{registrationID}</span>
          </p>
        </div>
        <div className={clsx('p-2', {'hidden' : !registrationID })}>
          <p>Paste Opponent's Registration ID here, and click Handshake to get started.</p>
          <input type='text' value={opponent} onChange={handleSetOpponent} className='px-1 text-black' />
        </div>
        <div className={clsx('flex flex-row p-2', {'hidden' : !registrationID })}>
          <button onClick={handleHandshake}
                  disabled={!opponent}
                  className={clsx('px-2 bg-slate-300 border border-white rounded-md text-black',
                            { 'text-black' :  !!opponent, 'text-slate-600' : !opponent } )}>Handshake
          </button>
          <p className={clsx('px-2', {'hidden' : !messageResponse })}>{messageResponse}</p>
        </div>
        <div className={clsx('p-2', {'hidden' : !message })}>
          <p>Handshake message from opponent with id: {message}</p>
        </div>
      </div>
    );
  }
}