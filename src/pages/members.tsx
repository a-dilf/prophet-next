// next and react imports
import React from "react";
import styles from "../styles/HomePage.module.css";

import { Button, Stack, Typography } from "@mui/material";

import { token_abi } from "../../abi_objects/token_abi";
import ErrorAlert from "../../components/ErrorAlert";

import { useEffect, useState } from "react";
import { useAccount, useTransaction, useWriteContract } from "wagmi";

import type { Membership } from "../../types/membership";

import FighterCard from "components/FighterCard";

// Define interfaces for your data structure
interface Line {
  fighter_name: string;
  plus_or_minus: string;
  live_bets: string;
}

interface FighterData {
  _id: string;
  line: Line;
}

// Add type to the props
interface FighterCardProps {
  data: FighterData[];
}

const MembersPage = () => {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<Membership | null>(null);
  const [lines, setLines] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState("");

  // configuration object for burn function
  const burnConfig = {
    address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as "0x${string}",
    abi: token_abi,
    args: [BigInt(1 * 1000000000000000000)],
    functionName: "burn",
  } as const;

  // write contract burn function instance
  const {
    data: hash,
    writeContract: buy,
    isPending: isBurnLoading,
    isSuccess: isBurnStarted,
    error: burnError,
  } = useWriteContract();

  // Transaction monitoring hook
  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useTransaction({
    hash,
  });

  // attempt to fetch user data from mongoDB
  useEffect(() => {
    const fetchUser = async () => {
      if (!isConnected || !address) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/user?wallet_address=${address}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("not_found");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return;
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [isConnected, address]);

  // attempt to fetch lines from mongoDB
  useEffect(() => {
    const fetchLines = async () => {
      if (!user || expiryDate <= today) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/lines");
        if (!response.ok) {
          if (response.status === 404) {
            setError("not_found");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return;
        }
        const data = await response.json();
        setLines(data);
        console.log("data", data);
      } catch (error) {
        console.error("Error fetching lines:", error);
        setError("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLines();
  }, [user]);

  useEffect(() => {
    const updateDatabase = async () => {
      if (txSuccess && txData) {
        try {
          const response = await fetch("/api/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              wallet_address: address,
              tokensBurned: 1, // Using the same amount from burnConfig
              transactionHash: hash, // Including the transaction hash for reference
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update database");
          }

          const result = await response.json();
          console.log("Database updated successfully:", result);
        } catch (error) {
          console.error("Error updating database:", error);
          // Handle database update error
        }
      }
    };

    updateDatabase();
  }, [txSuccess, txData, hash]);

  // graceful error handling
  React.useEffect(() => {
    if (burnError) {
      setErrorMessage(burnError["message"]);
    }
  }, [burnError]);

  // render states
  if (!isConnected) {
    return <div>Please connect your wallet first!</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error === "error") {
    return <div>Something went wrong. Please try again later.</div>;
  }

  if (!user) {
    return (<div className="homepagetop">
      <Typography className={styles.container} variant="h2">
        Members
      </Typography>
      <Typography className="container" variant="h4" sx={{ paddingTop: "25px" }}>
        Burn 2,000,000 $PROPHET tokens for a month of membership and get access to our lines.
      </Typography>

      <Button
        color="secondary"
        variant="contained"
        fullWidth // This makes the button fill the Box
        sx={{
          // Using sx prop instead of style for better Material UI integration
          mt: 3, // marginTop: 24px (theme spacing 3 = 24px)
          py: 1.5, // Add more padding to make button taller
        }}
        disabled={!buy || isBurnLoading || isBurnStarted}
        data-mint-started={isBurnLoading && !isBurnStarted}
        data-mint-complete={!isBurnLoading && isBurnStarted}
        onClick={() =>
          buy?.({
            ...burnConfig,
          })
        }
      >
        {!isBurnLoading && !isBurnStarted && "Sign Up"}
        {isBurnLoading && "Executing..."}
        {!isBurnLoading && isBurnStarted && "complete"}
      </Button>
    </div>)
  }

  const expiryDate = new Date(user.expiryDate);
  const createdAt = new Date(user.createdAt);
  const updatedAt = new Date(user.updatedAt);
  const today = new Date();

  return (
    <div
      className="page"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "35px", paddingBottom: "25px" }}
    >
      <ErrorAlert errorMessage={errorMessage} setErrorMessage={setErrorMessage}></ErrorAlert>

      <div className="homepagetop">
        <Typography className={styles.container} variant="h2">
          Members
        </Typography>
        <Typography className="container" variant="h4" sx={{ paddingTop: "25px" }}>
          Burn 2.5MM $PROPHET tokens for a month of membership and get access to our lines.
        </Typography>

        <Button
          color="secondary"
          variant="contained"
          fullWidth // This makes the button fill the Box
          sx={{
            // Using sx prop instead of style for better Material UI integration
            mt: 3, // marginTop: 24px (theme spacing 3 = 24px)
            py: 1.5, // Add more padding to make button taller
          }}
          disabled={!buy || isBurnLoading || isBurnStarted}
          data-mint-started={isBurnLoading && !isBurnStarted}
          data-mint-complete={!isBurnLoading && isBurnStarted}
          onClick={() =>
            buy?.({
              ...burnConfig,
            })
          }
        >
          {!isBurnLoading && !isBurnStarted && "Sign Up"}
          {isBurnLoading && "Executing..."}
          {!isBurnLoading && isBurnStarted && "complete"}
        </Button>
      </div>

      {error === "not_found" && <div>Make an account</div>}
      {expiryDate <= today && <div>Please renew your membership!</div>}

      {!error && expiryDate > today && (
        <div>
          <div className="container">
            <Typography className={styles.container} variant="h5">
              Membership details
            </Typography>
            <Typography sx={{ paddingTop: "15px" }}>
              You signed up on {createdAt.toLocaleDateString()} and your membership will expire on{" "}
              {expiryDate.toLocaleDateString()}.
            </Typography>
          </div>

          <FighterCard data={lines} />

        </div>
      )}
    </div>
  );
};

export default MembersPage;
