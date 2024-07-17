// next and react imports
import React from 'react';
import type { NextPage } from 'next';

import { Table, TableBody, TableCell, TableContainer, TableRow, Typography, Box, Grid, Link, Button, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { token_abi } from '../../abi_objects/token_abi';
import { ido_vault_abi } from '../../abi_objects/ido_abi';
import { toWei } from 'web3-utils';

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
  const [burnedTokenBalanceState, setBurnedTokenBalance] = React.useState(0n);
  const [taxRewardsState, setTaxRewardsState] = React.useState(0);
  const [tokensInCirculation, setTokensInCirculation] = React.useState(0n);

  const { address } = useAccount();

  const burnBalanceOfContractConfig = {
    address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as '0x${string}',
    abi: token_abi,
    args: ["0x0000000000000000000000000000000000000000"],
    functionName: "balanceOf"
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

  const { data: burnedTokenBalance } = useReadContract({
    ...burnBalanceOfContractConfig,
  });

  const { data: vaultTokensLeft } = useReadContract({
    ...tokensRemainingInValtContractConfig,
  });

  const { data: taxRewardsAmount } = useReadContract({
    ...rewardsAmountContractConfig,
  });

  React.useEffect(() => {
    if (burnedTokenBalance) {
      setBurnedTokenBalance(BigInt(Math.floor(Number(burnedTokenBalance) / 1000000000000000000)));
    }
  }, [burnedTokenBalance]);

  React.useEffect(() => {
    if (taxRewardsAmount) {
      const taxRewardsAmountInEth = toWei(taxRewardsAmount, "ether")
      setTaxRewardsState(25 / 1000000000000000000);
      // setTaxRewardsState(BigInt(Number(taxRewardsAmount) / 1000000000000000000));
      // setTaxRewardsState("1000000000000000000" + taxRewardsAmount.toString());
    }
  }, [taxRewardsAmount]);

  React.useEffect(() => {
    if (vaultTokensLeft) {
      let convertedVaultTokens = Number(BigInt(Math.floor(Number(vaultTokensLeft) / 1000000000000000000)))
      
      const startDate = new Date('2024-06-08T00:37:12Z'); // 'Z' indicates UTC
      const currentDate = new Date();
      const differenceInTime = currentDate.getTime() - startDate.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24)); // Convert milliseconds to days
      const pool_one_tokens =  differenceInDays * 15000000
      
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

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '35px' }}>
<<<<<<< Updated upstream
      <Typography className="container" variant="h2">$PROPHET</Typography>
=======
      <div className="homepagetop">
      <Typography className={styles.container} variant="h2">$PROPHET</Typography>
>>>>>>> Stashed changes
      <Typography className="container" variant="h4">The Prophecy: A Milady inspired NFT derivative gambling #based ecosystem</Typography>

      <div className="container">
        <Grid container justifyContent="center" alignItems="center" spacing={6}>
          <Grid item>
            <Box component={Link} href="/prophet" underline="none">
              <Button className={styles.button}
                style={{ marginTop: 24, marginLeft: 15 }}
              >
                Enter App
              </Button>
            </Box>
          </Grid>
          <Grid item>
            <Box component={Link} href="/litepaper" underline="none">
              <Button className={styles.button}
                style={{ marginTop: 24, marginLeft: 15 }}
              >
                Litepaper
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
                <TableCell className={styles.table} >Total rewards distributed:</TableCell>
                <TableCell className={styles.table}>{Number(taxRewardsState)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Tokens in circulation:</TableCell>
                <TableCell className={styles.table} >{Number(tokensInCirculation)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}># of tokens burnt:</TableCell>
                <TableCell className={styles.table}>{Number(burnedTokenBalanceState)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Apr</TableCell>
                <TableCell className={styles.table}>X</TableCell>
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
        <Typography className="container" variant="h4">How the ecosystem works</Typography>
        <Typography sx={{ paddingTop: "15px" }}>Users stake $PROPHET tokens to claim a taxed share of trade voulume via a reflection
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
