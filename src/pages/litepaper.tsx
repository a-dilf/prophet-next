// next and react imports
import type { NextPage } from "next";
import React from "react";
import styles from "../styles/Litepaper.module.css";

import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

import CircleIcon from "@mui/icons-material/Circle";

const Litepaper: NextPage = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px" }}>
      <div className="homepagetop">
        <Typography className={styles.container} variant="h2">
          Litepaper
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "15px", paddingBottom: "15px" }}>
          $PROPHET is a Milady inspired unique project / NFT derivative created on Arbitrum that operates on a simple
          idea: what if a small team of world class mma gamblers created an ecosystem based off distributing prophets
          from bets back to token holders and to sweeping collections (will never sell) from the Milady community?
        </Typography>
      </div>

      <div className="container">
        <Typography className="container" variant="h4">
          The Thesis
        </Typography>
        <Typography sx={{ paddingTop: "15px" }}>
          Elite mma betting syndicate known as "The Prophetlady Corporation" generating yield via betting on modern age
          gladatorial cock fights.
        </Typography>

        <Box sx={{ width: "100%", height: "auto", paddingTop: "15px", paddingBottom: "15px" }}>
          <img
            src="profitsheetlarge.png"
            alt="A chart displaying profit"
            style={{ width: "100%", height: "auto" }} // Inline styling
          />
        </Box>

        <Typography>
          {" "}
          ProphetLady represents the vision of a Milady inspired derivative created by elite gambling autists
          specializing in MMA betting. Check out the{" "}
          <a href="https://www.betmma.tips/Headmooment">team's tracker here (ranked 5th on the leaderboard)</a>
        </Typography>
        <br></br>
        <Typography>
          Since inception of the bet tracker in November 2020, it has generated nearly 700 units in total. Averaging
          roughly 160% average returns per year over 4 years
        </Typography>
      </div>

      <div className="container" style={{ marginTop: "15px" }}>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          {" "}
          {/* Customize the title here */}
          Muh infographs of performance 2024
        </Typography>

        <Box sx={{ width: "100%", height: "auto", paddingTop: "15px", paddingBottom: "15px" }}>
          <img
            src="cumulative profits monthly.png"
            alt="cum profits"
            style={{ width: "100%", height: "auto" }} // Inline styling
          />
        </Box>

        <Box sx={{ width: "100%", height: "auto", paddingTop: "15px", paddingBottom: "15px" }}>
          <img
            src="monthly performance.png"
            alt="monthly profits"
            style={{ width: "100%", height: "auto" }} // Inline styling
          />
        </Box>

        <Box sx={{ width: "100%", height: "auto", paddingTop: "15px", paddingBottom: "15px" }}>
          <img
            src="monthly wins vs losses.png"
            alt="monthly wins vs losses"
            style={{ width: "100%", height: "auto" }} // Inline styling
          />
        </Box>
      </div>

      <div className="container">
        <Typography className="container" variant="h4">
          How the ecosystem works
        </Typography>
        <Typography sx={{ paddingTop: "15px" }}>
          Users who wish to partake can deposit worthless ETH to buy tokens from our IDO here. As users deposit eth into
          what is the "treasury", this grows the size of what amounts of $ will be bet. Larger treasury = larger bet
          sizes = larger prophets (hopefully) = larger NFT Sweeps/larger token buybacks/ token burns. To create a more
          crypto fun style ecosystem, several additional fun elements have been created, such as:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" sx={{ color: "#ee82ee", opacity: 100 }} />
            </ListItemIcon>
            <ListItemText primary="Designing this as a tax token, so token stakers are rewarded from total volume traded" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" sx={{ color: "#ee82ee", opacity: 100 }} />
            </ListItemIcon>
            <ListItemText primary="Introducing an NFT that can be bought to reduce tax rates, minted by burning the Prophet token" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" sx={{ color: "#ee82ee", opacity: 100 }} />
            </ListItemIcon>
            <ListItemText primary="The NFT can be 'powered up' to further reduce taxes paid on buys or sells, also done by burning more tokens" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" sx={{ color: "#ee82ee", opacity: 100 }} />
            </ListItemIcon>
            <ListItemText primary="Users can provide liquidity or stake highest 'tier' of NFT to earn prophet tokens, or stake tokens to earn yield paid in ETH" />
          </ListItem>
        </List>

        <Typography className="container" variant="h5">
          To make clear what you, the noble cryptocurrency participant, can do once buying into the IDO, have 1 of 3
          options:
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" sx={{ color: "#ee82ee", opacity: 100 }} />
            </ListItemIcon>
            <ListItemText
              primary="Provide liquidity, by depositing an eth/prophet pair token into the liquidity pool users will earn a proportional stake
            of 7.5 million tokens to be emitted daily for 5 years"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" sx={{ color: "#ee82ee", opacity: 100 }} />
            </ListItemIcon>
            <ListItemText primary="Stake the token, in order to earn eth collected from taxes havested from buying and selling the token on the open market" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CircleIcon fontSize="small" sx={{ color: "#ee82ee", opacity: 100 }} />
            </ListItemIcon>
            <ListItemText primary="Mint NFTs, which are created from burning the Prophet token" />
          </ListItem>
        </List>

        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          {" "}
          {/* Customize the title here */}
          Muh chart in totality to illustrate the method to the madness.
        </Typography>
        <Box sx={{ width: "100%", height: "auto", paddingTop: "15px", paddingBottom: "15px" }}>
          <img
            src="infograph.png"
            alt="a chart describing the structure of the coin"
            style={{ width: "100%", height: "auto" }} // Inline styling
          />
        </Box>

        <Typography variant="h4" sx={{ paddingTop: "15px", paddingBottom: "15px" }}>
          NFT explaination charts...
        </Typography>

        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px" }}>
          Burn costs for minting and upgrading each tier of the Prophetlady ecosystem NFT will be fixed at 400k $PROPHET
          tokens required to reach the next level.
        </Typography>
        <Typography variant="h6" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          {" "}
          {/* Customize the title here */}
          Cumulative costs for each tier and corresponding tax rate:
        </Typography>

        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={styles.table}>Tier category</TableCell>
                <TableCell className={styles.table}># of tokens to burn</TableCell>
                <TableCell className={styles.table}>tax rate</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>No NFT</TableCell>
                <TableCell className={styles.table}>0</TableCell>
                <TableCell className={styles.table}>13%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Tier 1</TableCell>
                <TableCell className={styles.table}>400,000</TableCell>
                <TableCell className={styles.table}>11%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Tier 2</TableCell>
                <TableCell className={styles.table}>800,000</TableCell>
                <TableCell className={styles.table}>9%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Tier 3</TableCell>
                <TableCell className={styles.table}>1,200,000</TableCell>
                <TableCell className={styles.table}>7%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Tier 4</TableCell>
                <TableCell className={styles.table}>1,600,000</TableCell>
                <TableCell className={styles.table}>5%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Tier 5</TableCell>
                <TableCell className={styles.table}>2,000,000</TableCell>
                <TableCell className={styles.table}>3%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Typography variant="h6" component="div" sx={{ mb: 2 }}>
        {" "}
        {/* Customize the title here */}A detailed look into the mechanics of the NFTs and the tax rates...
      </Typography>
      <Box sx={{ width: "100%", height: "auto", paddingTop: "15px", paddingBottom: "15px" }}>
        <img
          src="nftinfograph.png"
          alt="nft structure"
          style={{ width: "100%", height: "auto" }} // Inline styling
        />
      </Box>

      <div className="container">
        <Typography className="container" variant="h4">
          Tokenomics
        </Typography>
        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px", fontWeight: "bold" }}>
          Total tokens in existence = 200,000,000,000
        </Typography>

        <Typography>
          120,000,000,000 (60% of total token supply) $PROPHET will be distributed via 6 stages of IDO, with the price
          of the token doubling at each 'stage'
        </Typography>
        <Typography variant="h6" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          {" "}
          {/* Customize the title here */}
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

        <Box sx={{ width: "100%", height: "auto", paddingTop: "15px", paddingBottom: "15px" }}>
          <img
            src="piechart.png"
            alt="A chart showing tokenomics"
            style={{ width: "100%", height: "auto" }} // Inline styling
          />
        </Box>
      </div>

      <Typography variant="h6" component="div" sx={{ mb: 2 }}>
        {" "}
        {/* Customize the title here */}A table infographic of ido sales structure with round, price, and total raise
        amount in eth per stage. TLDR; 20 billion tokens are availible to be bought per stage, the token price doubles
        in each progressive stage
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className={styles.table}>Stage 1</TableCell>
              <TableCell className={styles.table}>.000000003125 Eth</TableCell>
              <TableCell className={styles.table}>62.5 Eth</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.table}>Stage 2</TableCell>
              <TableCell className={styles.table}>.00000000625 Eth</TableCell>
              <TableCell className={styles.table}>125 Eth</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.table}>Stage 3</TableCell>
              <TableCell className={styles.table}>.0000000125 Eth</TableCell>
              <TableCell className={styles.table}>250 Eth</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.table}>Stage 4</TableCell>
              <TableCell className={styles.table}>.000000025 Eth</TableCell>
              <TableCell className={styles.table}>500 Eth</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.table}>Stage 5</TableCell>
              <TableCell className={styles.table}>.00000005 Eth</TableCell>
              <TableCell className={styles.table}>1000 Eth</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={styles.table}>Stage 6</TableCell>
              <TableCell className={styles.table}>.0000001 Eth</TableCell>
              <TableCell className={styles.table}>2000 Eth</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <div className="homepagetop">
        <Typography className={styles.container} variant="h2">
          WATCH OUT!!!
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "15px", paddingBottom: "15px" }}>
          In order to benefit from the NFT tier tax cut, at least one of the leveled up NFT's must be unstaked! Don't
          CUCK yourself and swap without an unstaked level 5 NFT in your wallet.
        </Typography>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          {" "}
          {/* Customize the title here */}
          Additionally, there is one last piece in this puzzle, there is an "anti jeet" / arbitrage tax of an additional
          10% to any ido buyer who then buys or sells from the LP within the same round. Example, user buys in ido rd 1
          with a tier 5 nft, until the 1st rd ido is entirely bought out, the tax rate interacting with the LP will be
          13% instead of 3%. Once ido rd 2 starts, the tax rate will revert back to 3%.
        </Typography>
      </div>

      <div className="container">
        <Typography variant="h6" sx={{ paddingTop: "15px", paddingBottom: "15px" }}>
          Musings...
        </Typography>

        <Typography>
          The name of the game here is large numbers/ scaling. Assume that the team can deliver 100% roi a year and has
          3 of the IDO stages fully funded. As of this writing that would equate to roughly $750,000. At 2% a week
          returns, half of the proceeds would be dedicated to sweeping NFTS ($7500 a week) while also being able to
          buyback and burn approximately 333 million tokens a week. If this were to hold consistant throughout a year
          that would mean... approximately 17 billion tokens a year get removed from total possible market supply. Now
          consider the firepower this protocol has at a max raise (approximately $7,000,000). At this level, assuming 2%
          weekly returns means close to 400 million tokens get bought/burnt a week and $70,000 a week in NFT sweeps. It
          is the stated goal of this project to sweep roughly 2-10% of 15-20 Nft projects that are in the Remilia
          universe or are widely considered to be a derivate. To further go on, if after a couple years the Prophetlady
          Corporation has swept say 5-10% of the total collections we are interested in, then the entire amount of
          prophets would go to buybacks/burns (roughly 800 million tokens a week/ 40 billion a year). Lastly, consider
          if all NFTs in the prophetlady collections were to be minted and upgraded (50,000 total x 2 million to max
          upgrade) this would take out half of the total token supple. If one were to add these too possibliities
          together that means that hypthetically the entire 200 billion token supply could be completely burned within 5
          years of completeing multiple IDO rounds.
        </Typography>
      </div>

      <div className="container">
        <Typography className="container" variant="h4">
          DISCLAIMER
        </Typography>
        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px", fontWeight: "bold" }}>
          Statistics being indicative:
        </Typography>
        <Typography>
          All Stats listed on this site are for guidance purposes only. Listed statistics are not guarenteed to be
          accurate. Apy generated for users changes constantly and is purely determined by volume created by other users
          not Prophetlady. Users acknowledge this and also acknowledge the risk of negative returns on deposited funds
          into IDO vaults at any and all time periods. By depositing into IDO vaults, the user assumes risk of losses.
        </Typography>
        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px", fontWeight: "bold" }}>Prior returns:</Typography>
        <Typography>
          Any and all prior prophet from betting is to not be viewed as indicative of any future returns or prophet.
        </Typography>
        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px", fontWeight: "bold" }}>
          Risk of loss of funds when interacting with Prophetlady:
        </Typography>
        <Typography>
          Prophetlady ecosystem is a smart contracts based suite of technologies that relies on blockchain technology.
          By depositing funds into Prophetlady IDO and staking vaults the user will recognize and assume all risks
          inherent in such technologies, including but not limited to the risk that the smart contracts underlying
          previously mentioned vaults could fail, resulting in a total loss of user funds. Prophetlady is not
          responsible for any such losses.
        </Typography>
        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px", fontWeight: "bold" }}>
          UI usage and legal jurisdictions:
        </Typography>
        <Typography>
          Our Interface is NOT offered to persons or entities who reside in, are citizens of, are incorporated in, or
          have a registered office in the United States of America or any Prohibited Localities. Prophetlady is a
          decentralized meme experimental project and does not hold any securities licenses in the U.S. or any other
          jurisdiction. Any investment made through our protocol shall be made with this in mind. Furthermore, by
          accepting these terms you acknowledge and warrant that you are not a citizen of or otherwise accessing the
          website from the following nations or geographical locations: Democratic Republic of Congo, Cote D'Ivoire
          (Ivory Coast), China, Cuba, Hong Kong, India, Iraq, Iran, Democratic People's Republic of Korea (North Korea),
          Libya, Mali, Myanmar (Burma), Nicaragua, Sudan, Somalia, Syria, Yemen, Zimbabwe, and/or any other jurisdiction
          prohibited by the United States Office of Foreign Asset Control (OFAC).
        </Typography>
      </div>
    </div>
  );
};

export default Litepaper;

