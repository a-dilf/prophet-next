// next and react imports
import React from 'react';
import type { NextPage } from 'next';
import styles from '../styles/HomePage.module.css';

import { Table, TableBody, TableCell, TableContainer, TableRow, Typography, Box, Grid, Link, Button, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { token_abi } from '../../abi_objects/token_abi';
import { ido_vault_abi } from '../../abi_objects/ido_abi';
import { toWei } from 'web3-utils';
import ImageBar from 'components/ImageBar';

import { usePublicClient } from 'wagmi';
import { parseAbi } from 'viem';

// rainbowkit+ imports
import {
  useAccount,
  useReadContract,
} from 'wagmi';

const addressesForAccordian = [
  { card_title: "token", contract_address: "0xb9E0b8385B63d94367043b248414C58a94A37932" },
  { card_title: "nft", contract_address: "0xC21Bd794cC47443692A485cC4B6B1200becCF89d" },
  { card_title: "vault", contract_address: "0xAcaFE370403d7172539d96Df62979221116313eB" },
  { card_title: "liquidity pool", contract_address: "0x6bD1A20Da7Cb05394dE87197EC8b02E67D249C03" },
  { card_title: "token staking", contract_address: "0x37EA4C3fd77DBf4e796f86fC75bCde83567c846e" },
  { card_title: "nft staking", contract_address: "0x63B2d27F4B1cCFacE4CE048856647C38a35beac0" },
  { card_title: "lp staking", contract_address: "0x6e5451ac32FA376FE8BEFEa0f37Fc665f4020677" },
]

const Home: NextPage = () => {
  const [mounted, setMounted] = React.useState(false);
  const [totalSupplyState, settotalSupply] = React.useState(0n);
  const [taxRewardsState, setTaxRewardsState] = React.useState(0);
  const [tokensInCirculation, setTokensInCirculation] = React.useState(0n);

  const [claimEventsTotal, setClaimEventsTotal] = React.useState(0);
  const publicClient = usePublicClient();
  console.log("pub type", typeof(publicClient))

  const fetchClaimEvents = React.useCallback(async () => {
    if (!publicClient) return; // Early return if publicClient is undefined

    try {
      const logs = await publicClient.getLogs({
        address: '0x37EA4C3fd77DBf4e796f86fC75bCde83567c846e', // token staking address
        event: parseAbi(['event Claim(address indexed _account, uint256 tokenAmount)'])[0],
        fromBlock: 0n,
        toBlock: 'latest'
      });

      // Sum all claim amounts
      const total = logs.reduce(
        (sum, log) => sum + (log.args.tokenAmount as bigint),
        0n
      );
      
      await console.log("claims check ", total)

      // Convert from wei to eth and set state
      setClaimEventsTotal(Number(total) / 1e18);
    } catch (err) {
      console.error('Error fetching claim events:', err);
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
    address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as '0x${string}',
    abi: token_abi,
    functionName: "totalSupply"
  } as const;

  const tokensRemainingInValtContractConfig = {
    address: process.env.NEXT_PUBLIC_IDO_ADDRESS as '0x${string}',
    abi: ido_vault_abi,
    functionName: 'totalSold',
  } as const;

  const rewardsAmountContractConfig = {
    address: process.env.NEXT_PUBLIC_IDO_ADDRESS as '0x${string}',
    abi: ido_vault_abi,
    functionName: 'taxFromParticipation',
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
      const tokensBurned = 200000000000000000000000000000 - Number(totalSupply)
      settotalSupply(BigInt(Math.floor(tokensBurned / 1000000000000000000)));
    }
  }, [totalSupply]);

  React.useEffect(() => {
    if (taxRewardsAmount) {
      const taxRewardsAmountInEth = toWei(taxRewardsAmount, "wei")
      setTaxRewardsState(Number(taxRewardsAmountInEth) / 1000000000000000000);
      // setTaxRewardsState(BigInt(Number(taxRewardsAmount) / 1000000000000000000));
      // setTaxRewardsState("1000000000000000000" + taxRewardsAmount.toString());
    }
  }, [taxRewardsAmount]);

  React.useEffect(() => {
    if (vaultTokensLeft) {
      let convertedVaultTokens = Number(BigInt(Math.floor(Number(vaultTokensLeft) / 1000000000000000000)))

      const startDate = new Date('2024-08-16T22:22:20Z'); // 'Z' indicates UTC
      const currentDate = new Date();
      const differenceInTime = currentDate.getTime() - startDate.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24)); // Convert milliseconds to days
      const pool_one_tokens = differenceInDays * 15000000

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

  const oekaki_images_1 = [
    { src: 'oekaki/407.avif', alt: 'Description 1' },
    { src: 'oekaki/1366.avif', alt: 'Description 1' },
    { src: 'oekaki/2122.avif', alt: 'Description 1' },
    { src: 'oekaki/3146.avif', alt: 'Description 1' },
    { src: 'oekaki/3376.avif', alt: 'Description 1' },
    { src: 'oekaki/3500.avif', alt: 'Description 1' },
    { src: 'oekaki/3510.avif', alt: 'Description 1' },
    { src: 'oekaki/3513.avif', alt: 'Description 1' },
    { src: 'oekaki/3522.avif', alt: 'Description 1' },
    { src: 'oekaki/3734.avif', alt: 'Description 1' },
    { src: 'oekaki/3941.avif', alt: 'Description 1' },
    { src: 'oekaki/4126.avif', alt: 'Description 1' },
    { src: 'oekaki/4598.avif', alt: 'Description 1' },
    { src: 'oekaki/4782.avif', alt: 'Description 1' },
    { src: 'oekaki/5167.avif', alt: 'Description 1' },
  ];

  const oekaki_images_2 = [
    { src: 'oekaki/2122.avif', alt: 'Description 1' },
    { src: 'oekaki/4126.avif', alt: 'Description 1' },
    { src: 'oekaki/4782.avif', alt: 'Description 1' },
  ];

  const kagami_images = [
    { src: 'kagami/252.png', alt: 'Description 1' },
    { src: 'kagami/1768.avif', alt: 'Description 1' },
    { src: 'kagami/2802.png', alt: 'Description 1' },
  ];

  const white_heart_images = [
    { src: 'white_hearts/331.avif', alt: 'Description 1' },
    { src: 'white_hearts/355.avif', alt: 'Description 1' },
    { src: 'white_hearts/784.avif', alt: 'Description 1' },
    { src: 'white_hearts/785.avif', alt: 'Description 1' },
    { src: 'white_hearts/1081.avif', alt: 'Description 1' },
    { src: 'white_hearts/1349.avif', alt: 'Description 1' },
    { src: 'white_hearts/1786.avif', alt: 'Description 1' },
    { src: 'white_hearts/2285.avif', alt: 'Description 1' },
    { src: 'white_hearts/2309.avif', alt: 'Description 1' },
    { src: 'white_hearts/2445.avif', alt: 'Description 1' },
    { src: 'white_hearts/2448.avif', alt: 'Description 1' },
    { src: 'white_hearts/2450.avif', alt: 'Description 1' },
  ];

  const cigarette_images = [
    { src: 'cigarette/1211.avif', alt: 'Description 1' },
    { src: 'cigarette/2602.png', alt: 'Description 1' },
    { src: 'cigarette/2604.avif', alt: 'Description 1' },
    { src: 'cigarette/3177.avif', alt: 'Description 1' },
    { src: 'cigarette/3774.avif', alt: 'Description 1' },
    { src: 'cigarette/7439.avif', alt: 'Description 1' },
    { src: 'cigarette/7546.avif', alt: 'Description 1' },
    { src: 'cigarette/8950.avif', alt: 'Description 1' },
    { src: 'cigarette/8951.avif', alt: 'Description 1' },
  ];

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '35px' }}>
      <div className="homepagetop">
        <Typography className={styles.container} variant="h2">$PROPHET</Typography>
        <Typography className="container" variant="h4">The Prophecy: A Milady inspired NFT derivative gambling #based ecosystem</Typography>

        <div className="container">
          <Grid container justifyContent="center" alignItems="center" spacing={6}>
            <Grid item>
              <Box component={Link} href="/prophet" underline="none">
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ marginTop: 24, marginLeft: 15 }}
                >
                  Enter App
                </Button>
              </Box>
            </Grid>
            <Grid item>
              <Box component={Link} href="/litepaper" underline="none">
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ marginTop: 24, marginLeft: 15 }}
                >
                  Litepaper
                </Button>
              </Box>
            </Grid>
            <Grid item>
              <Box component={Link} href="https://dexscreener.com/arbitrum/0x6bd1a20da7cb05394de87197ec8b02e67d249c03" underline="none">
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ marginTop: 24, marginLeft: 15 }}
                >
                  Dex Screener
                </Button>
              </Box>
            </Grid>
          </Grid>
        </div>
      </div>

      <div className="container">
        <Typography variant="h6" component="div" sx={{ mb: 2 }}> {/* Customize the title here */}
          Contract Addresses
        </Typography>
        <Box id="asdf" className="container" sx={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: '100%',
          maxWidth: '500px', // Set a max width; adjust as needed
          mx: 'auto', // Center the box horizontally
          padding: '20px', // Add some padding around the content
        }}>
          <List>
            {addressesForAccordian.map(({ card_title, contract_address }) => (
              <Accordion key={card_title}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${card_title}a-content`}
                  id={`panel${card_title}a-header`}
                >
                  <Typography>{card_title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box component={Link} href={"https://arbiscan.io/address/" + contract_address} target="_blank" rel="noopener noreferrer" underline="none">
                    <ListItem >
                      <ListItemText primary={"0x" + contract_address.slice(0, 4) + "..." + contract_address.slice(-4)} secondary="👉 Arbiscan Link" />
                    </ListItem>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        </Box>
      </div>

      <div className="container">
        <Typography variant="h6" component="div" sx={{ mb: 2 }}> {/* Customize the title here */}
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
                <TableCell className={styles.table}>{Number(totalSupplyState)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="container">
        <Typography className="container" variant="h4">The Thesis</Typography>
        <Typography sx={{ paddingTop: "15px" }}>Empower the Milady ecosystem through betting on modern age gladatorial cock fights.</Typography>

        <Box sx={{ width: '100%', height: 'auto', paddingTop: "15px", paddingBottom: "15px" }}>
          <img
            src="profitsheetlarge.png"
            alt="A chart displaying profit"
            style={{ width: '100%', height: 'auto' }} // Inline styling
          />
        </Box>

        <Typography> ProphetLady represents the vision of a  Milady inspired derivative from elite gambling autists specializing in MMA betting.
          Check out the <a href="https://www.betmma.tips/Headmooment">team's success tracker here.</a></Typography>
        <br></br>
        <Typography>Since inception of the bet tracker in November 2020, it has generated nearly 600
          units in total. Averaging roughly 200% returns in about 3 years--compounding per year.</Typography>
      </div>

      <div className="container">
        <Typography className="container" variant="h4">The Sweep Vault</Typography>
        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px" }}>Prophet Lady operates as a Milady derivative and complies with the mandate to sweep Remco assets--including related ecosystem NFTs. Sweeped assets can be seen below.</Typography>

        <div className="container">
          <Accordion key={54312}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`54312`}
              id={`54312`}
            >
              <Typography>Sweep Vault Wallet</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box component={Link} href={"https://opensea.io/0x58D37267e48a3A4678e2a6e99e52b74a576c0240"} target="_blank" rel="noopener noreferrer" underline="none">
                <ListItem >
                  <ListItemText primary={"0x" + "0x58D37267e48a3A4678e2a6e99e52b74a576c0240".slice(0, 4) + "..." + "0x58D37267e48a3A4678e2a6e99e52b74a576c0240".slice(-4)} secondary="👉 Open Sea Link" />
                </ListItem>
              </Box>
            </AccordionDetails>
          </Accordion>
        </div>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          Oekaki Maker
        </Typography>
        <ImageBar images={oekaki_images_1}></ImageBar>
        <Box sx={{ marginBottom: '16px', paddingTop: '15px' }}>
          <ImageBar images={oekaki_images_2}></ImageBar>
        </Box>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          White Hearts
        </Typography>
        <ImageBar images={white_heart_images}></ImageBar>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          Cigarettes
        </Typography>
        <ImageBar images={cigarette_images}></ImageBar>

        <Typography variant="h5" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          Kagmi
        </Typography>
        <ImageBar images={kagami_images}></ImageBar>
      </div>

      <div className="container">
        <Typography className="container" variant="h4">How the ecosystem works</Typography>
        <Typography sx={{ paddingTop: "15px" }}>Users stake $PROPHET tokens to claim a taxed share of trade volume via a reflection
          system. Building upon this simple and popular framework, ProphetLady adds a unique twist: users can burn a set amount of their
          $PROPHET tokens to mint a Milady derivative (the ProphetLady collection) that reduces the tax paid on sells. A ProphetLady can then
          be increased in tier by burning additional $PROPHET tokens for decreased tax rates and access to the NFT staking rewards pool.</Typography>

        <Typography variant="h6" component="div" sx={{ mb: 2, paddingTop: "15px" }}> {/* Customize the title here */}
          Tax % by NFT tier level:
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={styles.table}>No NFT</TableCell>
                <TableCell className={styles.table}>13%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Tier 1</TableCell>
                <TableCell className={styles.table}>11%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Tier 2</TableCell>
                <TableCell className={styles.table}>9%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Tier 3</TableCell>
                <TableCell className={styles.table}>7%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Tier 4</TableCell>
                <TableCell className={styles.table}>5%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Tier 5</TableCell>
                <TableCell className={styles.table}>3%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px" }}>Burn costs for minting and upgrading each tier of ProphetLady will be fixed at 400k $PROPHET tokens required to reach the next level.</Typography>
        <Typography variant="h6" component="div" sx={{ mb: 2, paddingTop: "15px" }}> {/* Customize the title here */}
          Cumulative costs for each tier:
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={styles.table}>Level 1</TableCell>
                <TableCell className={styles.table}>400,000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Level 2</TableCell>
                <TableCell className={styles.table}>800,000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Level 3</TableCell>
                <TableCell className={styles.table}>1,200,000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Level 4</TableCell>
                <TableCell className={styles.table}>1,600,000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Level 5</TableCell>
                <TableCell className={styles.table}>2,000,000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="container">
        <Typography className="container" variant="h4">Tokenomics</Typography>
        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px", fontWeight: 'bold' }}>Total tokens in existence = 200,000,000,000</Typography>

        <Typography>120,000,000,000 (60%) $PROPHET will be distributed via 6 stages of IDO</Typography>
        <Typography variant="h6" component="div" sx={{ mb: 2, paddingTop: "15px" }}> {/* Customize the title here */}
          IDO distribution rates
        </Typography>

        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={styles.table}>20,000,000,000</TableCell>
                <TableCell className={styles.table}>at .000000003125 ETH</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>20,000,000,000</TableCell>
                <TableCell className={styles.table}>at .000000006250 ETH</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>20,000,000,000</TableCell>
                <TableCell className={styles.table}>at .000000012500 ETH</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>20,000,000,000</TableCell>
                <TableCell className={styles.table}>at .000000025000 ETH</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>20,000,000,000</TableCell>
                <TableCell className={styles.table}>at .000000050000 ETH</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>20,000,000,000</TableCell>
                <TableCell className={styles.table}>at .000000100000 ETH</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ width: '100%', height: 'auto', paddingTop: "15px", paddingBottom: "15px" }}>
          <img
            src="piechart.png"
            alt="A chart showing tokenomics"
            style={{ width: '100%', height: 'auto' }} // Inline styling
          />
        </Box>
      </div>

      <div className="container">
        <Typography className="container" variant="h4">DISCLAIMER</Typography>
        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px", fontWeight: 'bold' }}>Statistics being indicative:</Typography>
        <Typography>All Stats listed on this site are for guidance purposes only. Listed statistics are not guarenteed to be accurate.   Apy generated for users changes constantly and is purely determined by volume created by other users not Prophetlady.  Users acknowledge this and also acknowledge the risk of negative returns on deposited funds into IDO vaults at any and all time periods. By depositing into IDO vaults, the user assumes risk of losses.</Typography>
        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px", fontWeight: 'bold' }}>Prior returns:</Typography>
        <Typography>Any and all prior prophet from betting is to not be viewed as indicative of any future returns or prophet.</Typography>
        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px", fontWeight: 'bold' }}>Risk of loss of funds when interacting with Prophetlady:</Typography>
        <Typography>Prophetlady ecosystem is a smart contracts based suite of technologies that relies on blockchain technology. By depositing funds into Prophetlady IDO and staking vaults the user will recognize and assume all risks inherent in such technologies, including but not limited to the risk that the smart contracts underlying previously mentioned vaults could fail, resulting in a total loss of user funds. Prophetlady is not responsible for any such losses.</Typography>
        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px", fontWeight: 'bold' }}>UI usage and legal jurisdictions:</Typography>
        <Typography>Our Interface is NOT offered to persons or entities who reside in, are citizens of, are incorporated in, or have a registered office in the United States of America or any Prohibited Localities. Prophetlady is a decentralized meme experimental project and does not hold any securities licenses in the U.S. or any other jurisdiction. Any investment made through our protocol shall be made with this in mind. Furthermore, by accepting these terms you acknowledge and warrant that you are not a citizen of or otherwise accessing the website from the following nations or geographical locations: Democratic Republic of Congo, Cote D'Ivoire (Ivory Coast), China, Cuba, Hong Kong, India, Iraq, Iran, Democratic People's Republic of Korea (North Korea), Libya, Mali, Myanmar (Burma), Nicaragua, Sudan, Somalia, Syria, Yemen, Zimbabwe, and/or any other jurisdiction prohibited by the United States Office of Foreign Asset Control (OFAC).</Typography>
      </div>

    </div>
  );
};

export default Home;