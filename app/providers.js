'use client'
import { WebSocketProvider } from "./webSocketContext";
import { ChakraProvider } from '@chakra-ui/react';
import { AlertProvider } from "./alertContext";

export function Providers({ children }) {
  return  <ChakraProvider>
            <AlertProvider>
              <WebSocketProvider>
                {children}
              </WebSocketProvider>
            </AlertProvider>
          </ChakraProvider>
}