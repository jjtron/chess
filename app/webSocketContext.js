import {createContext, useContext} from "react";
import socketIOClient from "socket.io-client";
import { NEXT_PUBLIC_WSENDPOINT } from "./lib/actions";

const WebSocketContext = createContext(socketIOClient(NEXT_PUBLIC_WSENDPOINT));

export const WebSocketProvider = ({ children }) => {
  const socket = socketIOClient(NEXT_PUBLIC_WSENDPOINT);
  return (
    <WebSocketContext.Provider value={socket} >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => useContext(WebSocketContext);