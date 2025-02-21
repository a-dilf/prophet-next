import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { wallet_address } = req.query;

  if (!wallet_address) {
    return res.status(400).json({ message: 'Wallet address is required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db("users_d");
    
    const user = await db.collection("users_c").findOne(
      { wallet_address: wallet_address }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}