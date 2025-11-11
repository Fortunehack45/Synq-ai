# SynqAI - Your Secure AI Crypto Wallet Assistant

SynqAI is a next-generation web application designed to demystify the world of cryptocurrency wallet management. It provides a secure, intuitive, and AI-powered dashboard to help users analyze wallet activity, assess risks, and gain actionable insights into their on-chain assets.

## The Problem: Crypto is Complex and Risky

For both new and experienced users, managing a crypto wallet can be a daunting task. The space is filled with challenges:

*   **Information Overload**: Block explorers like Etherscan are powerful but overwhelming, presenting a wall of hashes and addresses that are difficult to decipher.
*   **Hidden Risks**: It's hard to know if a wallet has interacted with malicious smart contracts, holds scam tokens, or is at risk of being compromised.
*   **Lack of Clarity**: Understanding your true portfolio value, tracking performance, and monitoring transactions requires multiple tools and significant effort.
*   **Opaque Smart Contracts**: Interacting with DeFi protocols often means trusting complex, unverified smart contracts without fully understanding their function.

## The Solution: AI-Powered Clarity and Security

SynqAI tackles these problems head-on by combining a sleek, user-friendly interface with a powerful generative AI engine. Our platform connects to your wallet and transforms raw, confusing on-chain data into clear, actionable intelligence.

**SynqAI is the best-in-class wallet analysis tool because it doesn't just show you *what* is in your wallet; it helps you understand *what it means*.** Our AI provides a level of risk assessment and contextual insight that no standard wallet or portfolio tracker can offer.

## Key Features

*   **Unified Dashboard**: View your ETH balance, ERC-20 tokens, and NFTs in one clean, organized interface.
*   **AI Wallet Assistant**: Our flagship feature. Simply enter any wallet address and receive a comprehensive security and activity analysis, including:
    *   **Risk Score (0-100)**: A simple metric to gauge wallet safety.
    *   **Actionable Insights**: Clear, bullet-pointed reasons for the score and suggested actions to improve security.
    *   **On-Chain Citations**: The AI cites the specific transactions and token balances it used for its analysis, providing full transparency.
*   **Transaction History**: A simplified, human-readable list of your most recent transactions.
*   **Asset Management**: See all your tokens and NFTs, complete with their official logos and values.
*   **Secure and Private**: SynqAI operates in a read-only mode. It never asks for your private keys or seed phrase. You are always in full control of your assets.

## Getting Started

This is a Next.js project bootstrapped with `create-next-app`.

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Fortunehack45/Synq-ai.git
    cd Synq-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your API keys. You can get free keys from [Alchemy](https://alchemy.com/) and [Etherscan](https://etherscan.io/myapikey).
    ```
    NEXT_PUBLIC_ALCHEMY_KEY="YOUR_ALCHEMY_API_KEY"
    NEXT_PUBLIC_ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result. You can start editing the page by modifying `src/app/page.tsx`.
