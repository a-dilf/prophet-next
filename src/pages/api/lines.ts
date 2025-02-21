import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db("users_d");
    
    // Convert cursor to array of documents
    const lines = await db.collection("lines_c").find({}).sort({ _id: -1 }).toArray();

    // Check if any documents were found
    if (!lines || lines.length === 0) {
      return res.status(404).json({ message: 'No documents found' });
    }

    res.status(200).json(lines);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}