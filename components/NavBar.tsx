// components/navigation/Navbar.tsx
import React, { ReactNode } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItemText, ListItemButton, Grid, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { ConnectButton } from '@rainbow-me/rainbowkit';

interface NavbarProps {
    open: boolean;
    setOpen: Function;
}

const Navbar: React.FC<NavbarProps> = ({ open, setOpen }) => {
    return (
        <>
            <AppBar position="fixed" sx={{ paddingTop: '16px', paddingBottom: '16px', border: '1px solid #ee82ee' }}>
                <Toolbar>
                    <Grid container justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                        <Grid item sx={{ paddingLeft: '15px' }}>
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpen(true)}>
                                <MenuIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <ConnectButton />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="secondary">BUY</Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
                <List>
                    <ListItemButton onClick={() => setOpen(false)} key="Home">
                        <ListItemText primary="Home" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setOpen(false)} key="Lite Paper">
                        <ListItemText primary="Lite Paper" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setOpen(false)} key="Buy $PROPHET">
                        <ListItemText primary="Buy $PROPHET" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setOpen(false)} key="Mint">
                        <ListItemText primary="Mint" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setOpen(false)} key="Liquidity">
                        <ListItemText primary="Liquidity" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setOpen(false)} key="Stake">
                        <ListItemText primary="Stake" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setOpen(false)} key="Rewards">
                        <ListItemText primary="Rewards" />
                    </ListItemButton>
                </List>
            </Drawer>
        </>
    );
};

export default Navbar;
