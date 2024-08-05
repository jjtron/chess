'use client'
import {useState, useEffect} from 'react';
import Board from '@/app/ui/Board';
import { useWebSocketContext } from "../webSocketContext";
import clsx from 'clsx';

export default function Dnd() {
  const [showboard, setShowboard] = useState(false);
  const [adversaryID, setOpponent] = useState('');
  const [registrationID, setRegistrationID] = useState('');
  const [message, setMessage] = useState('');
  const [messageResponse, setMessageResponse] = useState('');
  const socket = useWebSocketContext();

  socket.on('message_to_opponent', function(message: { message: string, from: string}) {
    setMessage(message.message);
    socket.emit('hand_shake_response', message.from )
  });

  socket.on('response_from_opponent', function (messageResponse) {
    setMessageResponse(messageResponse);
  });

  useEffect(() => {
    (() => {
      const promise = new Promise((resolve, reject) => {
        socket.on('registrationID', function(socketID: string) {
          resolve(socketID);
        });
      });
      socket.emit('register');
      promise.then((registrationID) => {
        if (typeof registrationID === 'string') {
          setRegistrationID(registrationID);
        }
      });
    })();
  }, [socket]);

  function handleHandshake() {
    socket.emit('hand_shake', adversaryID);
  }

  function handleSetOpponent(e: any) {
    setOpponent(e.target.value);
  }

  function handleShowboard() {
    setShowboard(true);
  }

  if (showboard) {
    return <Board adversaryID={adversaryID} registrationID={registrationID} isOpponentSelf={true} />
  } else {
    return (
      <div className='p-2 min-h-screen'>
        <div className='p-2'>
          <p>Your registrationID is
            <span className={clsx('pl-2', {'hidden' : !!registrationID })} >. . .</span>
            <span className={clsx('pl-2', {'hidden' : !registrationID })} >:</span>
            <span className='pl-1 text-lime-500'>&nbsp;{registrationID}</span>
          </p>
        </div>
        <div className={clsx('p-2', {'hidden' : !registrationID })}>
          <p>Paste Opponent&apos;s Registration ID here, and click Handshake to get started.</p>
          <input type='text' size={25} value={adversaryID} onChange={handleSetOpponent} className='px-1 text-black' />
        </div>
        <div className={clsx('flex flex-row p-2', {'hidden' : !registrationID })}>
          <button onClick={handleHandshake}
                  disabled={!adversaryID}
                  className={clsx('px-2 bg-slate-300 border border-white rounded-md text-black',
                            { 'text-black' :  !!adversaryID, 'text-slate-600' : !adversaryID } )}>Handshake
          </button>
          <p className={clsx('px-2', {'hidden' : !messageResponse })}>{messageResponse}</p>
        </div>
        <div className={clsx('p-2', {'hidden' : !message })}>
          <p>Handshake message from opponent with id: {message}</p>
        </div>
        <div className={clsx('p-2', {'hidden' : !message || !messageResponse })}>
          <button onClick={handleShowboard}
                  className={clsx('px-2 bg-slate-300 border border-white rounded-md text-black',
                            { 'text-black' :  !!adversaryID, 'text-slate-600' : !adversaryID } )}>Play
          </button>
        </div>
      </div>
    );
  }
}