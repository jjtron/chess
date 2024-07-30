import {createContext, useContext} from "react";
import socketIOClient from "socket.io-client";
const DEVENDPOINT = "http://localhost:3003";
const PRODENDPOINT = "https://portfolio.gp-web-dev.com:8445";
const WebSocketContext = createContext(socketIOClient(DEVENDPOINT));

export const WebSocketProvider = ({ children }) => {
  const socket = socketIOClient(DEVENDPOINT);
  return (
    <WebSocketContext.Provider value={socket} >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => useContext(WebSocketContext);