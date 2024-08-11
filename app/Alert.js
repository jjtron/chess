import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useAlertContext } from "./alertContext";
import { useRef } from "react";

/**
 * This is a global component that uses context to display a global alert message.
 */
function Alert() {
  const { isOpen, type, message, onClose } = useAlertContext();
  const cancelRef = useRef();
  const isCheck = type === "check"
  const isCheckmate = type === "checkmate"
  const isCastle = type === "castle"

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent py={4} 
            color={(() => {
              if (isCheck) { return 'black'} 
              else if
                 (isCheckmate) { return 'white'}
              else if
                (isCastle) { return 'black'}
              else {
                return 'black'
              }
            })()} 
            backgroundColor={(() => {
              if (isCheck) { return 'yellow'} 
              else if
                 (isCheckmate) { return 'blue'}
              else if
                (isCastle) { return 'lime'}
              else {
                return 'red'
              }
            })()}
          >
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {(() => {
              if (isCheck) { return 'CHECK'} 
              else if
                 (isCheckmate) { return 'CHECKMATE'}
              else if
                (isCastle) { return 'CASTLING RULES'}
              else {
                return 'ERROR'
              }
            })()}
          </AlertDialogHeader>
          <AlertDialogBody><NewlineText>{message}</NewlineText></AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default Alert;

export function NewlineText({children}) {
  if (Array.isArray(children)) {
    // if the text is in the form of an array with * bullets preceeding each line
    return children.map(str => {
      if (str.charAt(0) === '*') {
        return <div key={str.charAt(2, 5)} className="flex flex-row">
          <p className="pr-2">*</p>
          <p>{str.substr(2)}</p>
        </div>
      } else {
        return <p key={str.charAt(0)}>{str}</p>;
      }
    });
  } else {
    // if justy an ordinary string with or without line breaks ('\n')s
    return children.split('\n').map(str => <p key={str.charAt(0)}>{str}</p>);
  }
}