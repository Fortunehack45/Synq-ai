
import {NextResponse} from 'next/server';
import {ethers} from 'ethers';

/**
 * API route to fetch transaction history from Etherscan.
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
  
  // Etherscan V2 uses different base URLs for different networks.
  const getApiBaseUrl = (id: string) => {
    switch (id) {
      case '11155111': return 'https://api-sepolia.etherscan.io';
      case '1': return 'https://api.etherscan.io';
      default: return 'https://api.etherscan.io'; // Default to mainnet for others
    }
  }
  
  const apiBaseUrl = getApiBaseUrl(chainId);
  const url = `${apiBaseUrl}/api/v2/accounts/${address}/transactions`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'accept': 'application/json',
        'X-Etherscan-Api-Key': apiKey,
      }
    });

    if (!response.ok) {
       const errorText = await response.text();
       let errorJson;
       try {
        errorJson = JSON.parse(errorText);
       } catch (e) {
        // Not a JSON error response
       }
       const errorMessage = errorJson?.message || `Etherscan API request failed: ${errorText}`;
       console.error(`Etherscan API request failed with status ${response.status}: ${errorMessage}`);
       return NextResponse.json({error: errorMessage}, {status: response.status});
    }

    const data = await response.json();
    
    // Etherscan V2 has a different success structure
    if (data.status !== '1' && !data.items) {
      const errorMessage = data.message || data.result || 'An unknown Etherscan API error occurred.';
      console.error("Etherscan API error response:", errorMessage);
      return NextResponse.json({error: `Etherscan API Error: ${errorMessage}`}, {status: 500});
    }

    // Successfully fetched data, return the result array. The V2 response is in `items`.
    return NextResponse.json({result: data.items});
    
  } catch (error) {
    console.error('Error in /api/transactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
