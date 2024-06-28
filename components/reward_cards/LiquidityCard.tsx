// next and react imports
import React, { ChangeEvent } from 'react';
import Image from 'next/legacy/image';

import { toWei } from 'web3-utils';
import TextField from '@mui/material/TextField';

// component imports
import FlipCard, { BackCard, FrontCard } from '../FlipCard';

import { Typography, Button } from '@mui/material';

import { router_abi } from '../../abi_objects/router_abi';
import { untaxed_abi } from '../../abi_objects/untaxed_abi';

// rainbowkit+ imports
import {
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi';

import { staking_token_abi } from '../../abi_objects/staking_token_abi';

interface LiquidityCardProps {
    mounted: boolean;
    isConnected: boolean;
    cardTitle: string;
    reservesProphet: BigInt;
    reservesEth: BigInt;
}

// TODO - revert these type changes??

const LiquidityCard: React.FC<LiquidityCardProps> = ({ mounted, isConnected, cardTitle, reservesProphet, reservesEth }) => {

    // TODO - get this from user input!
    const [tokenAmountToAdd, setTokenAmountToAdd] = React.useState(0n);
    const [ethAmountToAddInWei, setEthAmountToAdd] = React.useState(0n);

    // contract configs
    // collect token amount from user and get an ETH quote
    /*
    const routerContractConfig = {
        address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as '0x${string}',
        abi: router_abi,
        args: [BigInt(tokenAmountToAdd), reservesProphet, reservesEth]
    } as const;
    */

    const routerContractConfig = {
        address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as '0x${string}',
        abi: router_abi,
        args: [BigInt(tokenAmountToAdd), reservesProphet, reservesEth]
    } as const;
    
    // use ETH quote amount and token amount in proper peg ratio
    const untaxedContractConfig = {
        address: process.env.NEXT_PUBLIC_UNTAXED_LIQUIDITY_ADDRESS as '0x${string}',
        abi: untaxed_abi,
        args: [BigInt(200000000000000000000000)],
        value: BigInt(543666666666666),
    } as const;

    //// READ OPERATIONS
    const { data: ethAmount } = useReadContract({
        ...routerContractConfig,
        functionName: 'quote',
    });

    React.useEffect(() => {
        if (ethAmount) {
            console.log(ethAmount)
            // TODO - check if amount comes in as WEI
            // setEthAmountToAdd(BigInt(toWei(Number(ethAmount), "wei")));
            setEthAmountToAdd(ethAmount);
        }
    }, [ethAmount]);

    //// WRITE OPERATIONS

    // let user claim rewards
    const {
        data: hash,
        writeContract: addLiquidity,
        isPending: isAddLoading,
        isSuccess: isAddStarted,
        error: addError,
    } = useWriteContract();

    // ??
    const {
        data: txData,
        isSuccess: txSuccess,
        error: txError,
    } = useWaitForTransactionReceipt({
        hash,
        query: {
            enabled: !!hash,
        },
    });

    // TODO - all input fields should pull user token counts!

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value)
        const newValue = parseInt(event.target.value, 10); // Parse the input value to a number
        setTokenAmountToAdd(BigInt(newValue));
    };

    return (
        <div className="container">
            <div style={{ flex: '1 1 auto' }}>
                <div style={{ padding: '24px 24px 24px 0' }}>
                    <Typography variant="h5">{cardTitle}</Typography>
                    <TextField
                        label="Token Amount"
                        type="number"
                        value={Number(tokenAmountToAdd)}
                        onChange={handleChange}
                        style={{ marginTop: 15, marginLeft: 15 }}
                    />

                    {addError && (
                        <p style={{ marginTop: 24, color: '#FF6257' }}>
                            Error: {addError.message}
                        </p>
                    )}
                    {txError && (
                        <p style={{ marginTop: 24, color: '#FF6257' }}>
                            Error: {txError.message}
                        </p>
                    )}

                    {mounted && isConnected && !(!isAddLoading && isAddStarted) && (
                        <Button
                            color="secondary"
                            variant="contained"
                            style={{ marginTop: 24, marginLeft: 15 }}
                            disabled={!addLiquidity || isAddLoading || isAddStarted}
                            data-mint-loading={isAddLoading}
                            data-mint-started={isAddStarted}
                            onClick={() =>
                                addLiquidity?.({
                                    ...untaxedContractConfig,
                                    functionName: "addLiquidityETHUntaxed",
                                })
                            }
                        >
                            {isAddLoading && 'Confirming...'}
                            {isAddStarted && 'adding...'}
                            {!isAddLoading && !isAddStarted && "add"}
                        </Button>
                    )}
                    
                </div>
            </div>


            <div style={{ flex: '0 0 auto' }}>
                <FlipCard>
                    <FrontCard isCardFlipped={!isAddLoading && isAddStarted}>
                        Rewards to claim
                        <Image
                            layout="fill"
                            src="/nft.png"
                            width="500"
                            height="500"
                            alt="NFT Image"
                            priority
                            objectFit="cover" // or 'contain' depending on your preference
                            quality={100}
                        />
                    </FrontCard>
                    <BackCard isCardFlipped={!isAddLoading && isAddStarted}>
                        <div style={{ padding: 24 }}>
                            <Image
                                src="/nft.png"
                                width="80"
                                height="80"
                                alt="RainbowKit Demo NFT"
                                style={{ borderRadius: 8 }}
                                priority
                            />
                            <Typography variant="h5" style={{ marginTop: 24, marginBottom: 6 }}>Rewards claimed!</Typography>
                            <Typography style={{ marginBottom: 24 }}>
                                Stick around for more tomorrow!
                            </Typography>
                            <Typography style={{ marginBottom: 6 }}>
                                View on{' '}
                                <a href={`https://arbiscan.io/tx/${hash}`}>
                                    Arbiscan
                                </a>
                            </Typography>
                        </div>
                    </BackCard>
                </FlipCard>
            </div>
        </div>
    );
};

/* TODO make !isMintLoading && isMintStarted the flip condition! and report the reward amount
                
*/

export default LiquidityCard;
