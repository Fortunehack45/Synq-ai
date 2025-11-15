
'use server';

import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { fetchTransactionHistory } from './etherscan';

// This function needs to be callable from the server, but it might not have window context.
// We'll prioritize env vars and accept that localStorage won't work here.
function getAlchemy(): Alchemy | null {
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.length < 30) {
    console.warn("Alchemy API key not found or invalid in server context. On-chain data fetching will be disabled.");
    return null;
  }
  // Default to mainnet for server-side tool calls
  return new Alchemy({ apiKey, network: Network.ETH_MAINNET });
}

export async function getWalletBalance(address: string): Promise<string> {
  const alchemy = getAlchemy();
  if (!alchemy || !ethers.isAddress(address)) {
    return '0.0';
  }
  try {
    const balance = await alchemy.core.getBalance(address, 'latest');
    return Utils.formatEther(balance);
  } catch (error) {
    console.error("Failed to fetch wallet balance:", error);
    return '0.0';
  }
}

export async function getWalletTransactions(address: string) {
  if (!ethers.isAddress(address)) {
    return [];
  }
  
  try {
    // Always use mainnet '1' for the Genkit tool context
    const transactions = await fetchTransactionHistory(address, '1');
    return transactions.slice(0, 10).map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: Utils.formatEther(tx.value),
        timeStamp: tx.timeStamp,
      }));
  } catch (error) {
    console.error("Failed to fetch transactions from Etherscan service (on server):", error);
    return [];
  }
}

export async function getWalletTokenBalances(address: string) {
  const alchemy = getAlchemy();
  if (!alchemy || !ethers.isAddress(address)) {
    return [];
  }
  try {
    const balances = await alchemy.core.getTokenBalances(address);
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
      return token.tokenBalance !== '0';
    });

    const tokens = [];
    for (const token of nonZeroBalances.slice(0, 10)) { // Limit to 10 tokens
      const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
      const balance = parseFloat(token.tokenBalance!) / Math.pow(10, metadata.decimals || 18);
      tokens.push({
        name: metadata.name,
        symbol: metadata.symbol,
        balance: balance.toFixed(4),
      });
    }
    return tokens;
  } catch (error) {
    console.error("Failed to fetch token balances:", error);
    return [];
  }
}
