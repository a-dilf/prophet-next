export interface Membership {
  _id: string;
  walletAddress: string;
  expiryDate: Date;
  lastBurnTxHash: string;
  tokensBurned: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}