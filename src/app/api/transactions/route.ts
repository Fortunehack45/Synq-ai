
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

  let apiSubdomain = 'api';
  switch (chainId) {
    case '11155111':
      apiSubdomain = 'api-sepolia';
      break;
    case '1':
    default:
      apiSubdomain = 'api';
      break;
  }

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

    if (data.status === '1') {
      return NextResponse.json({result: data.result});
    } else {
      console.error("Etherscan API error response:", data);
      return NextResponse.json({error: data.message || 'Error fetching transactions from Etherscan.'}, {status: 500});
    }
  } catch (error) {
    console.error('Error in /api/transactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
