
'use server';

/**
 * @fileoverview A centralized service for interacting with the Etherscan API via an internal proxy.
 */

/**
 * Fetches the transaction history for a given wallet address.
 * This function calls our internal API proxy to securely handle the Etherscan API key.
 * @param {string} address The wallet address.
 * @param {string} chainId The chain ID (e.g., '1' for Mainnet, '11155111' for Sepolia).
 * @returns {Promise<any[]>} A promise that resolves to an array of transaction objects.
 */
export async function fetchTransactionHistory(address: string, chainId: string): Promise<any[]> {
  // In a server component, we need to construct the full URL.
  const host = process.env.VERCEL_URL || process.env.HOST || 'localhost:9002';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const url = `${protocol}://${host}/api/transactions?address=${address}&chainId=${chainId}`;

  try {
    // Revalidate every 60 seconds to get fresh data but also use cache.
    const response = await fetch(url, { next: { revalidate: 60 } });
    
    // Always expect a JSON response, even for errors.
    const data = await response.json();

    if (!response.ok) {
      // If response is not ok, throw the error message from the JSON body.
      throw new Error(data.error || `API request failed with status ${response.status}`);
    }

    // The API route returns the 'result' field from Etherscan's response
    if (data.result && Array.isArray(data.result)) {
        return data.result;
    } 
    
    // Handle cases where Etherscan returns status '1' but result is a string message (e.g., "No transactions found")
    if (data.status === '1' && typeof data.result === 'string') {
        console.warn("Etherscan API success with string message:", data.result);
        return [];
    }

    // Handle unexpected successful responses that don't match the expected format.
    console.warn("Unexpected response structure from /api/transactions:", data);
    return [];

  } catch (error) {
    // This catches both fetch errors (e.g., network issues) and thrown errors from non-ok responses.
    console.error("Error fetching from internal /api/transactions:", error);
    // Re-throw the error so the calling function can handle it, e.g., to show a UI message.
    throw error;
  }
}
