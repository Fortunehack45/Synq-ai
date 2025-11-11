'use server'

import { aiCryptoWalletAssistant, AICryptoWalletAssistantInput } from '@/ai/flows/ai-crypto-wallet-assistant';

export async function getWalletAnalysis(prevState: any, formData: FormData) {
  const input = {
    walletAddress: formData.get('walletAddress') as string,
    userQuery: formData.get('userQuery') as string,
  };

  if (!input.walletAddress || !input.userQuery) {
    return { success: false, error: 'Wallet address and query are required.' };
  }

  try {
    const result = await aiCryptoWalletAssistant(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to get wallet analysis: ${errorMessage}` };
  }
}
