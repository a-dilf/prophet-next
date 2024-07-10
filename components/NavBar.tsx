// components/navigation/Navbar.tsx
import React, { ReactNode } from 'react';
import { AppBar, Toolbar, IconButton, Link, Drawer, List, ListItemText, ListItemButton, Grid, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons';

import { ConnectButton } from '@rainbow-me/rainbowkit';

interface NavbarProps {
    open: boolean;
    setOpen: Function;
}

const Navbar: React.FC<NavbarProps> = ({ open, setOpen }) => {
    return (
        <>
            <AppBar position="sticky" sx={{ paddingTop: '16px', paddingBottom: '16px', border: '1px solid #ee82ee' }}>
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
                            <div>
                                <a href="https://discord.gg/dRYtVaS43A" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                                    <FontAwesomeIcon icon={faDiscord} size="lg" />
                                </a>
                            </div>
                        </Grid>
                        <Grid item>
                            <div>
                                <a href="https://twitter.com/Prophet_lady" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                                    <FontAwesomeIcon icon={faTwitter} size="lg" />
                                </a>
                            </div>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
                <List>
                    <Box component={Link} href="/" underline="none">
                        <ListItemButton onClick={() => setOpen(false)} key="Home">
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </Box>
                    <Box component={Link} href="/litepaper" underline="none">
                        <ListItemButton onClick={() => setOpen(false)} key="litepaper">
                            <ListItemText primary="Litepaper" />
                        </ListItemButton>
                    </Box>
                    <Box component={Link} href="/prophet" underline="none">
                        <ListItemButton onClick={() => setOpen(false)} key="prophet">
                            <ListItemText primary="$Prophet" />
                        </ListItemButton>
                    </Box>
                    <Box component={Link} href="/nfts" underline="none">
                        <ListItemButton onClick={() => setOpen(false)} key="NFTs">
                            <ListItemText primary="NFTs" />
                        </ListItemButton>
                    </Box>
                    <Box component={Link} href="/liquidity" underline="none">
                        <ListItemButton onClick={() => setOpen(false)} key="Liquidity">
                            <ListItemText primary="Liquidity" />
                        </ListItemButton>
                    </Box>
                    <Box component={Link} href="/rewards" underline="none">
                        <ListItemButton onClick={() => setOpen(false)} key="Rewards">
                            <ListItemText primary="Rewards" />
                        </ListItemButton>
                    </Box>
                </List>
            </Drawer>
        </>
    );
};

export default Navbar;
