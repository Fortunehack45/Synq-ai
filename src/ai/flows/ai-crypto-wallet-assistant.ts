'use server';

/**
 * @fileOverview An AI chat assistant for crypto wallets that provides risk analysis and insights.
 *
 * - aiCryptoWalletAssistant - A function that handles the AI assistant flow.
 * - AICryptoWalletAssistantInput - The input type for the aiCryptoWalletAssistant function.
 * - AICryptoWalletAssistantOutput - The return type for the aiCryptoWalletAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICryptoWalletAssistantInputSchema = z.object({
  walletAddress: z.string().describe('The address of the crypto wallet to analyze.'),
  userQuery: z.string().describe('The user query or request for analysis.'),
});
export type AICryptoWalletAssistantInput = z.infer<typeof AICryptoWalletAssistantInputSchema>;

const AICryptoWalletAssistantOutputSchema = z.object({
  riskScore: z.number().describe('The risk score of the wallet (0-100).'),
  reasons: z.array(z.string()).describe('The reasons for the risk score.'),
  suggestedActions: z.array(z.string()).describe('Suggested actions for the user.'),
  citations: z.array(z.string()).describe('On-chain data citations.'),
  overallSummary: z.string().describe('Overall summary of the wallet analysis.'),
});
export type AICryptoWalletAssistantOutput = z.infer<typeof AICryptoWalletAssistantOutputSchema>;

export async function aiCryptoWalletAssistant(input: AICryptoWalletAssistantInput): Promise<AICryptoWalletAssistantOutput> {
  return aiCryptoWalletAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCryptoWalletAssistantPrompt',
  input: {schema: AICryptoWalletAssistantInputSchema},
  output: {schema: AICryptoWalletAssistantOutputSchema},
  prompt: `You are Synq.AI, a crypto wallet assistant. Use verified on-chain and social data to provide insights for wallet address: {{{walletAddress}}}.\n\nUser Query: {{{userQuery}}}\n\nOutput structured JSON with risk_score (0-100), reasons[], suggested_actions[], citations[], and overallSummary. Never hallucinate or execute transactions without user consent.  The reasons and suggested_actions should be concise.  Citations should reference the source of the insight.\n\n{
  "riskScore": 50,
  "reasons": ["Reason 1", "Reason 2"],
  "suggestedActions": ["Action 1", "Action 2"],
  "citations": ["Citation 1", "Citation 2"],
  "overallSummary": "Overall summary of the wallet analysis."
}`,
});

const aiCryptoWalletAssistantFlow = ai.defineFlow(
  {
    name: 'aiCryptoWalletAssistantFlow',
    inputSchema: AICryptoWalletAssistantInputSchema,
    outputSchema: AICryptoWalletAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
