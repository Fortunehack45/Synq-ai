'use server';

/**
 * @fileOverview Summarizes a smart contract in plain English, highlighting key functionalities and risks.
 *
 * - summarizeSmartContract - A function that takes a smart contract address and returns a summary.
 * - SmartContractSummaryInput - The input type for the summarizeSmartContract function.
 * - SmartContractSummaryOutput - The return type for the summarizeSmartContract function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartContractSummaryInputSchema = z.object({
  contractAddress: z.string().describe('The address of the smart contract to summarize.'),
});
export type SmartContractSummaryInput = z.infer<typeof SmartContractSummaryInputSchema>;

const SmartContractSummaryOutputSchema = z.object({
  summary: z.string().describe('A plain English summary of the smart contract.'),
  ownerOnlyFunctions: z.string().describe('A summary of owner-only functions.'),
  mintBurnPermissions: z.string().describe('A summary of mint and burn permissions.'),
  transferRestrictions: z.string().describe('A summary of transfer restrictions.'),
  riskAssessment: z.enum(['Low', 'Medium', 'High']).describe('A risk assessment of the smart contract.'),
});
export type SmartContractSummaryOutput = z.infer<typeof SmartContractSummaryOutputSchema>;

export async function summarizeSmartContract(input: SmartContractSummaryInput): Promise<SmartContractSummaryOutput> {
  return smartContractSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartContractSummaryPrompt',
  input: {schema: SmartContractSummaryInputSchema},
  output: {schema: SmartContractSummaryOutputSchema},
  prompt: `You are an expert smart contract analyst. You will summarize the smart contract at address {{{contractAddress}}} in plain English. Identify owner-only functions, mint/burn permissions, transfer restrictions, and provide an overall risk assessment (Low, Medium, or High).

Summary:
{{output.summary}}

Owner-Only Functions:
{{output.ownerOnlyFunctions}}

Mint/Burn Permissions:
{{output.mintBurnPermissions}}

Transfer Restrictions:
{{output.transferRestrictions}}

Risk Assessment:
{{output.riskAssessment}}`,
});

const smartContractSummaryFlow = ai.defineFlow(
  {
    name: 'smartContractSummaryFlow',
    inputSchema: SmartContractSummaryInputSchema,
    outputSchema: SmartContractSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
