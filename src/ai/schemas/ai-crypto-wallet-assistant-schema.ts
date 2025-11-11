import { z } from 'genkit';

export const AICryptoWalletAssistantOutputSchema = z.object({
  riskScore: z.number().describe('The risk score of the wallet (0-100). 0 is very low risk, 100 is very high risk.'),
  reasons: z.array(z.string()).describe('A list of 2-4 concise reasons explaining the risk score, based on on-chain data.'),
  suggestedActions: z.array(z.string()).describe('A list of 2-3 suggested actions for the user to mitigate risks.'),
  citations: z.array(z.string()).describe('A list of specific on-chain data points (like transaction hashes or token names) used for the analysis.'),
  overallSummary: z.string().describe('A brief, professional overall summary of the wallet analysis.'),
});
