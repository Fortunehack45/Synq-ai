"use client";

import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { ethers, BrowserProvider } from "ethers";

interface FormattedTransaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  timeStamp: number | undefined;
}

interface WalletContextType {
  address: string | null;
  balance: string | null;
  transactions: FormattedTransaction[];
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  error: string | null;
  clearError: () => void;
}

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

const getEtherscanApiUrl = (chainId: bigint): string | null => {
  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.length < 30) {
    console.warn("Etherscan API key not found or invalid. Transaction history will not be available. Please add NEXT_PUBLIC_ETHERSCAN_API_KEY to your .env file. You can get a free key from https://etherscan.io/myapikey.");
    return null;
  }

  const chainIdNumber = Number(chainId);
  let baseUrl: string | null = null;

  switch (chainIdNumber) {
    case 1: // Mainnet
      baseUrl = "https://api.etherscan.io";
      break;
    case 11155111: // Sepolia
      baseUrl = "https://api-sepolia.etherscan.io";
      break;
    case 5: // Goerli
      baseUrl = "https://api-goerli.etherscan.io";
      break;
    default:
      console.warn(`Unsupported network for Etherscan: ${chainIdNumber}. Transaction history will not be available.`);
      return null;
  }
  return `${baseUrl}/api?module=account&action=txlist&sort=desc&page=1&offset=25&apikey=${apiKey}`;
}

const fetchTransactionHistory = async (address: string, chainId: bigint): Promise<FormattedTransaction[]> => {
  const apiUrl = getEtherscanApiUrl(chainId);
  if (!apiUrl) return [];
  
  const url = `${apiUrl}&address=${address}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Etherscan API request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data.status === "1") {
      return data.result.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value),
        timeStamp: parseInt(tx.timeStamp, 10),
      }));
    } else {
      if (data.message === 'NOTOK' && data.result?.includes('Invalid API Key')) {
         console.error("Etherscan API error: Invalid API Key. Please ensure NEXT_PUBLIC_ETHERSCAN_API_KEY is set correctly in your .env file.");
      } else {
         console.error("Etherscan API error:", data.message, data.result);
      }
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch transaction history from Etherscan:", error);
    return [];
  }
};


export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<FormattedTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = useCallback(() => setError(null), []);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setBalance(null);
    setTransactions([]);
    if (typeof window !== "undefined") {
      // Optional: Clear any session-related data if needed
    }
    router.push("/login");
  }, [router]);

  const updateWalletState = useCallback(async (currentAddress: string) => {
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const network = await provider.getNetwork();
      const balanceWei = await provider.getBalance(currentAddress);
      const history = await fetchTransactionHistory(currentAddress, network.chainId);
      
      setAddress(currentAddress);
      setBalance(ethers.formatEther(balanceWei));
      setTransactions(history);
      setError(null);
    } catch (err) {
       console.error("Failed to update wallet state:", err);
       setError("Failed to fetch wallet data.");
       // Disconnect if we can't get basic data, as the state is inconsistent
       disconnectWallet();
    }
  }, [disconnectWallet]);


  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      setError("MetaMask not detected. Please install the extension.");
      return;
    }
    
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts && accounts.length > 0) {
        await updateWalletState(accounts[0]);
      } else {
        setError("No accounts found. Please connect an account in MetaMask.");
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError("Connection rejected by user.");
      } else {
        console.error("Failed to connect to MetaMask:", err);
        setError("Failed to connect to MetaMask.");
      }
    }
  }, [updateWalletState]);

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (ethereum?.isMetaMask) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // Re-fetch all data for the new account
          updateWalletState(accounts[0]);
        } else {
          // User has disconnected all accounts in MetaMask
          disconnectWallet();
        }
      };
      
      const handleChainChanged = () => {
        // Reload to re-initialize with the new network
        window.location.reload();
      };

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);
      
      // Check for existing connection on initial load
      const checkInitialConnection = async () => {
        try {
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await updateWalletState(accounts[0]);
          }
        } catch (err) {
          console.error("Failed to check initial MetaMask connection:", err);
        }
      };

      checkInitialConnection();

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [updateWalletState, disconnectWallet]);

  const value = useMemo(() => ({ 
    address, 
    balance, 
    transactions, 
    connectWallet, 
    disconnectWallet, 
    error, 
    clearError 
  }), [address, balance, transactions, connectWallet, disconnectWallet, error, clearError]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
