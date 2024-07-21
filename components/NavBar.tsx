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
              <ConnectButton />
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
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 250,
            backgroundColor: "#1a1a1a",
            color: "white",
          },
        }}
      >
        <List sx={{ paddingTop: "20px" }}>
          {[
            { text: "Home", href: "/" },
            { text: "Litepaper", href: "/litepaper" },
            { text: "$Prophet", href: "/prophet" },
            { text: "NFTs", href: "/nfts" },
            { text: "Liquidity", href: "/liquidity" },
            { text: "Rewards", href: "/rewards" },
          ].map((item) => (
            <Box component={Link} href={item.href} underline="none" key={item.text}>
              <ListItemButton
                onClick={() => setOpen(false)}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(238, 130, 238, 0.1)",
                  },
                }}
              >
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: { color: "white", fontWeight: "medium" },
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
