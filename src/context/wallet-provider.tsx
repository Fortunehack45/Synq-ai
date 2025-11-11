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

const fetchTransactionHistory = async (address: string): Promise<FormattedTransaction[]> => {
  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    console.warn("Etherscan API key is not configured. Transaction history will be empty.");
    return [];
  }
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&page=1&offset=25&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
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
      console.error("Etherscan API error:", data.message);
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

  const getEthereum = () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      return (window as any).ethereum;
    }
    return null;
  };
  
  const jsonRpcProvider = useMemo(() => {
    return new JsonRpcProvider("https://ethereum.publicnode.com");
  }, []);

  const updateWalletState = useCallback(async (currentAddress: string) => {
    if (!currentAddress) return;
    try {
      const balanceWei = await jsonRpcProvider.getBalance(currentAddress);
      const history = await fetchTransactionHistory(currentAddress);
      
      setAddress(currentAddress);
      setBalance(ethers.formatEther(balanceWei));
      setTransactions(history);
      setError(null);
    } catch (e: any) {
      console.error("Error fetching wallet data:", e);
      if (e.code === -32002 || (e.error && e.error.code === -32002) ) {
           setError("Too many requests sent to the network. Please wait a moment and try again.");
      } else {
          setError("Could not fetch wallet data.");
      }
    }
  }, [jsonRpcProvider]);
  
  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(null);
          setBalance(null);
          setTransactions([]);
          router.push("/login");
        } else if (accounts[0] !== address) {
          updateWalletState(accounts[0]);
        }
    };

    const handleChainChanged = () => {
        window.location.reload();
    };

    const checkInitialConnection = async () => {
      try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0 && accounts[0] !== address) {
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
  }, [router, updateWalletState, address]);

  const connectWallet = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      setError("MetaMask not detected. Please install the extension.");
      return;
    }

    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        await updateWalletState(accounts[0]);
      } else {
         setError("No accounts found. Please create an account in MetaMask.");
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError("Connection rejected by user.");
      } else {
        setError("An error occurred while connecting to MetaMask.");
      }
      console.error("Connection error:", err);
    }
  }, [updateWalletState]);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setBalance(null);
    setTransactions([]);
    router.push("/login");
  }, [router]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{ address, balance, transactions, connectWallet, disconnectWallet, error, clearError }}
    >
      {children}
    </WalletContext.Provider>
  );
};
