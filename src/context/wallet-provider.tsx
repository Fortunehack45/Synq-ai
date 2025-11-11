"use client";

import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ethers, TransactionResponse, Block } from "ethers";

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

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<FormattedTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getProvider = () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      return new ethers.BrowserProvider((window as any).ethereum);
    }
    return null;
  };
  
  const getEthereum = () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      return (window as any).ethereum;
    }
    return null;
  };

  const updateWalletState = useCallback(async (currentAddress: string) => {
    const provider = getProvider();
    if (provider && currentAddress) {
      try {
        const balanceWei = await provider.getBalance(currentAddress);
        setBalance(ethers.formatEther(balanceWei));

        const blockNumber = await provider.getBlockNumber();
        const txs: FormattedTransaction[] = [];
        
        // Fetch last 10 blocks for recent transactions.
        // This is not a complete history. For that, an API like Etherscan is needed.
        for (let i = 0; i < 10 && blockNumber - i >= 0; i++) {
          const block = await provider.getBlock(blockNumber - i, true);
          if (block) {
            for (const tx of block.prefetchedTransactions) {
              if (tx.from === currentAddress || tx.to === currentAddress) {
                 txs.push({
                   hash: tx.hash,
                   from: tx.from,
                   to: tx.to,
                   value: ethers.formatEther(tx.value),
                   timeStamp: block.timestamp,
                 });
              }
            }
          }
        }
        setTransactions(txs);
        
      } catch (e) {
        console.error("Error fetching wallet data:", e);
        setError("Could not fetch wallet data.");
      }
    }
  }, []);

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      setAddress(null);
      setBalance(null);
      setTransactions([]);
      router.push("/login");
    } else {
      const newAddress = accounts[0];
      setAddress(newAddress);
      updateWalletState(newAddress);
    }
  }, [router, updateWalletState]);
  
  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    const ethereum = getEthereum();
    if (ethereum) {
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);
      
      const checkConnection = async () => {
        try {
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const currentAddress = accounts[0];
            setAddress(currentAddress);
            updateWalletState(currentAddress);
          }
        } catch (err: any) {
          console.error("Failed to check accounts", err)
        }
      };
      checkConnection();

      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [handleAccountsChanged, handleChainChanged, updateWalletState]);

  const connectWallet = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      setError("MetaMask not detected. Please install the extension.");
      return;
    }

    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        const newAddress = accounts[0];
        setAddress(newAddress);
        updateWalletState(newAddress);
        setError(null);
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
