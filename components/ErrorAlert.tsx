// components/navigation/Navbar.tsx
import React, { ReactNode } from 'react';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface ErrorAlertProps {
    message: string,
    errorMessage: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, errorMessage, setErrorMessage }) => {
    const [open, setOpen] = React.useState(false);
  
    // Function to handle closing the dialog
    const handleCloseDialog = () => {
      setOpen(false);
      // handleClose(); // Call the passed handleClose prop to notify the parent component
    };
  
    // Function to trigger the dialog with an error message
    const handleError = () => {
      setErrorMessage(message);
      setOpen(true);
    };
  
    return (
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Alert severity="error">{errorMessage}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  export default ErrorAlert;
