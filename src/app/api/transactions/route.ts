
import {NextResponse} from 'next/server';
import {ethers} from 'ethers';

/**
 * API route to fetch transaction history from Etherscan.
 * This acts as a server-side proxy to securely handle the API key and avoid CORS issues.
 */
export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const address = searchParams.get('address');

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

  const url = `https://api.etherscan.io/api`;

  // 3. Etherscan V2 POST Request Body
  const body = {
    module: 'account',
    action: 'txlist',
    address: address,
    startblock: 0,
    endblock: 99999999,
    page: 1,
    offset: 25,
    sort: 'desc',
  };

  try {
    // 4. Making the Server-to-Server Request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`, // Using Bearer token for V2
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json({error: 'Etherscan API rate limit reached.'}, {status: 429});
      }
      throw new Error(`Etherscan API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // 5. Response Handling
    if (data.status === '1') {
      return NextResponse.json({result: data.result});
    } else {
      // Forward Etherscan's specific error message if available
      return NextResponse.json({error: data.message || 'Error fetching transactions from Etherscan.'}, {status: 500});
    }
  } catch (error) {
    console.error('Error in /api/transactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
