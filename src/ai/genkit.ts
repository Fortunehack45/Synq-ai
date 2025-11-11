import {genkit, type GenkitError} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  defaultGenerationConfig: {
    // Disabling the safety settings for the demo.
    // This is not recommended for production apps.
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  // When the model returns an error, it will be thrown as an error
  // with a status code.
  errorHandler: (err: any) => {
    if (err.response?.candidates?.[0]?.finishReason === 'SAFETY') {
      const e = new Error(
        'Temporarily unable to generate content. Please try again.'
      );
      (e as any).status = 'INVALID_ARGUMENT' as GenkitError['status'];
      return e;
    }
  },
  // Log all errors to the console.
  logLevel: 'debug',
  // By default, Genkit will try to buffer all logs and write them to a file.
  // We want all logs to be written to the console.
  enableTracing: false,
});
