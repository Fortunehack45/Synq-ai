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
  loading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  startDemoMode: () => void;
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

const createMockTransactions = (mockAddress: string): FormattedTransaction[] => {
  const now = Math.floor(Date.now() / 1000);
  return [
    {
      hash: "0x" + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      from: "0xDE0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
      to: mockAddress,
      value: "1.25",
      timeStamp: now - (86400 * 1), // 1 day ago
    },
    {
      hash: "0x" + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      from: mockAddress,
      to: "0x4E3529242b435342d5A6B5377519685A59440533",
      value: "0.5",
      timeStamp: now - (86400 * 2), // 2 days ago
    },
     {
      hash: "0x" + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      from: "0x1A94fce7ef36Bc9693414995b6A8A572572B4a65",
      to: mockAddress,
      value: "3.0",
      timeStamp: now - (86400 * 5), // 5 days ago
    },
    {
      hash: "0x" + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      from: mockAddress,
      to: "0xDA9dfA130Df4dE4673b89045Cb52726Ab47283fa",
      value: "0.1",
      timeStamp: now - (86400 * 7), // 1 week ago
    },
     {
      hash: "0x" + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      from: mockAddress,
      to: "0x2c1ba59d6f58433fb1e1be38058b65d2944b494b",
      value: "2.75",
      timeStamp: now - (86400 * 10), // 10 days ago
    },
  ];
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<FormattedTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const clearError = useCallback(() => setError(null), []);

  const handleDisconnect = useCallback(() => {
    setAddress(null);
    setBalance(null);
    setTransactions([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("walletAddress");
    }
    setLoading(false);
  }, []);

  const disconnectWallet = useCallback(() => {
    handleDisconnect();
    router.push("/login");
  }, [router, handleDisconnect]);

  const updateWalletState = useCallback(async (currentAddress: string) => {
    setLoading(true);
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const network = await provider.getNetwork();
      const balanceWei = await provider.getBalance(currentAddress);
      const history = await fetchTransactionHistory(currentAddress, network.chainId);
      
      setAddress(currentAddress);
      setBalance(ethers.formatEther(balanceWei));
      setTransactions(history);
      setError(null);
      if (typeof window !== "undefined") {
        localStorage.setItem("walletAddress", currentAddress);
      }
    } catch (err) {
       console.error("Failed to update wallet state:", err);
       setError("Failed to fetch wallet data.");
       handleDisconnect();
    } finally {
      setLoading(false);
    }
  }, [handleDisconnect]);


  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      setError("MetaMask not detected. Please install the extension.");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts && accounts.length > 0) {
        await updateWalletState(accounts[0]);
      } else {
        setError("No accounts found. Please connect an account in MetaMask.");
        setLoading(false);
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError("Connection rejected by user.");
      } else {
        console.error("Failed to connect to MetaMask:", err);
        setError("Failed to connect to MetaMask.");
      }
      setLoading(false);
    }
  }, [updateWalletState]);

   const startDemoMode = useCallback(() => {
    setLoading(true);
    const mockAddress = "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12";
    const mockBalance = "12.3456";
    const mockTransactions = createMockTransactions(mockAddress);
    
    setAddress(mockAddress);
    setBalance(mockBalance);
    setTransactions(mockTransactions);
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.setItem("walletAddress", mockAddress);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (ethereum?.isMetaMask) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          updateWalletState(accounts[0]);
        } else {
          handleDisconnect();
        }
      };
      
      const handleChainChanged = () => {
        window.location.reload();
      };

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);
      
      const checkInitialConnection = async () => {
        const storedAddress = localStorage.getItem("walletAddress");
        try {
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0 && accounts[0] === storedAddress) {
            await updateWalletState(accounts[0]);
          } else {
            handleDisconnect();
          }
        } catch (err) {
          console.error("Failed to check initial MetaMask connection:", err);
          handleDisconnect();
        }
      };

      checkInitialConnection();

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    } else {
       handleDisconnect();
    }
  }, [updateWalletState, handleDisconnect]);

  const value = useMemo(() => ({ 
    address, 
    balance, 
    transactions, 
    loading,
    connectWallet, 
    disconnectWallet,
    startDemoMode,
    error, 
    clearError 
  }), [address, balance, transactions, loading, connectWallet, disconnectWallet, startDemoMode, error, clearError]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
