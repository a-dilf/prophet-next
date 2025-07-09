// next and react imports
import type { NextPage } from "next";
import React from "react";
import styles from "../styles/HomePage.module.css";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

import CircleIcon from "@mui/icons-material/Circle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ImageBar from "components/ImageBar";
import { toWei } from "web3-utils";
import { ido_vault_abi } from "../../abi_objects/ido_abi";
import { token_abi } from "../../abi_objects/token_abi";

import { parseAbi } from "viem";
import { usePublicClient } from "wagmi";

import TexturedCube from "components/TexturedCube";

import FlashingHeader from "components/FlashingHeader";

// rainbowkit+ imports
import { useAccount, useReadContract } from "wagmi";

const addressesForAccordian = [
  { card_title: "token", contract_address: "0xb9E0b8385B63d94367043b248414C58a94A37932" },
  { card_title: "nft", contract_address: "0xC21Bd794cC47443692A485cC4B6B1200becCF89d" },
  { card_title: "vault", contract_address: "0xAcaFE370403d7172539d96Df62979221116313eB" },
  { card_title: "liquidity pool", contract_address: "0x6bD1A20Da7Cb05394dE87197EC8b02E67D249C03" },
  { card_title: "token staking", contract_address: "0x37EA4C3fd77DBf4e796f86fC75bCde83567c846e" },
  { card_title: "nft staking", contract_address: "0x63B2d27F4B1cCFacE4CE048856647C38a35beac0" },
  { card_title: "lp staking", contract_address: "0x6e5451ac32FA376FE8BEFEa0f37Fc665f4020677" },
];

