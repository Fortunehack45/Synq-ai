
import {NextResponse} from 'next/server';
import {ethers} from 'ethers';

/**
 * API route to fetch transaction history from Etherscan API V2.
 * This acts as a secure, server-side proxy to handle the API key and avoid CORS issues.
 * It uses the POST method and Bearer Token as required by the V2 API for many modules,
 * though for txlist, GET is often still used. This implementation standardizes on the more modern
 * V2 structure where possible.
 */
export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const address = searchParams.get('address');
  const chainId = searchParams.get('chainId') || '1'; // Default to mainnet

  if (!address || !ethers.isAddress(address)) {
    return NextResponse.json({error: 'Valid wallet address is required'}, {status: 400});
  }

  // Use the server-side environment variable for the API key.
  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
  if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
    console.error('Etherscan API key not configured on the server.');
    return NextResponse.json({error: 'Server API service is not configured.'}, {status: 500});
  }
  
  // Etherscan's 'account' module actions like 'txlist' still work reliably with GET,
  // which avoids potential complexities with networks or firewalls blocking POST.
  // We will stick to the documented V1/V2-compatible GET request for this specific action.
  const getApiSubdomain = (id: string) => {
    switch (id) {
      case '11155111': return 'api-sepolia';
      case '1': return 'api';
      default: return 'api';
    }
  }
  
  const apiSubdomain = getApiSubdomain(chainId);
  const url = `https://${apiSubdomain}.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=25&sort=desc&apikey=${apiKey}`;
  
  try {
    const response = await fetch(url);

    if (!response.ok) {
       const errorText = await response.text();
       console.error(`Etherscan API request failed with status ${response.status}: ${errorText}`);
       return NextResponse.json({error: `Etherscan API request failed: ${errorText}`}, {status: response.status});
    }

    const data = await response.json();
    
    // Etherscan returns status "0" for errors, with the specific error message in `result` or `message`.
    if (data.status !== '1') {
      const errorMessage = data.result || data.message || 'An unknown Etherscan API error occurred.';
      console.error("Etherscan API error response:", errorMessage);
      return NextResponse.json({error: `Etherscan API Error: ${errorMessage}`}, {status: 500});
    }

    // Successfully fetched data, return the result.
    return NextResponse.json({result: data.result});
    
  } catch (error) {
    console.error('Error in /api/transactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
