

'use server';

import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { ethers } from 'ethers';

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

async function fetchEtherscanV2(body: object) {
  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
  if (!apiKey || apiKey.includes("YOUR_API_KEY")) {
    throw new Error("Etherscan API key is not configured on the server.");
  }

  const url = `https://api.etherscan.io/api`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      if(response.status === 429) {
        throw new Error("Etherscan API rate limit reached.");
      }
      throw new Error(`Etherscan API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === '1') {
      return data.result;
    } else {
      console.error("Etherscan API V2 error:", data.message, data.result);
      throw new Error(data.message || 'An error occurred with the Etherscan API.');
    }
  } catch (error) {
    console.error("Failed to fetch from Etherscan V2 API:", error);
    throw error;
  }
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

  const body = {
    module: "account",
    action: "txlist",
    address: address,
    startblock: 0,
    endblock: 99999999,
    page: 1,
    offset: 10,
    sort: "desc"
  };

  try {
    const result = await fetchEtherscanV2(body);
    return result.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: Utils.formatEther(tx.value),
        timeStamp: tx.timeStamp,
      }));
  } catch (error) {
    console.error("Failed to get wallet transactions via V2 API:", error);
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======

<<<<<<< HEAD
    
<<<<<<< HEAD
>>>>>>> b3298fc (Try fixing this error: `Console Error: Etherscan API error: "NOTOK" "You)
=======
>>>>>>> 2ad3dc5 (Try fixing this error: `Console Error: Etherscan API error: "NOTOK" "You)
=======

    
>>>>>>> b204695 (Error: Etherscan API error: "NOTOK" "You are using a deprecated V1 endpo)
=======
>>>>>>> 023ff16 (Try fixing this error: `Console Error: Etherscan API error: "NOTOK" "You)
=======
    
>>>>>>> d229963 (Error: Etherscan API error: "NOTOK" "You are using a deprecated V1 endpo)
=======
>>>>>>> 9add21b (Try fixing this error: `Console Error: Etherscan API error: "NOTOK" "You)
=======

    
    
>>>>>>> 2aa5d23 (I'm getting this runtime error:)
