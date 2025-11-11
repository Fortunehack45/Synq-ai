'use server';

/**
 * @fileOverview An AI chat assistant for crypto wallets that provides risk analysis and insights.
 *
 * - aiCryptoWalletAssistant - A function that handles the AI assistant flow.
 * - AICryptoWalletAssistantInput - The input type for the aiCryptoWalletAssistant function.
 * - AICryptoWallet-WalletAnalysis - The return type for the aiCryptoWalletAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getWalletBalance, getWalletTransactions, getWalletTokenBalances } from '@/services/onchain-data';
import { AICryptoWalletAssistantOutputSchema } from '../schemas/ai-crypto-wallet-assistant-schema';

const getBalanceTool = ai.defineTool(
  {
    name: 'getWalletBalance',
    description: 'Get the native ETH balance of a wallet address.',
    inputSchema: z.object({
      address: z.string().describe('The wallet address.'),
    }),
    outputSchema: z.string(),
  },
  async ({ address }) => {
    return getWalletBalance(address);
  }
);

const getTransactionsTool = ai.defineTool(
  {
    name: 'getWalletTransactions',
    description: 'Get the 10 most recent transactions for a wallet address.',
    inputSchema: z.object({
      address: z.string().describe('The wallet address.'),
    }),
    outputSchema: z.any(),
  },
  async ({ address }) => {
    return JSON.stringify(await getWalletTransactions(address));
  }
);

const getTokenBalancesTool = ai.defineTool(
  {
    name: 'getWalletTokenBalances',
    description: 'Get the ERC20 token balances for a wallet address.',
    inputSchema: z.object({
      address: z.string().describe('The wallet address.'),
    }),
    outputSchema: z.any(),
  },
  async ({ address }) => {
    return JSON.stringify(await getWalletTokenBalances(address));
  }
);


const AICryptoWalletAssistantInputSchema = z.object({
  walletAddress: z.string().describe('The address of the crypto wallet to analyze.'),
  userQuery: z.string().describe('The user query or request for analysis.'),
});
export type AICryptoWalletAssistantInput = z.infer<typeof AICryptoWalletAssistantInputSchema>;
export type AICryptoWalletAssistantOutput = z.infer<typeof AICryptoWalletAssistantOutputSchema>;

const mockDemoAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const mockAnalysis: AICryptoWalletAssistantOutput = {
  riskScore: 25,
  reasons: [
    "The wallet holds a diverse portfolio of well-established tokens (ETH, WBTC, USDC).",
    "Transaction history shows interaction with reputable protocols like Uniswap.",
    "No interactions with known scam contracts or phishing addresses were detected in the recent activity.",
    "There are no large, unexplained outflows to high-risk exchanges or unverified addresses."
  ],
  suggestedActions: [
    "Regularly review token approvals and revoke access to old or unused dApps.",
    "Consider using a hardware wallet for storing a significant portion of assets for enhanced security.",
    "Bookmark trusted dApp frontends to avoid phishing links."
  ],
  citations: [
    "Token Balance: 12.3456 ETH",
    "Token Balance: 5,000.00 USDC",
    "Transaction: Swap 0.5 ETH for USDC on Uniswap V2 Router",
    "Transaction: Received 3.0 ETH from 0x1A94...a65"
  ],
  overallSummary: "This wallet demonstrates behavior consistent with an experienced crypto user. It maintains a healthy balance of assets and interacts with well-known DeFi protocols. The risk profile is low, but standard security practices should always be maintained."
};


export async function aiCryptoWalletAssistant(input: AICryptoWalletAssistantInput): Promise<AICryptoWalletAssistantOutput> {
  if (input.walletAddress.toLowerCase() === mockDemoAddress.toLowerCase()) {
    // For the demo account, return a pre-canned realistic analysis.
    return new Promise(resolve => setTimeout(() => resolve(mockAnalysis), 1500));
  }
  return aiCryptoWalletAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCryptoWalletAssistantPrompt',
  input: { schema: AICryptoWalletAssistantInputSchema },
  output: { schema: AICryptoWalletAssistantOutputSchema },
  tools: [getBalanceTool, getTransactionsTool, getTokenBalancesTool],
  prompt: `You are Synq.AI, an expert crypto wallet analyst. Your role is to provide a clear, concise, and accurate risk assessment of the provided wallet address based on on-chain data.

User Query: "{{userQuery}}"
Wallet Address: "{{walletAddress}}"

Instructions:
1.  Use the available tools to fetch the wallet's balance, recent transactions, and token holdings.
2.  Analyze the data to identify potential risks and noteworthy activities. Consider factors like:
    - Transaction frequency and volume.
    - Interactions with known risky or malicious contracts (if identifiable from data).
    - Holdings of suspicious or spam tokens.
    - Large inflows or outflows.
    - Age of the wallet and its activity patterns.
3.  Calculate a risk score from 0 (very low risk) to 100 (very high risk).
4.  Provide a few clear, bullet-pointed reasons for your assigned risk score.
5.  Suggest 2-3 actionable steps the user could take to mitigate risks.
6.  List any on-chain data points you used as citations for your analysis.
7.  Provide a brief, professional overall summary.

Output the final analysis in the specified JSON format. Do not add any commentary outside of the JSON structure.`,
});

const aiCryptoWalletAssistantFlow = ai.defineFlow(
  {
    name: 'aiCryptoWalletAssistantFlow',
    inputSchema: AICryptoWalletAssistantInputSchema,
    outputSchema: AICryptoWalletAssistantOutputSchema,
  },
  async input => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are Synq.AI, an expert crypto wallet analyst. Your role is to provide a clear, concise, and accurate risk assessment of the provided wallet address based on on-chain data.

User Query: "${input.userQuery}"
Wallet Address: "${input.walletAddress}"

Instructions:
1.  Use the available tools to fetch the wallet's balance, recent transactions, and token holdings.
2.  Analyze the data to identify potential risks and noteworthy activities. Consider factors like:
    - Transaction frequency and volume.
    - Interactions with known risky or malicious contracts (if identifiable from data).
    - Holdings of suspicious or spam tokens.
    - Large inflows or outflows.
    - Age of the wallet and its activity patterns.
3.  Calculate a risk score from 0 (very low risk) to 100 (very high risk).
4.  Provide a few clear, bullet-pointed reasons for your assigned risk score.
5.  Suggest 2-3 actionable steps the user could take to mitigate risks.
6.  List any on-chain data points you used as citations for your analysis.
7.  Provide a brief, professional overall summary.

Output the final analysis in the specified JSON format. Do not add any commentary outside of the JSON structure.`,
      tools: [getBalanceTool, getTransactionsTool, getTokenBalancesTool],
      output: {
        format: 'json',
        schema: AICryptoWalletAssistantOutputSchema,
      },
    });

    const output = llmResponse.output();
    if (!output) {
      throw new Error('The AI model did not return a valid analysis.');
    }
    return output;
  }
);