const Home: NextPage = () => {
  const [mounted, setMounted] = React.useState(false);
  const [totalSupplyState, settotalSupply] = React.useState(0n);
  const [taxRewardsState, setTaxRewardsState] = React.useState(0);
  const [tokensInCirculation, setTokensInCirculation] = React.useState(0n);

  const [claimEventsTotal, setClaimEventsTotal] = React.useState(0);
  const publicClient = usePublicClient();
  console.log("pub type", typeof publicClient);

  const fetchClaimEvents = React.useCallback(async () => {
    if (!publicClient) return; // Early return if publicClient is undefined

    try {
      const logs = await publicClient.getLogs({
        address: "0x37EA4C3fd77DBf4e796f86fC75bCde83567c846e", // token staking address
        event: parseAbi(["event Claim(address indexed _account, uint256 tokenAmount)"])[0],
        fromBlock: 0n,
        toBlock: "latest",
      });

      // Sum all claim amounts
      const total = logs.reduce((sum, log) => sum + (log.args.tokenAmount as bigint), 0n);

      await console.log("claims check ", total);

      // Convert from wei to eth and set state
      setClaimEventsTotal(Number(total) / 1e18);
    } catch (err) {
      console.error("Error fetching claim events:", err);
    }
  }, [publicClient]);

  // Add useEffect to fetch claim events only when publicClient is available
  React.useEffect(() => {
    if (publicClient) {
      fetchClaimEvents();
    }
  }, [fetchClaimEvents, publicClient]);

  const { address } = useAccount();

  const burnBalanceOfContractConfig = {
    address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as "0x${string}",
    abi: token_abi,
    functionName: "totalSupply",
  } as const;

  const tokensRemainingInValtContractConfig = {
    address: process.env.NEXT_PUBLIC_IDO_ADDRESS as "0x${string}",
    abi: ido_vault_abi,
    functionName: "totalSold",
  } as const;

  const rewardsAmountContractConfig = {
    address: process.env.NEXT_PUBLIC_IDO_ADDRESS as "0x${string}",
    abi: ido_vault_abi,
    functionName: "taxFromParticipation",
  } as const;

  const { data: totalSupply } = useReadContract({
    ...burnBalanceOfContractConfig,
  });

  const { data: vaultTokensLeft } = useReadContract({
    ...tokensRemainingInValtContractConfig,
  });

  const { data: taxRewardsAmount } = useReadContract({
    ...rewardsAmountContractConfig,
  });

  React.useEffect(() => {
    if (totalSupply) {
      const tokensBurned = 200000000000000000000000000000 - Number(totalSupply);
      settotalSupply(BigInt(Math.floor(tokensBurned / 1000000000000000000)));
    }
  }, [totalSupply]);

  React.useEffect(() => {
    if (taxRewardsAmount) {
      const taxRewardsAmountInEth = toWei(taxRewardsAmount, "wei");
      setTaxRewardsState(Number(taxRewardsAmountInEth) / 1000000000000000000);
      // setTaxRewardsState(BigInt(Number(taxRewardsAmount) / 1000000000000000000));
      // setTaxRewardsState("1000000000000000000" + taxRewardsAmount.toString());
    }
  }, [taxRewardsAmount]);

  React.useEffect(() => {
    if (vaultTokensLeft) {
      let convertedVaultTokens = Number(BigInt(Math.floor(Number(vaultTokensLeft) / 1000000000000000000)));

      const startDate = new Date("2024-08-16T22:22:20Z"); // 'Z' indicates UTC
      const currentDate = new Date();
      const differenceInTime = currentDate.getTime() - startDate.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24)); // Convert milliseconds to days
      const pool_one_tokens = differenceInDays * 15000000;

      const differenceInMonths = Math.floor(differenceInTime / (1000 * 3600 * 24 * 30)); // Approximation assuming 30 days per month
      const pool_two_tokens = Math.min(differenceInMonths, 12) * 250000000; // 250 million per month
      const pool_three_tokens = Math.min(differenceInMonths, 24) * 833333333; // 833333333 per month

      let total_tokens = convertedVaultTokens + pool_one_tokens + pool_two_tokens + pool_three_tokens;

      // console.log("!!! ", convertedVaultTokens, pool_one_tokens, total_tokens)
      setTokensInCirculation(BigInt(total_tokens));
    }
  }, [vaultTokensLeft]);

  // 2297933441
  // 2792933441

  React.useEffect(() => setMounted(true), []);

  // NOTE - only 12 can be shown at a time

  const oekaki_images_1 = [
    { src: "oekaki/407.avif", alt: "Description 1" },
    { src: "oekaki/1366.avif", alt: "Description 1" },
    { src: "oekaki/2122.avif", alt: "Description 1" },
    { src: "oekaki/3146.avif", alt: "Description 1" },
    { src: "oekaki/3376.avif", alt: "Description 1" },
    { src: "oekaki/3500.avif", alt: "Description 1" },
    { src: "oekaki/3510.avif", alt: "Description 1" },
    { src: "oekaki/3513.avif", alt: "Description 1" },
    { src: "oekaki/3522.avif", alt: "Description 1" },
    { src: "oekaki/3734.avif", alt: "Description 1" },
    { src: "oekaki/3941.avif", alt: "Description 1" },
    { src: "oekaki/4126.avif", alt: "Description 1" },
  ];

  const oekaki_images_2 = [
    { src: "oekaki/4598.avif", alt: "Description 1" },
    { src: "oekaki/4782.avif", alt: "Description 1" },
    { src: "oekaki/5167.avif", alt: "Description 1" },
    { src: "oekaki/2122.avif", alt: "Description 1" },
    { src: "oekaki/799.avif", alt: "Description 1" },
    { src: "oekaki/868.avif", alt: "Description 1" },
    { src: "oekaki/1702.avif", alt: "Description 1" },
    { src: "oekaki/1990.avif", alt: "Description 1" },
    { src: "oekaki/2136.avif", alt: "Description 1" },
    { src: "oekaki/2184.avif", alt: "Description 1" },
    { src: "oekaki/2512.avif", alt: "Description 1" },
    { src: "oekaki/2601.avif", alt: "Description 1" },
  ];
  
  const oekaki_images_3 = [
    { src: "oekaki/3064.avif", alt: "Description 1" },
    { src: "oekaki/3938.avif", alt: "Description 1" },
    { src: "oekaki/4675.avif", alt: "Description 1" },
    { src: "oekaki/5185.avif", alt: "Description 1" },
    { src: "oekaki/5188.avif", alt: "Description 1" },
    { src: "oekaki/5275.avif", alt: "Description 1" },
    { src: "oekaki/5343.avif", alt: "Description 1" },
  ];

  const kagami_images = [
    { src: "kagami/252.png", alt: "Description 1" },
    { src: "kagami/1768.avif", alt: "Description 1" },
    { src: "kagami/2802.png", alt: "Description 1" },
  ];

  const pixel_lady_images = [
    { src: "pixel_lady/1870.png", alt: "Description 1" },
    { src: "pixel_lady/2246.png", alt: "Description 1" },
    { src: "pixel_lady/7908.png", alt: "Description 1" },
    { src: "pixel_lady/7914.png", alt: "Description 1" },
  ];

  const white_heart_images = [
    { src: "white_hearts/331.avif", alt: "Description 1" },
    { src: "white_hearts/355.avif", alt: "Description 1" },
    { src: "white_hearts/784.avif", alt: "Description 1" },
    { src: "white_hearts/785.avif", alt: "Description 1" },
    { src: "white_hearts/1081.avif", alt: "Description 1" },
    { src: "white_hearts/1349.avif", alt: "Description 1" },
    { src: "white_hearts/1786.avif", alt: "Description 1" },
    { src: "white_hearts/2285.avif", alt: "Description 1" },
    { src: "white_hearts/2309.avif", alt: "Description 1" },
    { src: "white_hearts/2445.avif", alt: "Description 1" },
    { src: "white_hearts/2448.avif", alt: "Description 1" },
    { src: "white_hearts/2450.avif", alt: "Description 1" },
  ];

  const cigarette_images = [
    { src: "cigarette/968.avif", alt: "Description 1" },
    { src: "cigarette/1093.avif", alt: "Description 1" },
    { src: "cigarette/1211.avif", alt: "Description 1" },
    { src: "cigarette/2230.avif", alt: "Description 1" },
    { src: "cigarette/2602.png", alt: "Description 1" },
    { src: "cigarette/2604.avif", alt: "Description 1" },
    { src: "cigarette/3015.avif", alt: "Description 1" },
    { src: "cigarette/3177.avif", alt: "Description 1" },
    { src: "cigarette/3774.avif", alt: "Description 1" },
    { src: "cigarette/4042.avif", alt: "Description 1" },
    { src: "cigarette/6182.avif", alt: "Description 1" },
    { src: "cigarette/7439.avif", alt: "Description 1" },
    { src: "cigarette/7546.avif", alt: "Description 1" },
    { src: "cigarette/7762.avif", alt: "Description 1" },
    { src: "cigarette/8123.avif", alt: "Description 1" },
    { src: "cigarette/8529.avif", alt: "Description 1" },
    { src: "cigarette/8794.avif", alt: "Description 1" },
    { src: "cigarette/8950.avif", alt: "Description 1" },
    { src: "cigarette/8951.avif", alt: "Description 1" },
    { src: "cigarette/9615.avif", alt: "Description 1" },
  ];

  const cigarette_images2 = [
    { src: "cigarette/7546.avif", alt: "Description 1" },
    { src: "cigarette/7762.avif", alt: "Description 1" },
    { src: "cigarette/8123.avif", alt: "Description 1" },
    { src: "cigarette/8529.avif", alt: "Description 1" },
    { src: "cigarette/8794.avif", alt: "Description 1" },
    { src: "cigarette/8950.avif", alt: "Description 1" },
    { src: "cigarette/8951.avif", alt: "Description 1" },
    { src: "cigarette/9615.avif", alt: "Description 1" },
  ];

  const schizo_poster = [
    { src: "schizo_poster/4611.avif", alt: "Description 1" },
    { src: "schizo_poster/3306.avif", alt: "Description 1" },
    { src: "schizo_poster/642.avif", alt: "Description 1" },
  ];

  const love_idols_images = [
    { src: "love_idols/1125.png", alt: "Description 1" },
    { src: "love_idols/1126.png", alt: "Description 1" },
    { src: "love_idols/1135.png", alt: "Description 1" },
    { src: "love_idols/1136.png", alt: "Description 1" },
    { src: "love_idols/1137.avif", alt: "Description 1" },
    { src: "love_idols/1152.png", alt: "Description 1" },
    { src: "love_idols/1153.png", alt: "Description 1" },
    { src: "love_idols/1154.png", alt: "Description 1" },
    { src: "love_idols/2411.avif", alt: "Description 1" },
    { src: "love_idols/2412.avif", alt: "Description 1" },
    { src: "love_idols/2413.avif", alt: "Description 1" },
    { src: "love_idols/2414.avif", alt: "Description 1" },
  ];

  const love_idols_images_2 = [
    { src: "love_idols/2415.avif", alt: "Description 1" },
    { src: "love_idols/2416.avif", alt: "Description 1" },
    { src: "love_idols/2417.avif", alt: "Description 1" },
    { src: "love_idols/1155.avif", alt: "Description 1" },
    { src: "love_idols/2477.avif", alt: "Description 1" },
    { src: "love_idols/2478.avif", alt: "Description 1" },
    { src: "love_idols/2479.avif", alt: "Description 1" },
    { src: "love_idols/2480.avif", alt: "Description 1" },
    { src: "love_idols/2481.avif", alt: "Description 1" },
    { src: "love_idols/2488.avif", alt: "Description 1" },
    { src: "love_idols/2489.avif", alt: "Description 1" },
    { src: "love_idols/2490.avif", alt: "Description 1" },
  ];

  const love_idols_images_3 = [
    { src: "love_idols/2491.avif", alt: "Description 1" },
    { src: "love_idols/2492.avif", alt: "Description 1" },
    { src: "love_idols/2493.avif", alt: "Description 1" },
  ];

  const radbros = [
    { src: "radbros/285.avif", alt: "Description 1" },
    { src: "radbros/1787.avif", alt: "Description 1" },
    { src: "radbros/1857.avif", alt: "Description 1" },
    { src: "radbros/2704.avif", alt: "Description 1" },
    { src: "radbros/3581.avif", alt: "Description 1" },
  ];

  const yumemono = [
    { src: "yumemono/yumemono 1269.avif", alt: "Description 1" },
  ];

  const banner = [
    { src: "banner/banner_1975.avif", alt: "Description 1" },
  ];

  const yayo = [
    { src: "yayo/yayo_2135.avif", alt: "Description 1" },
  ];

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "35px" }}>
      <div className="homepagetop">
        <Typography className={styles.container} variant="h2">
          $PROPHET
        </Typography>
        <Typography className="container" variant="h4">
          The Prophecy: A Milady inspired NFT derivative gambling #based ecosystem
        </Typography>

        <Box
          component={Link}
          href="/prophet"
          underline="none"
          sx={{ width: "100%" }} // Make Box take full width
        >
          <Button
            color="secondary"
            variant="contained"
            fullWidth // This makes the button fill the Box
            sx={{
              // Using sx prop instead of style for better Material UI integration
              mt: 3, // marginTop: 24px (theme spacing 3 = 24px)
              py: 1.5, // Add more padding to make button taller
            }}
          >
            <FlashingHeader></FlashingHeader>
          </Button>
        </Box>
      </div>

      <div className="container">
        <Grid container justifyContent="center" alignItems="center" spacing={6}>
          <Grid item>
            <Box component={Link} href="/litepaper" underline="none">
              <Button color="secondary" variant="contained" style={{ marginTop: 24, marginLeft: 15 }}>
                Litepaper
              </Button>
            </Box>
          </Grid>
          <Grid item>
            <Box
              component={Link}
              href="https://dexscreener.com/arbitrum/0x6bd1a20da7cb05394de87197ec8b02e67d249c03"
              underline="none"
            >
              <Button color="secondary" variant="contained" style={{ marginTop: 24, marginLeft: 15 }}>
                Dex Screener
              </Button>
            </Box>
          </Grid>
        </Grid>
      </div>

      <div className="container2">
        <Typography variant="h4" component="div" sx={{ mb: 2, fontSize: {xs: "1rem", md: "2rem"} }}>
          Mission Statement: World leading MMA bettors gamble on human cockfighting, spend prophets from bets on generating yield for token holders, sweeping Remilia assets / derivatives
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" sx={{ color: "#ee82ee", opacity: 100 }} />
            </ListItemIcon>
            <ListItemText primary="Total nfts swept: 112" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
            <CircleIcon fontSize="small" sx={{ color: "#ee82ee", opacity: 100 }} />
            </ListItemIcon>
            <ListItemText primary="Collections swept: 8" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
            <CircleIcon fontSize="small" sx={{ color: "#ee82ee", opacity: 100 }} />
            </ListItemIcon>
            <ListItemText primary="Total $ spent sweeping nfts: > $12,000" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
            <CircleIcon fontSize="small" sx={{ color: "#ee82ee", opacity: 100 }} />
            </ListItemIcon>
            <ListItemText primary="Total $ spent on buybacks: >$15,000" />
          </ListItem>
        </List>
      </div>

      <div className="container">
        <TexturedCube
          imagePaths={{
            right: "prophet_lady/0.avif",
            left: "prophet_lady/1.avif",
            top: "prophet_lady/2.avif",
            bottom: "prophet_lady/3.avif",
            front: "prophet_lady/4.avif",
            back: "prophet_lady/5.avif",
          }}
          width="95%"
          height="95%"
          rotation_x={0.03}
          rotation_y={0.01}
        />

        <TexturedCube
          imagePaths={{
            right: "prophet_lady/6.avif",
            left: "prophet_lady/7.avif",
            top: "prophet_lady/8.avif",
            bottom: "prophet_lady/9.avif",
            front: "prophet_lady/10.avif",
            back: "prophet_lady/11.avif",
          }}
          width="50%"
          height="50%"
          rotation_x={0.05}
          rotation_y={0.05}
        />

        <TexturedCube
          imagePaths={{
            right: "prophet_lady/12.avif",
            left: "prophet_lady/13.avif",
            top: "prophet_lady/14.avif",
            bottom: "prophet_lady/15.avif",
            front: "prophet_lady/16.avif",
            back: "prophet_lady/17.avif",
          }}
          width="150%"
          height="65%"
          rotation_x={0.01}
          rotation_y={0.03}
        />

        <TexturedCube
          imagePaths={{
            right: "prophet_lady/18.avif",
            left: "prophet_lady/19.avif",
            top: "prophet_lady/20.avif",
            bottom: "prophet_lady/21.avif",
            front: "prophet_lady/22.avif",
            back: "prophet_lady/23.avif",
          }}
          width="150%"
          height="150%"
          rotation_x={0.01}
          rotation_y={0.01}
        />
      </div>

      <div className="container">
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          {" "}
          {/* Customize the title here */}
          Contract Addresses
        </Typography>
        <Box
          id="asdf"
          className="container"
          sx={{
            display: "flex",
            flexDirection: "column",
            minWidth: "100%",
            maxWidth: "500px", // Set a max width; adjust as needed
            mx: "auto", // Center the box horizontally
            padding: "20px", // Add some padding around the content
          }}
        >
          <List>
            {addressesForAccordian.map(({ card_title, contract_address }) => (
              <Accordion
                key={card_title}
                sx={{
                  backgroundColor: "#ee82ee", // Or any color you want
                  "&.Mui-expanded": {
                    backgroundColor: "#ee82ee", // Keep same color when expanded
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${card_title}a-content`}
                  id={`panel${card_title}a-header`}
                >
                  <Typography>{card_title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    component={Link}
                    href={"https://arbiscan.io/address/" + contract_address}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                  >
                    <ListItem>
                      <ListItemText
                        primary={"0x" + contract_address.slice(0, 4) + "..." + contract_address.slice(-4)}
                        secondary="👉 Arbiscan Link"
                      />
                    </ListItem>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        </Box>
      </div>

     

      <div className="container2">
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          {" "}
          {/* Customize the title here */}
          $PROPHET stats:
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={styles.table}>Total rewards claimed:</TableCell>
                <TableCell className={styles.table}>{Number(claimEventsTotal).toLocaleString()} ETH</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Tokens in circulation:</TableCell>
                <TableCell className={styles.table}>{Number(tokensInCirculation)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}># of tokens burnt:</TableCell>
                <TableCell className={styles.table}>
                  {Number(totalSupplyState)} ({((Number(totalSupplyState) / 200000000000) * 100).toFixed(2)}%)
                </TableCell>{" "}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="container">
        <Typography className="container" variant="h4">
          The Sweep Vault
        </Typography>
        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px" }}>
          Prophet Lady operates as a Milady derivative and complies with the mandate to sweep Remco assets--including
          related ecosystem NFTs. Sweeped assets can be seen below.
        </Typography>

        <div className="container">
          <Accordion
            key={54312}
            sx={{
              backgroundColor: "#ee82ee", // Or any color you want
              "&.Mui-expanded": {
                backgroundColor: "#ee82ee", // Keep same color when expanded
              },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`54312`} id={`54312`}>
              <Typography>Sweep Vault Wallet</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                component={Link}
                href={"https://opensea.io/0x58D37267e48a3A4678e2a6e99e52b74a576c0240"}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
              >
                <ListItem>
                  <ListItemText
                    primary={
                      "0x" +
                      "0x58D37267e48a3A4678e2a6e99e52b74a576c0240".slice(0, 4) +
                      "..." +
                      "0x58D37267e48a3A4678e2a6e99e52b74a576c0240".slice(-4)
                    }
                    secondary="👉 Open Sea Link"
                  />
                </ListItem>
              </Box>
            </AccordionDetails>
          </Accordion>
        </div>

        <div className="container">
          <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "30px" }}>
            Token Holdings
          </Typography>
        </div>

        <div className="container">
          <Typography variant="h3" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
            153,438 CULT
          </Typography>
        </div>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          SchizoPoster
        </Typography>
        <ImageBar images={schizo_poster}></ImageBar>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          Pixelady Maker
        </Typography>
        <ImageBar images={pixel_lady_images}></ImageBar>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          Oekaki Maker
        </Typography>
        <ImageBar images={oekaki_images_1}></ImageBar>
        <Box sx={{ marginBottom: "16px", paddingTop: "15px" }}>
          <ImageBar images={oekaki_images_2}></ImageBar>
        </Box>
        <Box>
          <ImageBar images={oekaki_images_3}></ImageBar>
        </Box>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          White Hearts
        </Typography>
        <ImageBar images={white_heart_images}></ImageBar>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          Love Idols
        </Typography>
        <ImageBar images={love_idols_images}></ImageBar>
        <Box sx={{ marginBottom: "16px", paddingTop: "15px" }}>
          <ImageBar images={love_idols_images_2}></ImageBar>
        </Box>
        <Box>
          <ImageBar images={love_idols_images_3}></ImageBar>
        </Box>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          Cigawrette Packs
        </Typography>
        <ImageBar images={cigarette_images}></ImageBar>
        <Box sx={{ marginBottom: "16px", paddingTop: "15px" }}>
          <ImageBar images={cigarette_images2}></ImageBar>
        </Box>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          Kagami Academy
        </Typography>
        <ImageBar images={kagami_images}></ImageBar>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          Rad Bros
        </Typography>
        <ImageBar images={radbros}></ImageBar>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          Banner
        </Typography>
        <ImageBar images={banner}></ImageBar>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          Yayo
        </Typography>
        <ImageBar images={yayo}></ImageBar>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          Yumemono
        </Typography>
        <ImageBar images={yumemono}></ImageBar>
        
      </div>
    </div>
  );
};

export default Home;
