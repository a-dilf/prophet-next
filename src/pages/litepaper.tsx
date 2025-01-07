// next and react imports
import type { NextPage } from "next";
import React from "react";
import styles from "../styles/Litepaper.module.css";

import {
  Box,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

const items = [
  "Emperically speaking, 200% per year for the last 3 years is what the team has accomplished, however, given the law of large numbers, should the treasury go beyond 7 figures, this will likely prove too difficult to achieve, so with this a general target of success the team hopes for is roughly 50-100% a year......",
  "Assume full raise occurs = $15,000,000",
  "75% roi divided weekly = 1.5%",
  "1.5% of 15,000,000 = $225,000",
  '.75% (or half... $112,500) goes to "community building", the other.75% ($112,500) goes to building the treasury further',
  "Assume full raise: 15,000,000 ",
  "Year zero: treasury at 15 million: 5.6 mil distributed +5.6 mil added to treasury",
  "Year 1: treasury at 20 million:    7.5 mil distributed + 7.5 mil added to treasury",
  "Year 2: treasury at 28 million: 10.5 mil distributed + 10.5 mil added to treasury",
  "Year 3: treasury at 38 million:    14 mil distributed + 14 mil added to treasury. etc. etc. etc.",
];

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
          Prophet token ($PROPHET) is a Milady inspired memecoin and nft derivative created on Arbitrum that operates on
          a tiered tax structure basis. Meaning that it is a reflection token that shifts a % of trading volume back to
          staked token holders, paid in Ethereum. However users who buy or sell the token can reduce the tax rate via
          aquiring the projects NFT collection.
        </Typography>
      </div>

      <div className="container">
        <Typography className="container" variant="h4">
          The Thesis
        </Typography>
        <Typography sx={{ paddingTop: "15px" }}>
          Empower the Milady ecosystem through betting on modern age gladatorial cock fights.
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
          ProphetLady represents the vision of a Milady inspired derivative from elite gambling autists specializing in
          MMA betting. Check out the <a href="https://www.betmma.tips/Headmooment">team's success tracker here.</a>
        </Typography>
        <br></br>
        <Typography>
          Since inception of the bet tracker in November 2020, it has generated nearly 600 units in total. Averaging
          roughly 200% returns in about 3 years--compounding per year.
        </Typography>
      </div>

      <div className="container" style={{ marginTop: "15px" }}>
        <Typography sx={{ marginBottom: "15px" }}>
          The logic: users deposit Eth for $prophet, the team gambles on select events that have emperically enjoyed
          strong results. Prophets, should they occur, are intended towards Milady community empowerment.
        </Typography>
        <Typography>
          Prophetlady Corp. is a small cadre of autists that specialize in mma betting. The following infographs show
          the teams performance since inception from a start date of november 2020, so in 3 years its averaging roughly
          200% returns compounding per year.
        </Typography>
      </div>

      <div className="container" style={{ marginTop: "15px" }}>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          {" "}
          {/* Customize the title here */}
          Muh infograps of performance 2023
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
          Users stake $PROPHET tokens to claim a taxed share of trade volume via a reflection system. Building upon this
          simple and popular framework, ProphetLady adds a unique twist: users can burn a set amount of their $PROPHET
          tokens to mint a Milady derivative (the ProphetLady collection) that reduces the tax paid on sells. A
          ProphetLady can then be increased in tier by burning additional $PROPHET tokens for decreased tax rates and
          access to the NFT staking rewards pool.
        </Typography>

        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px" }}>
          Burn costs for minting and upgrading each tier of ProphetLady will be fixed at 400k $PROPHET tokens required
          to reach the next level.
        </Typography>
        <Typography variant="h6" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          {" "}
          {/* Customize the title here */}
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
        <Typography className="container" variant="h4">
          Tokenomics
        </Typography>
        <Typography sx={{ paddingTop: "15px", paddingBottom: "15px", fontWeight: "bold" }}>
          Total tokens in existence = 200,000,000,000
        </Typography>

        <Typography>120,000,000,000 (60%) $PROPHET will be distributed via 6 stages of IDO</Typography>
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

        <Typography>
          Holders will have one of multiple options of what to do with the prophet token once aquiring it. Option 1
          would be to contribute to the liquidity mining pool. The eth/prophet LP has an incentive of 7.5% of the entire
          supply to be evenly distributed on a proportional basis, daily, over the course of 5 years. (200 billion total
          tokens, 7.5% of that is 15 billion. 15 billion tokens divided every day for 5 years =7.5 million tokens
          roughly split between proportion of LP participants daily)
        </Typography>
      </div>

      <div className="container">
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          {" "}
          {/* Customize the title here */}
          Exhibit A
        </Typography>
        <Box sx={{ width: "100%", height: "auto", paddingTop: "15px", paddingBottom: "15px" }}>
          <img
            src="option1.png"
            alt="add liquidity to LP pool"
            style={{ width: "100%", height: "auto" }} // Inline styling
          />
        </Box>
        <Typography>
          Option 2 would be to simply stake $prophet tokens and collect the fees from taxes that are incurred from buys
          and sells
        </Typography>
      </div>

      <div className="container">
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          {" "}
          {/* Customize the title here */}
          Exhibit B
        </Typography>
        <Box sx={{ width: "100%", height: "auto", paddingTop: "15px", paddingBottom: "15px" }}>
          <img
            src="option2.png"
            alt="add liquidity to LP pool"
            style={{ width: "100%", height: "auto" }} // Inline styling
          />
        </Box>
        <Typography>
          Option 3 is to burn a set amount of Prophet tokens for a milady style inspired derivative collection, the idea
          of the nft being that with the more tokens one burns, one increase the tier of said NFT. The value being that
          the higher the tier of NFT, the lower the tax rate will be for when swapping Prophet tokens back for Eth.
          Also, users who upgrade or acquire the highest tier available (rank 5) can deposit said Nfts into another
          distinct pool to collect Prophet tokens. This pool also will distribute 7.5% of the total token supply to
          stakers equally over the course of a 5 year period.
        </Typography>
      </div>

      <div className="container">
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          {" "}
          {/* Customize the title here */}
          Exhibit C
        </Typography>
        <Box sx={{ width: "100%", height: "auto", paddingTop: "15px", paddingBottom: "15px" }}>
          <img
            src="option3.png"
            alt="burn prophet to generate or upgrade nft"
            style={{ width: "100%", height: "auto" }} // Inline styling
          />
        </Box>
      </div>

      <div className="container">
        <Typography variant="h6" component="div" sx={{ mb: 2, paddingTop: "15px" }}>
          {" "}
          {/* Customize the title here */}
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
      </div>

      <div className="container">
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

        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          {" "}
          {/* Customize the title here */}A table infographic of ido sales structure with round, price, and total raise
          amount
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={styles.table}>Round 1</TableCell>
                <TableCell className={styles.table}>.000000003125 Eth</TableCell>
                <TableCell className={styles.table}>62.5 Eth</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Round 2</TableCell>
                <TableCell className={styles.table}>.00000000625 Eth</TableCell>
                <TableCell className={styles.table}>125 Eth</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Round 3</TableCell>
                <TableCell className={styles.table}>.0000000125 Eth</TableCell>
                <TableCell className={styles.table}>250 Eth</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Round 4</TableCell>
                <TableCell className={styles.table}>.000000025 Eth</TableCell>
                <TableCell className={styles.table}>500 Eth</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Round 5</TableCell>
                <TableCell className={styles.table}>.00000005 Eth</TableCell>
                <TableCell className={styles.table}>1000 Eth</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Round 6</TableCell>
                <TableCell className={styles.table}>.0000001 Eth</TableCell>
                <TableCell className={styles.table}>2000 Eth</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="homepagetop">
        <Typography className={styles.container} variant="h2">
          WATCH OUT!!!
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "15px", paddingBottom: "15px" }}>
          In order to benefit from the NFT tier tax cut, at least one of the leveled up NFT's must be unstaked! Don't CUCK yourself and swap without an unstaked level 5 NFT in your wallet.
        </Typography>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
        {" "}
        {/* Customize the title here */}
        Additionally, there is one last piece in this puzzle, there is an "anti jeet" / arbitrage tax of an additional
        10% to any ido buyer who then buys or sells from the LP within the same round. Example, user buys in ido rd 1
        with a tier 5 nft, until the 1st rd ido is entirely bought out, the tax rate interacting with the LP will be 13%
        instead of 3%. Once ido rd 2 starts, the tax rate will revert back to 3%.
      </Typography>
      </div>

      <div className="container">
        <List sx={{ listStyleType: "disc" }}>
          {items.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
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
