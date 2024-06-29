// next and react imports
import React from 'react';
import type { NextPage } from 'next';

import { Table, TableBody, TableCell, TableContainer, TableRow, Typography, Box, Grid, Link, Button, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// rainbowkit+ imports
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

const addressesForAccordian = [
  { card_title: "token", contract_address: "0x9daa44637Ac3417fBC9198E0464c7F8b5759d5A3" },
  { card_title: "nft", contract_address: "0xA7b205092cCB9D581CECfA0439b61f2A44605118" },
  { card_title: "vault", contract_address: "0xF1a806485C311f8bFca232F8ea5058EfC4422cf3" },
  { card_title: "liquidity pool", contract_address: "0x190685e825c14a8D89672f17035EFC8DB53b12F4" },
  { card_title: "token staking", contract_address: "0x3Cb43455702BC99ab696670AFCA630C8c66c8005" },
  { card_title: "nft staking", contract_address: "0x1D51b0aB7018a86ADD284f881FA6fC47aeD7AF96" },
  { card_title: "lp staking", contract_address: "0xeE8f87c7cd22D8939eB825dc55e0D0380A849DE1" },
]

const Home: NextPage = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '35px' }}>
      <Typography className="container" variant="h2">$PROPHET</Typography>
      
    </div>
  );
};

export default Home;
