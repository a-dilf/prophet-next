import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  Typography,
} from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

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
          background: "linear-gradient(to right, #000000, #1a001a)",
          boxShadow: "0 4px 6px rgba(238, 130, 238, 0.1)",
          borderBottom: "2px solid #ee82ee",
        }}
      >
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
            <Grid item>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setOpen(true)}
                sx={{
                  color: "violet",
                  '&:hover': {
                    backgroundColor: 'rgba(238, 130, 238, 0.1)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography variant="h6" sx={{ color: "violet", fontWeight: "bold", letterSpacing: "1px" }}>
                ProphetLady
              </Typography>
            </Grid>
            <Grid item>
              <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <ConnectButton />
                <a
                  href="https://arbitrum.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img src="/arb small.png" alt="Arbitrum One Logo" style={{ height: "24px", width: "auto" }} />
                </a>
                <Box sx={{ display: "flex", gap: "15px" }}>
                  <IconButton
                    href="https://discord.gg/dRYtVaS43A"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "violet",
                      '&:hover': {
                        backgroundColor: 'rgba(238, 130, 238, 0.1)',
                      },
                    }}
                  >
                    <FontAwesomeIcon icon={faDiscord} size="lg" />
                  </IconButton>
                  <IconButton
                    href="https://twitter.com/Prophet_lady"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "violet",
                      '&:hover': {
                        backgroundColor: 'rgba(238, 130, 238, 0.1)',
                      },
                    }}
                  >
                    <FontAwesomeIcon icon={faTwitter} size="lg" />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#0a0a0a",
            width: 250,
          }
        }}
      >
        <List sx={{ padding: "20px 0" }}>
          {["Home", "Litepaper", "$PROPHET", "NFTs", "Liquidity", "Rewards"].map((text, index) => (
            <Box key={text} component={Link} href={`/${text.toLowerCase() === 'home' ? '' : text.toLowerCase()}`} underline="none">
              <ListItemButton
                onClick={() => setOpen(false)}
                sx={{
                  borderBottom: '1px solid #4a0e4a',
                  margin: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(238, 130, 238, 0.1)',
                    transform: 'translateX(5px)',
                  },
                }}
              >
                <ListItemText
                  primary={text}
                  sx={{
                    color: 'violet',
                    '& .MuiListItemText-primary': {
                      fontWeight: 'bold',
                    },
                  }}
                />
              </ListItemButton>
            </Box>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;