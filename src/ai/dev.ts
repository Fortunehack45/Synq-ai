import { config } from 'dotenv';
config();

import '@/ai/flows/ai-crypto-wallet-assistant.ts';
import '@/ai/flows/smart-contract-summary.ts';
import '@/services/onchain-data.ts';
import '@/ai/schemas/ai-crypto-wallet-assistant-schema.ts';
