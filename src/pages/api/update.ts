import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { wallet_address, tokensBurned, transactionHash } = req.body;

  if (!wallet_address) {
    return res.status(400).json({ message: 'Wallet address is required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db("users_d");
    
    // Calculate new expiry date (1 month from now)
    const newExpiryDate = new Date();
    newExpiryDate.setMonth(newExpiryDate.getMonth() + 1);

    // Update or insert the user document
    const result = await db.collection("users_c").updateOne(
      { wallet_address: wallet_address },
      {
        $set: {
          expiryDate: newExpiryDate,
          isActive: true,
          updatedAt: new Date(),
          lastBurnTxHash: transactionHash,
        },
        $inc: {
          tokensBurned: tokensBurned || 2, // Will add to existing value, or create with this value if new document
        },
        $setOnInsert: {
          createdAt: new Date(),
        }
      },
      { upsert: true }
    );

    res.status(200).json({ message: 'User updated successfully', result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}