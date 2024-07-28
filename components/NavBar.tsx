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
                <div style={{ paddingTop: "7px" }}>
                  <a
                    href="https://arbitrum.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "none" }} // Adjust styles as needed
                  >
                    {/* Embedding SVG directly */}
                    {/* Replace 'path/to/arbitrum-logo.svg' with the actual path to your logo */}
                    <img src="/arb small.png" alt="Arbitrum One Logo" style={{ height: "24px", width: "auto" }} />
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
      <Sidebar open={open} setOpen={setOpen} />
    </>
  );
};

export const Sidebar: React.FC<NavbarProps> = ({ open, setOpen }) => {
  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "Litepaper", path: "/litepaper" },
    { name: "$PROPHET", path: "/prophet" },
    { name: "NFTs", path: "/nfts" },
    { name: "Liquidity", path: "/liquidity" },
    { name: "Rewards", path: "/rewards" },
  ];
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          backgroundColor: "#0a0a0a",
          width: 250,
        },
      }}
    >
      <List sx={{ padding: "20px 0" }}>
        {navigationItems.map((item) => (
          <Box key={item.name} component={Link} href={item.path} underline="none">
            <ListItemButton
              onClick={() => setOpen(false)}
              sx={{
                borderBottom: "1px solid #4a0e4a",
                margin: "8px 16px",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(238, 130, 238, 0.1)",
                  transform: "translateX(5px)",
                },
              }}
            >
              <ListItemText
                primary={item.name}
                sx={{
                  color: "violet",
                  "& .MuiListItemText-primary": {
                    fontWeight: "bold",
                  },
                }}
              />
            </ListItemButton>
          </Box>
        ))}
      </List>
    </Drawer>
  );
};

export default Navbar;
