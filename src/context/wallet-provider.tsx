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
import { ethers, BrowserProvider, JsonRpcProvider } from "ethers";

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
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    console.warn("Etherscan API key not found. Please add NEXT_PUBLIC_ETHERSCAN_API_KEY to your .env.local file to fetch transaction history. You can get a free key from https://etherscan.io/myapikey.");
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
         console.error("Etherscan API error: Invalid API Key. Please ensure NEXT_PUBLIC_ETHERSCAN_API_KEY is set correctly in your .env.local file.");
      } else {
         console.error("Etherscan API error:", data.message, data.result);
      }
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch from Etherscan:", error);
    return [];
  }
};


export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<FormattedTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getEthereum = useCallback(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      return (window as any).ethereum;
    }
    return null;
  }, []);
  
  const jsonRpcProvider = useMemo(() => new JsonRpcProvider("https://ethereum.publicnode.com"), []);

  const updateWalletState = useCallback(async (currentAddress: string | null) => {
    if (!currentAddress) {
      setAddress(null);
      setBalance(null);
      setTransactions([]);
      return;
    }

    try {
      const ethereum = getEthereum();
      if (!ethereum) {
        setError("MetaMask not detected.");
        return;
      };

      const provider = new BrowserProvider(ethereum);
      const network = await provider.getNetwork();
      
      const balanceWei = await jsonRpcProvider.getBalance(currentAddress);
      const history = await fetchTransactionHistory(currentAddress, network.chainId);
      
      setAddress(currentAddress);
      setBalance(ethers.formatEther(balanceWei));
      setTransactions(history);
      setError(null);
    } catch (e: any) {
      console.error("Error updating wallet state:", e);
       if (e.code === -32002 || (e.error && e.error.code === -32002) ) {
           setError("Too many requests sent to the network. Please wait a moment and try again.");
      } else {
          setError("Could not fetch wallet data. Check the console for more details.");
      }
    }
  }, [getEthereum, jsonRpcProvider]);
  
  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      const newAddress = accounts.length > 0 ? accounts[0] : null;
      if (newAddress) {
        updateWalletState(newAddress);
      } else {
        setAddress(null);
        setBalance(null);
        setTransactions([]);
        router.push("/login");
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    const checkInitialConnection = async () => {
      try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await updateWalletState(accounts[0]);
        }
      } catch (err) {
        console.error("Failed to check initial connection:", err);
      }
    };

    checkInitialConnection();

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [getEthereum, router, updateWalletState]);

  const connectWallet = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      setError("MetaMask not detected. Please install the extension.");
      return;
    }

    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        await updateWalletState(accounts[0]);
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError("Connection rejected by user.");
      } else {
        setError("Failed to connect to MetaMask.");
      }
      console.error("Connection error:", err);
    }
  }, [getEthereum, updateWalletState]);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setBalance(null);
    setTransactions([]);
    router.push("/login");
  }, [router]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
