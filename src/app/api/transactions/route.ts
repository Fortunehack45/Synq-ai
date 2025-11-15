
import {NextResponse} from 'next/server';
import {ethers} from 'ethers';

/**
 * API route to fetch transaction history from Etherscan API V2.
 * This acts as a secure, server-side proxy to handle the API key and avoid CORS issues.
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
  
  const getApiSubdomain = (id: string) => {
    switch (id) {
      case '11155111': return 'api-sepolia';
      case '1': return 'api';
      default: return 'api'; // Default to mainnet for others
    }
  }
  
  const apiSubdomain = getApiSubdomain(chainId);
  // Using Etherscan API V2. The action 'txlist' still uses this URL structure.
  const url = `https://${apiSubdomain}.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=25&sort=desc`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        // V2 requires API key in the header.
        'X-APIKEY': apiKey,
      }
    });

    if (!response.ok) {
       const errorText = await response.text();
       console.error(`Etherscan API request failed with status ${response.status}: ${errorText}`);
       // Don't try to parse JSON if the response is not ok
       return NextResponse.json({error: `Etherscan API request failed: ${errorText}`}, {status: response.status});
    }

    const data = await response.json();
    
    // Etherscan API returns status "0" on error.
    if (data.status !== '1') {
      const errorMessage = data.result || data.message || 'An unknown Etherscan API error occurred.';
      console.error("Etherscan API error response:", errorMessage);
      return NextResponse.json({error: `Etherscan API Error: ${errorMessage}`}, {status: 500});
    }

    // Success, return the results
    return NextResponse.json({result: data.result});
    
  } catch (error) {
    console.error('Error in /api/transactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
