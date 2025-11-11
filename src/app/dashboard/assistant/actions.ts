'use server'

import { aiCryptoWalletAssistant, AICryptoWalletAssistantInput, AICryptoWalletAssistantOutput } from '@/ai/flows/ai-crypto-wallet-assistant';

export type WalletAnalysisState = {
  success: boolean;
  data?: AICryptoWalletAssistantOutput;
  error?: string;
}

export async function getWalletAnalysis(
  prevState: WalletAnalysisState,
  formData: FormData
): Promise<WalletAnalysisState> {
  const input = {
    walletAddress: formData.get('walletAddress') as string,
    userQuery: formData.get('userQuery') as string,
  };

  if (!input.walletAddress || !input.userQuery) {
    return { success: false, error: 'Wallet address and query are required.' };
  }

  try {
    const result = await aiCryptoWalletAssistant(input);
    if (!result) {
      // This happens if the model doesn't return valid JSON or has another output issue.
      return { success: false, error: 'The AI model failed to return a valid analysis. Please try again.' };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to get wallet analysis: ${errorMessage}` };
  }
}
