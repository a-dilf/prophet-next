// next and react imports
import React from 'react';
import type { NextPage } from 'next';

import { Typography, Button } from '@mui/material';

// rainbowkit+ imports
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

const Prophet: NextPage = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <Typography className="container" variant="h2">Home</Typography>
    </div>
  );
};

export default Prophet;
