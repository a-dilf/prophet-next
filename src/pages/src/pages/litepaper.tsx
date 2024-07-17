// next and react imports
import React from 'react';
import type { NextPage } from 'next';

import styles from '../styles/Litepaper.module.css';

import { Table, TableBody, TableCell, TableContainer, TableRow, Typography, Box, Grid, Link, Button, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

const items = [
    'Emperically speaking, 200% per year for the last 3 years is what the team has accomplished, however, given the law of large numbers, should the treasury go beyond 7 figures, this will likely prove too difficult to achieve, so with this a general target of success the team hopes for is roughly 50-100% a year......',
    'Assume full raise occurs = $15,000,000',
    '75% roi divided weekly = 1.5%',
    '1.5% of 15,000,000 = $225,000',
    '.75% (or half... $112,500) goes to "community building", the other.75% ($112,500) goes to building the treasury further',
    'Assume full raise: 15,000,000 ',
    'Year zero: treasury at 15 million: 5.6 mil distributed +5.6 mil added to treasury',
    'Year 1: treasury at 20 million:    7.5 mil distributed + 7.5 mil added to treasury',
    'Year 2: treasury at 28 million: 10.5 mil distributed + 10.5 mil added to treasury',
    'Year 3: treasury at 38 million:    14 mil distributed + 14 mil added to treasury. etc. etc. etc.'
];

const Litepaper: NextPage = () => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
            <div className="container">
                <Typography className="container" variant="h2">Litepaper</Typography>
            </div>

            <div className="container" style={{ marginTop: "15px" }}>
                <Typography className="container" variant="h6">Prophet token ($PROPHET) is a Milady inspired  memecoin and nft derivative created on Arbitrum that operates on a tiered tax structure basis. Meaning that it is a reflection token that shifts a % of trading volume back to staked token holders, paid in Ethereum. However users who buy or sell the token can reduce the tax rate via aquiring the projects NFT collection.</Typography>
            </div>

            <div className="container" style={{ marginTop: "15px" }}>
                <Typography sx={{ marginBottom: "15px" }}>The logic: users deposit Eth for $prophet, the team gambles on select events that have emperically enjoyed strong results. Prophets, should they occur, are intended towards Milady community empowerment.</Typography>
                <Typography>Prophetlady Corp. is a small cadre of autists that specialize in mma betting. The following infographs show the teams performance since inception from a start date of november 2020, so in 3 years its averaging roughly 200% returns compounding per year.</Typography>

            </div>
            <div className="container" style={{ marginTop: "15px" }}>
                <Typography variant="h6" component="div" sx={{ mb: 2 }}> {/* Customize the title here */}
                    Muh infograps of performance 2023
                </Typography>

                <Box sx={{ width: '100%', height: 'auto', paddingTop: "15px", paddingBottom: "15px" }}>
                    <img
                        src="cumulative profits monthly.png"
                        alt="cum profits"
                        style={{ width: '100%', height: 'auto' }} // Inline styling
                    />
                </Box>

                <Box sx={{ width: '100%', height: 'auto', paddingTop: "15px", paddingBottom: "15px" }}>
                    <img
                        src="monthly performance.png"
                        alt="monthly profits"
                        style={{ width: '100%', height: 'auto' }} // Inline styling
                    />
                </Box>

                <Box sx={{ width: '100%', height: 'auto', paddingTop: "15px", paddingBottom: "15px" }}>
                    <img
                        src="monthly wins vs losses.png"
                        alt="monthly wins vs losses"
                        style={{ width: '100%', height: 'auto' }} // Inline styling
                    />
                </Box>

                <Typography>Holders will have one of multiple options of what to do with the prophet token once aquiring it. Option 1 would be to contribute to the liquidity mining pool. The eth/prophet LP has an incentive of 7.5% of the entire supply to be evenly distributed on a proportional basis, daily, over the course of 5 years. (200 billion total tokens, 7.5% of that is 15 billion. 15 billion tokens divided every day for 5 years =7.5 million tokens roughly split between proportion of LP participants daily)</Typography>
            </div>

            <div className="container">
                <Typography variant="h6" component="div" sx={{ mb: 2 }}> {/* Customize the title here */}
                    Exhibit A
                </Typography>
                <Box sx={{ width: '100%', height: 'auto', paddingTop: "15px", paddingBottom: "15px" }}>
                    <img
                        src="option1.png"
                        alt="add liquidity to LP pool"
                        style={{ width: '100%', height: 'auto' }} // Inline styling
                    />
                </Box>
                <Typography>Option 2 would be to simply stake $prophet tokens and collect the fees from taxes that are incurred from buys and sells</Typography>
            </div>

            <div className="container">
                <Typography variant="h6" component="div" sx={{ mb: 2 }}> {/* Customize the title here */}
                    Exhibit B
                </Typography>
                <Box sx={{ width: '100%', height: 'auto', paddingTop: "15px", paddingBottom: "15px" }}>
                    <img
                        src="option2.png"
                        alt="add liquidity to LP pool"
                        style={{ width: '100%', height: 'auto' }} // Inline styling
                    />
                </Box>
                <Typography>Option 3 is to burn a set amount of Prophet tokens for a milady style inspired derivative collection, the idea of the nft being that with the more tokens one burns, one increase the tier of said NFT.  The value being that the higher the tier of NFT, the lower the tax rate will be for when swapping Prophet tokens back for Eth.  Also, users who upgrade or acquire the highest tier available (rank 5) can deposit said Nfts into another distinct pool to collect Prophet tokens. This pool also will distribute 7.5% of the total token supply to stakers equally over the course of a 5 year period.</Typography>
            </div>

            <div className="container">
                <Typography variant="h6" component="div" sx={{ mb: 2 }}> {/* Customize the title here */}
                    Exhibit C
                </Typography>
                <Box sx={{ width: '100%', height: 'auto', paddingTop: "15px", paddingBottom: "15px" }}>
                    <img
                        src="option3.png"
                        alt="burn prophet to generate or upgrade nft"
                        style={{ width: '100%', height: 'auto' }} // Inline styling
                    />
                </Box>
            </div>

            <div className="container">
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
            </div>

            <div className="container">

                <Typography variant="h6" component="div" sx={{ mb: 2 }}> {/* Customize the title here */}
                    A detailed look into the mechanics of the NFTs and the tax rates...
                </Typography>
                <Box sx={{ width: '100%', height: 'auto', paddingTop: "15px", paddingBottom: "15px" }}>
                    <img
                        src="nftinfograph.png"
                        alt="nft structure"
                        style={{ width: '100%', height: 'auto' }} // Inline styling
                    />
                </Box>

                <Typography variant="h6" component="div" sx={{ mb: 2 }}> {/* Customize the title here */}
                    Muh chart in totality to illustrate the method to the madness.
                </Typography>
                <Box sx={{ width: '100%', height: 'auto', paddingTop: "15px", paddingBottom: "15px" }}>
                    <img
                        src="infograph.png"
                        alt="a chart describing the structure of the coin"
                        style={{ width: '100%', height: 'auto' }} // Inline styling
                    />
                </Box>

                <Typography variant="h6" component="div" sx={{ mb: 2 }}> {/* Customize the title here */}
                    Chart of ido sales structure with price and implied FDV
                </Typography>
                <Box sx={{ width: '100%', height: 'auto', paddingTop: "15px", paddingBottom: "15px" }}>
                    <img
                        src="idochart.png"
                        alt="ido sales structure"
                        style={{ width: '100%', height: 'auto' }} // Inline styling
                    />
                </Box>
            </div>

            <div className="container">
                <List sx={{ listStyleType: 'disc' }}>
                    {items.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={item} />
                        </ListItem>
                    ))}
                </List>
            </div>
        </div>
    );
};

export default Litepaper;
