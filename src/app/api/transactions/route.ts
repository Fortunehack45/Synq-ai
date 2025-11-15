
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

  if (!address || !ethers.isAddress(address)) {
    return NextResponse.json({error: 'Valid wallet address is required'}, {status: 400});
  }

  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

  if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
    console.error('Etherscan API key not configured on the server.');
    return NextResponse.json({error: 'Server API service is not configured.'}, {status: 500});
  }

  const apiSubdomain = chainId === '11155111' ? 'api-sepolia' : 'api';
  // V2 API requires the key in the header, not as a query parameter.
  const url = `https://${apiSubdomain}.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=25&sort=desc`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-APIKEY': apiKey, // Etherscan V2 requires key in header
      },
    });

    const data = await response.json();

    if (!response.ok || data.status !== '1') {
       const errorMessage = data.result || data.message || `Etherscan API request failed with status ${response.status}`;
       console.error("Etherscan API error response:", errorMessage);
       const status = typeof response.status === 'number' && response.status >= 100 && response.status < 600 ? response.status : 500;
       return NextResponse.json({error: `Etherscan API Error: ${errorMessage}`}, {status});
    }

    return NextResponse.json({result: data.result});
    
  } catch (error) {
    console.error('Error in /api/transactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
