
import {NextResponse} from 'next/server';
import {ethers} from 'ethers';

/**
 * API route to fetch transaction history from Etherscan.
 * This acts as a server-side proxy to securely handle the API key and avoid CORS issues.
 */
export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const address = searchParams.get('address');
  const chainId = searchParams.get('chainId') || '1'; // Default to mainnet

  // 1. Input Validation
  if (!address || !ethers.isAddress(address)) {
    return NextResponse.json({error: 'Valid wallet address is required'}, {status: 400});
  }

  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

  // 2. API Key Check
  if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
    console.error('Etherscan API key not configured on the server.');
    return NextResponse.json({error: 'API service is not configured.'}, {status: 500});
  }
  
  // Etherscan V2 uses a single endpoint for all supported chains.
  // The network is inferred from the API key or is just mainnet.
  // For other networks, you often use a different API key.
  const apiSubdomain = chainId === '11155111' ? 'api-sepolia' : 'api';
  const url = `https://${apiSubdomain}.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=25&sort=desc&apikey=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json({error: 'Etherscan API rate limit reached.'}, {status: 429});
      }
      throw new Error(`Etherscan API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // The most important check: Etherscan returns status "0" for errors.
    if (data.status !== '1') {
      console.error("Etherscan API error response:", data);
      // The `result` field often contains the specific error message (e.g., "Invalid API Key")
      const errorMessage = typeof data.result === 'string' ? data.result : data.message;
      return NextResponse.json({error: `Etherscan API Error: ${errorMessage}`}, {status: 500});
    }

    return NextResponse.json({result: data.result});
    
  } catch (error) {
    console.error('Error in /api/transactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
