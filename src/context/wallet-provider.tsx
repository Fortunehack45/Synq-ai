"use client";

import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface WalletContextType {
  address: string | null;
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getEthereum = () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      return (window as any).ethereum;
    }
    return null;
  };

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      setAddress(null);
      router.push("/login");
    } else {
      setAddress(accounts[0]);
    }
  }, [router]);
  
  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    const ethereum = getEthereum();
    if (ethereum) {
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);
      
      // Check for existing connection
      ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
          }
        })
        .catch((err: any) => console.error("Failed to check accounts", err));

      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [handleAccountsChanged, handleChainChanged]);

  const connectWallet = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      setError("MetaMask not detected. Please install the extension.");
      return;
    }

    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
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
  }, []);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    // Note: True disconnection requires more than just clearing state,
    // but for this app's flow, this is sufficient to require reconnection.
    router.push("/login");
  }, [router]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{ address, connectWallet, disconnectWallet, error, clearError }}
    >
      {children}
    </WalletContext.Provider>
  );
};
