// next and react imports
import React from 'react';
import type { NextPage } from 'next';

import { Typography, Box } from '@mui/material';

const Litepaper: NextPage = () => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div className="container">
                <Typography className="container" variant="h2">Litepaper</Typography>
            </div>

            <div className="container">
                <Typography className="container" variant="h6">Prophet token ($PROPHET) is a Milady inspired  memecoin and nft derivative created on Arbitrum that operates on a tiered tax structure basis. Meaning that it is a reflection token that shifts a % of trading volume back to staked token holders, paid in Ethereum. However users who buy or sell the token can reduce the tax rate via aquiring the projects NFT collection.</Typography>
                <Typography>The logic: users deposit Eth for $prophet, the team gambles on select events that have emperically enjoyed strong results. Prophets, should they occur, are intended towards Milady community empowerment.</Typography>
                <Typography>Prophetlady Corp. is a small cadre of autists that specialize in mma betting. The following infographs show the teams performance since inception from a start date of november 2020, so in 3 years its averaging roughly 200% returns compounding per year.</Typography>
            </div>

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

            <Typography variant="h6" component="div" sx={{ mb: 2 }}> {/* Customize the title here */}
                Exhibit A
            </Typography>
            <Typography></Typography>
            <Typography></Typography>
            <Typography></Typography>

            <p>Exhibit A</p>
            <img src="option1.png" alt="add liquidity to LP pool"></img>

            <p className="litepaper_p">Option 2 would be to simply stake $prophet tokens and collect the fees from taxes that are incurred from buys and sells  </p>
            <p>Exhibit B</p>
            <img src="option2.png" alt="Stake prophet to earn taxes"></img>

            <p className="litepaper_p">Option 3 is to burn a set amount of Prophet tokens for a milady style inspired derivative collection, the idea of the nft being that with the more tokens one burns, one increase the tier of said NFT.  The value being that the higher the tier of NFT, the lower the tax rate will be for when swapping Prophet tokens back for Eth.  Also, users who upgrade or acquire the highest tier available (rank 5) can deposit said Nfts into another distinct pool to collect Prophet tokens. This pool also will distribute 7.5% of the total token supply to stakers equally over the course of a 5 year period.</p>

            <p>Exhibit C</p>
            <img src="option3.png" alt="burn prophet to generate or upgrade nft"></img>

            <p>
                NO NFT? TAX RATE=13%<br></br>
                TIER 1 NFT? TAX RATE=11%<br></br>
                TIER 2 NFT? TAX RATE=9%<br></br>
                TIER 3 NFT? TAX RATE=7%<br></br>
                TIER 4 NFT? TAX RATE=5%<br></br>
                TIER 5 NFT? TAX RATE=3%<br></br>
            </p>

            <h1>A detailed look into the mechanics of the NFTs and the tax rates....</h1>
            <img src="nftinfograph.png" alt="nft structure"></img>

            <h1>Muh chart in totality to illustrate the method to the madness. </h1>
            <img src="infograph.png" alt="a chart describing the structure of the coin"></img>

            <h1>Chart of ido sales structure with price and implied FDV</h1>

            <img src="idochart.png" alt="ido sales structure"></img>

            <ul className="litepaper_ul">
                <p className="litepaper_p" >Emperically speaking, 200% per year for the last 3 years is what the team has accomplished, however, given the law of large numbers, should the treasury go beyond 7 figures, this will likely prove too difficult to achieve, so with this a general target of success the team hopes for is roughly 50-100% a year......   </p>
                <li>Assume full raise occurs = $15,000,000</li><br></br>
                <li>75% roi divided weekly = 1.5%</li><br></br>
                <li>1.5% of 15,000,000 = $225,000</li><br></br>
                <li>.75% (or half... $112,500) goes to "community building", the other .75% ($112,500) goes to building the treasury further</li>
                <li>Assume full raise: 15,000,000 </li><br></br>
                <li> Year zero: treasury at 15 million: 5.6 mil distributed +5.6 mil added to treasury</li><br></br>
                <li>Year 1: treasury at 20 million:    7.5 mil distributed + 7.5 mil added to treasury</li><br></br>
                <li>Year 2: treasury at 28 million: 10.5 mil distributed + 10.5 mil added to treasury</li><br></br>
                <li>Year 3: treasury at 38 million:    14 mil distributed + 14 mil added to tresury. etc. etc. etc.</li><br></br><br></br>
            </ul>
        </div>
    );
};

export default Litepaper;
