import {createContext, useContext, useState} from "react";

const AlertContext = createContext({
  onOpen: (type: string, message: string) => {},
  onClose: () => {}
});

export const AlertProvider = ({ children } : any ) => {
  const [state, setState] = useState({
    isOpen: false,
    // Type can be either check, checkmate or "error
    type: 'check',
    // Message to be displayed, can be any string
    message: '',
  });

  return (
    <AlertContext.Provider
      value={{
        ...state,
        onOpen: (type: string, message: string) => setState({ isOpen: true, type, message }),
        onClose: () => setState({ isOpen: false, type: '', message: '' }),
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => useContext(AlertContext);
