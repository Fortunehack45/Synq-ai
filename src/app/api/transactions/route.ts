
import {NextResponse} from 'next/server';
import {ethers} from 'ethers';

/**
 * API route to fetch transaction history from Etherscan.
 * This acts as a server-side proxy to securely handle the API key and avoid CORS issues.
 * This function correctly uses a GET request as required by the 'account' module's 'txlist' action.
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
  const url = `https://${apiSubdomain}.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=25&sort=desc&apikey=${apiKey}`;
  
  try {
    const response = await fetch(url);

    if (!response.ok) {
       const errorText = await response.text();
       console.error(`Etherscan API request failed with status ${response.status}: ${errorText}`);
       return NextResponse.json({error: `Etherscan API request failed: ${errorText}`}, {status: response.status});
    }

    const data = await response.json();

    if (data.status !== '1') {
      // Etherscan returns status "0" for errors, with the specific error message in the `result` field.
      const errorMessage = data.result || data.message || 'An unknown Etherscan API error occurred.';
      console.error("Etherscan API error response:", errorMessage);
      return NextResponse.json({error: `Etherscan API Error: ${errorMessage}`}, {status: 500});
    }

    // Successfully fetched data
    return NextResponse.json({result: data.result});
    
  } catch (error) {
    console.error('Error in /api/transactions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
