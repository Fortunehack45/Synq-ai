
'use server';

import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { ethers } from 'ethers';

function getAlchemy(): Alchemy | null {
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.length < 30) {
    console.warn("Alchemy API key not found or invalid. On-chain data fetching will be disabled.");
    return null;
  }
  return new Alchemy({ apiKey, network: Network.ETH_MAINNET });
}

function getEtherscanApiKey(): string | null {
  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.length < 30) {
    console.warn("Etherscan API key not found or invalid. Transaction history will not be available.");
    return null;
  }
  return apiKey;
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
  const apiKey = getEtherscanApiKey();
  if (!apiKey || !ethers.isAddress(address)) {
    return [];
  }
  // V2 requires chainid, so we default to mainnet (1) for this server-side context.
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${apiKey}&chainid=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === '1') {
      return data.result.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: Utils.formatEther(tx.value),
        timeStamp: tx.timeStamp,
      }));
    } else {
      console.error("Etherscan API error:", data.message, data.result);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch transactions from Etherscan:", error);
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
