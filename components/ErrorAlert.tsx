// components/navigation/Navbar.tsx
import React, { ReactNode } from 'react';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

interface ErrorAlertProps {
    errorMessage: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ errorMessage, setErrorMessage }) => {
    const [open2, setOpen2] = React.useState(false);
  
    // Function to handle closing the dialog
    const handleCloseDialog = () => {
      setOpen2(false);
      setErrorMessage("")
    };

    React.useEffect(() => {
        if (errorMessage != "") {
            setOpen2(true)
        }
      }, [errorMessage]); // Dependency array includes errorMessage to re-run the effect when it changes
  
    return (
      <Dialog open={open2} onClose={handleCloseDialog}>
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
