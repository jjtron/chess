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
              else {
                return 'black'
              }
            })()} 
            backgroundColor={(() => {
              if (isCheck) { return 'yellow'} 
              else if
                 (isCheckmate) { return 'blue'}
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
              else {
                return 'ERROR'
              }
            })()}
          </AlertDialogHeader>
          <AlertDialogBody>{message}</AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default Alert;
