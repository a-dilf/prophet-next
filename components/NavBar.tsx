// components/navigation/Navbar.tsx
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Drawer,
  Grid,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import React from "react";

import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface NavbarProps {
  open: boolean;
  setOpen: Function;
}

const Navbar: React.FC<NavbarProps> = ({ open, setOpen }) => {
  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          paddingTop: "16px",
          paddingBottom: "16px",
          border: "1px solid #ee82ee",
        }}
      >
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
            <Grid item sx={{ paddingLeft: "15px" }}>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Box sx={{ display: "flex", gap: "20px" }}>
                <div>
                  <ConnectButton />
                </div>
                <div style={{paddingTop:"7px"}}>
                  <a
                    href="https://arbitrum.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "none" }} // Adjust styles as needed
                  >
                    {/* Embedding SVG directly */}
                    { /* Replace 'path/to/arbitrum-logo.svg' with the actual path to your logo */}
                    <img src="/arb small.png" alt="Arbitrum One Logo" style={{ height: "24px", width: "auto"}} />
                  </a>
                </div>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: "flex", gap: "20px" }}>
                {" "}
                {/* Add this Box component */}
                <div>
                  <a
                    href="https://discord.gg/dRYtVaS43A"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "white" }}
                  >
                    <FontAwesomeIcon icon={faDiscord} size="lg" />
                  </a>
                </div>
                <div>
                  <a
                    href="https://twitter.com/Prophet_lady"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "white" }}
                  >
                    <FontAwesomeIcon icon={faTwitter} size="lg" />
                  </a>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "black", // Replace with your desired background color
          }
        }}>
        <List>
          <Box component={Link} href="/" underline="none">
            <ListItemButton onClick={() => setOpen(false)} key="Home"
              sx={{
                borderBottom: '1px solid violet', // Applies a violet border only to the bottom
                borderRadius: '4px', // Optional: adds rounded corners to the border
                '&:hover': {
                  backgroundColor: 'rgba(238, 130, 238, 0.1)', // Light violet background on hover
                  borderColor: 'violet', // Ensures the border remains violet on hover
                },
              }}
            >
              <ListItemText primary="Home" sx={{ color: 'violet' }} />
            </ListItemButton>
          </Box>
          <Box component={Link} href="/litepaper" underline="none">
            <ListItemButton onClick={() => setOpen(false)} key="Litepaper"
              sx={{
                borderBottom: '1px solid violet', // Applies a violet border only to the bottom
                borderRadius: '4px', // Optional: adds rounded corners to the border
                '&:hover': {
                  backgroundColor: 'rgba(238, 130, 238, 0.1)', // Light violet background on hover
                  borderColor: 'violet', // Ensures the border remains violet on hover
                },
              }}
            >
              <ListItemText primary="Litepaper" sx={{ color: 'violet' }} />
            </ListItemButton>
          </Box>
          <Box component={Link} href="/prophet" underline="none">
            <ListItemButton onClick={() => setOpen(false)} key="$PROPHET"
              sx={{
                borderBottom: '1px solid violet', // Applies a violet border only to the bottom
                borderRadius: '4px', // Optional: adds rounded corners to the border
                '&:hover': {
                  backgroundColor: 'rgba(238, 130, 238, 0.1)', // Light violet background on hover
                  borderColor: 'violet', // Ensures the border remains violet on hover
                },
              }}
            >
              <ListItemText primary="$PROPHET" sx={{ color: 'violet' }} />
            </ListItemButton>
          </Box>
          <Box component={Link} href="/nfts" underline="none">
            <ListItemButton onClick={() => setOpen(false)} key="NFTs"
              sx={{
                borderBottom: '1px solid violet', // Applies a violet border only to the bottom
                borderRadius: '4px', // Optional: adds rounded corners to the border
                '&:hover': {
                  backgroundColor: 'rgba(238, 130, 238, 0.1)', // Light violet background on hover
                  borderColor: 'violet', // Ensures the border remains violet on hover
                },
              }}
            >
              <ListItemText primary="NFTs" sx={{ color: 'violet' }} />
            </ListItemButton>
          </Box>
          <Box component={Link} href="/liquidity" underline="none">
            <ListItemButton onClick={() => setOpen(false)} key="Liquidity"
              sx={{
                borderBottom: '1px solid violet', // Applies a violet border only to the bottom
                borderRadius: '4px', // Optional: adds rounded corners to the border
                '&:hover': {
                  backgroundColor: 'rgba(238, 130, 238, 0.1)', // Light violet background on hover
                  borderColor: 'violet', // Ensures the border remains violet on hover
                },
              }}
            >
              <ListItemText primary="Liquidity" sx={{ color: 'violet' }} />
            </ListItemButton>
          </Box>
          <Box component={Link} href="/rewards" underline="none">
            <ListItemButton onClick={() => setOpen(false)} key="Rewards"
              sx={{
                borderBottom: '1px solid violet', // Applies a violet border only to the bottom
                borderRadius: '4px', // Optional: adds rounded corners to the border
                '&:hover': {
                  backgroundColor: 'rgba(238, 130, 238, 0.1)', // Light violet background on hover
                  borderColor: 'violet', // Ensures the border remains violet on hover
                },
              }}
            >
              <ListItemText primary="Rewards" sx={{ color: 'violet' }} />
            </ListItemButton>
          </Box>
        </List>
      </Drawer >
    </>
  );
};

export default Navbar;
