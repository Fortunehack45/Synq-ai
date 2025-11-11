'use server'

import { summarizeSmartContract, SmartContractSummaryInput, SmartContractSummaryOutput } from '@/ai/flows/smart-contract-summary';

export type CoinScanState = {
  success: boolean;
  data?: SmartContractSummaryOutput;
  error?: string;
}

export async function getContractAnalysis(
  prevState: CoinScanState,
  formData: FormData
): Promise<CoinScanState> {
  const input = {
    contractAddress: formData.get('contractAddress') as string,
  };

  if (!input.contractAddress) {
    return { success: false, error: 'Contract address is required.' };
  }

  // A basic regex for Ethereum addresses
  if (!/^0x[a-fA-F0-9]{40}$/.test(input.contractAddress)) {
    return { success: false, error: 'Please enter a valid Ethereum address.' };
  }


  try {
    const result = await summarizeSmartContract(input);
    if (!result) {
      return { success: false, error: 'The AI model failed to return a valid analysis. The contract may be unverified or complex.' };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to get contract analysis: ${errorMessage}` };
  }
}
