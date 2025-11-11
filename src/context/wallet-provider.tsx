
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
import { Alchemy, Network, OwnedNft, TokenBalance, TokenMetadataResponse } from "alchemy-sdk";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface FormattedTransaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  timeStamp: number | undefined;
  type: 'Send' | 'Receive' | 'Swap';
}

interface PortfolioHistoryPoint {
  date: string;
  valueModifier: number;
}

export interface FormattedTokenBalance {
  name: string;
  symbol: string;
  balance: string;
  value: string;
  iconUrl: string | null | undefined;
  iconHint: string | null | undefined;
  contractAddress: string;
}

interface WalletContextType {
  address: string | null;
  balance: string | null;
  tokens: FormattedTokenBalance[];
  transactions: FormattedTransaction[];
  nfts: OwnedNft[];
  portfolioHistory: PortfolioHistoryPoint[];
  portfolioChange: number;
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
  const userKey = typeof window !== 'undefined' ? localStorage.getItem('etherscanApiKey') : null;
  const envKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
  const apiKey = userKey || envKey;

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.length < 30) {
    if (!userKey) {
      console.warn("Etherscan API key not found or invalid. Transaction history will not be available. Please add NEXT_PUBLIC_ETHERSCAN_API_KEY to your .env file or add your key in the settings page. You can get a free key from https://etherscan.io/myapikey.");
    }
    return null;
  }
  
  const chainIdNumber = Number(chainId);
  // Base URL for Etherscan API V2
  const baseUrl = "https://api.etherscan.io/v2";

  // Supported chains for Etherscan API
  const supportedChains = [1, 5, 11155111];
  if (!supportedChains.includes(chainIdNumber)) {
      console.warn(`Unsupported network for Etherscan: ${chainIdNumber}. Transaction history will not be available.`);
      return null;
  }

  // The V2 endpoint structure does not seem to be public. Sticking to V1 with chainid.
  return `${baseUrl}?module=account&action=txlist&sort=desc&page=1&offset=25&apikey=${apiKey}`;
}


const getAlchemy = (chainId: bigint) => {
  const userKey = typeof window !== 'undefined' ? localStorage.getItem('alchemyApiKey') : null;
  const envKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
  const apiKey = userKey || envKey;
  
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.length < 30) {
    if (!userKey) {
      console.warn("Alchemy API key not found or invalid. NFT and token data will not be available. Please add NEXT_PUBLIC_ALCHEMY_KEY to your .env file or add your key in the settings page. You can get a free key from https://alchemy.com/");
    }
    return null;
  }

  const chainIdNumber = Number(chainId);
  let network: Network;

  switch (chainIdNumber) {
    case 1:
      network = Network.ETH_MAINNET;
      break;
    case 11155111:
      network = Network.ETH_SEPOLIA;
      break;
    default:
      console.warn(`Unsupported network for Alchemy: ${chainIdNumber}. NFT and token data will not be available.`);
      return null;
  }

  return new Alchemy({ apiKey, network });
};

const fetchTransactionHistory = async (address: string, chainId: bigint): Promise<FormattedTransaction[]> => {
  const baseUrl = getEtherscanApiUrl(chainId);
  if (!baseUrl) return [];
  
  const url = `${baseUrl}&address=${address}&chainid=${Number(chainId)}`;

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
        type: tx.from.toLowerCase() === address.toLowerCase() ? 'Send' : 'Receive'
      }));
    } else {
      if (data.message === 'NOTOK') {
         console.error("Etherscan API error:", data.message, data.result);
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

const fetchTokenBalances = async (address: string, alchemy: Alchemy | null): Promise<TokenBalance[]> => {
  if (!alchemy) return [];

  try {
    const balances = await alchemy.core.getTokenBalances(address);
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
      return token.tokenBalance !== '0';
    });
    return nonZeroBalances;
  } catch (error) {
    console.error("Failed to fetch token balances from Alchemy:", error);
    return [];
  }
}

const fetchTokenMetadata = async (tokenAddresses: string[], alchemy: Alchemy | null): Promise<TokenMetadataResponse[]> => {
  if (!alchemy) return [];

  try {
    const metadata = await Promise.all(tokenAddresses.map(address => alchemy.core.getTokenMetadata(address)));
    return metadata;
  } catch (error) {
    console.error("Failed to fetch token metadata from Alchemy:", error);
    return [];
  }
}

const fetchNfts = async (address: string, alchemy: Alchemy | null): Promise<OwnedNft[]> => {
  if (!alchemy) return [];

  try {
    const nfts = await alchemy.nft.getNftsForOwner(address, {
      pageSize: 20,
    });
    return nfts.ownedNfts;
  } catch (error) {
    console.error("Failed to fetch NFTs from Alchemy:", error);
    return [];
  }
}

const createMockTransactions = (mockAddress: string): FormattedTransaction[] => {
  const now = Math.floor(Date.now() / 1000);
  const randomHex = (length: number) => "0x" + [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

  return [
    { hash: randomHex(64), from: "0xDE0B295669a9FD93d5F28D9Ec85E40f4cb697BAe", to: mockAddress, value: "1.25", timeStamp: now - (86400 * 1), type: 'Receive' },
    { hash: randomHex(64), from: mockAddress, to: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", value: "0.5", timeStamp: now - (86400 * 2), type: 'Swap' },
    { hash: randomHex(64), from: "0x1A94fce7ef36Bc9693414995b6A8A572572B4a65", to: mockAddress, value: "3.0", timeStamp: now - (86400 * 5), type: 'Receive' },
    { hash: randomHex(64), from: mockAddress, to: "0xDA9dfA130Df4dE4673b89045Cb52726Ab47283fa", value: "0.1", timeStamp: now - (86400 * 7), type: 'Send' },
    { hash: randomHex(64), from: mockAddress, to: "0x2c1ba59d6f58433fb1e1be38058b65d2944b494b", value: "2.75", timeStamp: now - (86400 * 10), type: 'Send' },
  ];
};

const createMockNfts = (): OwnedNft[] => {
  const placeholderNfts = [
    { id: "nft-1", name: "Abstract Orb" },
    { id: "nft-2", name: "Pixel Warrior" },
    { id: "nft-3", name: "Future City" },
    { id: "nft-4", name: "Generative Grid" },
  ]
  return placeholderNfts.map((pNft, i) => ({
    contract: { address: '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') },
    tokenId: (12345 + i).toString(),
    tokenType: "ERC721",
    name: pNft.name,
    description: "This is a mock NFT for demo purposes.",
    image: {
      cachedUrl: `https://picsum.photos/seed/${i+1}/300/300`,
      originalUrl: `https://picsum.photos/seed/${i+1}/300/300`,
    },
    timeLastUpdated: new Date().toISOString(),
    balance: "1",
  } as OwnedNft))
};

// Seeded random number generator
const mulberry32 = (a: number) => {
    return function() {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

const createMockPortfolioHistory = (): PortfolioHistoryPoint[] => {
  const data: PortfolioHistoryPoint[] = [];
  const today = new Date();
  const seed = 12345; // Fixed seed for deterministic results
  const random = mulberry32(seed);
  
  let lastValue = 1.0;

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Create a smoother, more realistic random walk
    const change = (random() - 0.49) * 0.05; // smaller, slightly biased change
    lastValue += change;
    if (lastValue < 0.8) lastValue = 0.8; // Prevent it from dropping too low
    if (lastValue > 1.2) lastValue = 1.2; // Prevent it from rising too high

    data.push({
      date: date.toISOString().split('T')[0],
      valueModifier: parseFloat(lastValue.toFixed(4)),
    });
  }
  return data;
};

const calculatePortfolioChange = (history: PortfolioHistoryPoint[]): number => {
  if (history.length < 2) {
    return 0;
  }
  const latestValue = history[history.length - 1].valueModifier;
  const previousValue = history[history.length - 2].valueModifier;

  if (previousValue === 0) {
    return 0;
  }

  const change = ((latestValue - previousValue) / previousValue) * 100;
  return change;
};

const mockAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // Vitalik's address for fun
const mockBalance = "12.3456";

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [tokens, setTokens] = useState<FormattedTokenBalance[]>([]);
  const [transactions, setTransactions] = useState<FormattedTransaction[]>([]);
  const [nfts, setNfts] = useState<OwnedNft[]>([]);
  const [portfolioHistory, setPortfolioHistory] = useState<PortfolioHistoryPoint[]>([]);
  const [portfolioChange, setPortfolioChange] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const clearError = useCallback(() => setError(null), []);

  const handleDisconnect = useCallback(() => {
    setAddress(null);
    setBalance(null);
    setTokens([]);
    setTransactions([]);
    setNfts([]);
    setPortfolioHistory([]);
    setPortfolioChange(0);
    if (typeof window !== "undefined") {
      localStorage.removeItem("walletAddress");
    }
    setLoading(false);
  }, []);

  const disconnectWallet = useCallback(() => {
    handleDisconnect();
    router.push("/login");
  }, [router, handleDisconnect]);

  const updateWalletState = useCallback(async (currentAddress: string, provider?: BrowserProvider) => {
    setLoading(true);
    const ethPrice = 3150; // Static price for now

    if (!ethers.isAddress(currentAddress)) {
      console.error("Attempted to update with invalid address:", currentAddress);
      handleDisconnect();
      return;
    }
    
    // Handle Demo Mode
    if (currentAddress.toLowerCase() === mockAddress.toLowerCase() && localStorage.getItem('walletAddress')?.toLowerCase() === mockAddress.toLowerCase()) {
      const mockHistory = createMockPortfolioHistory();
      const mockChange = calculatePortfolioChange(mockHistory);
      
      const ethLogo = PlaceHolderImages.find(img => img.id === 'eth-logo');
      const usdcLogo = PlaceHolderImages.find(img => img.id === 'usdc-logo');
      const wbtcLogo = PlaceHolderImages.find(img => img.id === 'wbtc-logo');
      const uniLogo = PlaceHolderImages.find(img => img.id === 'uni-logo');

      const ethToken: FormattedTokenBalance = {
          name: 'Ethereum', symbol: 'ETH', balance: parseFloat(mockBalance).toFixed(4),
          value: (parseFloat(mockBalance) * ethPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
          iconUrl: ethLogo?.imageUrl, iconHint: ethLogo?.imageHint, contractAddress: 'eth',
      };
      const demoTokens: FormattedTokenBalance[] = [
          { name: 'USD Coin', symbol: 'USDC', balance: '5,000.00', value: '$5,000.00', iconUrl: usdcLogo?.imageUrl, iconHint: usdcLogo?.imageHint, contractAddress: 'usdc' },
          { name: 'Wrapped BTC', symbol: 'WBTC', balance: '0.05', value: '$3,500.00', iconUrl: wbtcLogo?.imageUrl, iconHint: wbtcLogo?.imageHint, contractAddress: 'wbtc' },
          { name: 'Uniswap', symbol: 'UNI', balance: '250.00', value: '$2,500.00', iconUrl: uniLogo?.imageUrl, iconHint: uniLogo?.imageHint, contractAddress: 'uni' },
      ];

      setAddress(mockAddress);
      setBalance(mockBalance);
      setTransactions(createMockTransactions(mockAddress));
      setNfts(createMockNfts());
      setPortfolioHistory(mockHistory);
      setPortfolioChange(mockChange);
      setTokens([ethToken, ...demoTokens]); 
      setLoading(false);
      return;
    }

    try {
      if (!provider) {
        if (!(window as any).ethereum) throw new Error("MetaMask not detected.");
        provider = new BrowserProvider((window as any).ethereum);
      }
      
      const network = await provider.getNetwork();
      const alchemy = getAlchemy(network.chainId);
      const balanceWei = await provider.getBalance(currentAddress);
      const balanceEth = ethers.formatEther(balanceWei);
      const history = await fetchTransactionHistory(currentAddress, network.chainId);
      const userNfts = await fetchNfts(currentAddress, alchemy);
      
      const tokenBalances = await fetchTokenBalances(currentAddress, alchemy);
      const tokenMetadata = await fetchTokenMetadata(tokenBalances.map(t => t.contractAddress), alchemy);

      const ethLogo = PlaceHolderImages.find(img => img.id === 'eth-logo');
      const ethToken: FormattedTokenBalance = {
        name: 'Ethereum',
        symbol: 'ETH',
        balance: parseFloat(balanceEth).toFixed(4),
        value: (parseFloat(balanceEth) * ethPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        iconUrl: ethLogo?.imageUrl,
        iconHint: ethLogo?.imageHint,
        contractAddress: 'eth',
      };

      const formattedTokens: FormattedTokenBalance[] = tokenBalances.map((token, i) => {
        const metadata = tokenMetadata[i];
        const balance = parseFloat(token.tokenBalance!) / Math.pow(10, metadata.decimals || 18);
        return {
          name: metadata.name || 'Unknown Token',
          symbol: metadata.symbol || '???',
          balance: balance.toFixed(4),
          value: '$0.00', // Placeholder, would need price API
          iconUrl: metadata.logo,
          iconHint: `${metadata.name} logo`,
          contractAddress: token.contractAddress,
        }
      });
      
      setAddress(currentAddress);
      setBalance(balanceEth);
      setTokens([ethToken, ...formattedTokens]);
      setTransactions(history);
      setNfts(userNfts);
      // For real accounts, we clear mock data. A real implementation would fetch real historical data.
      setPortfolioHistory([]);
      setPortfolioChange(0);
      setError(null);

      if (typeof window !== "undefined") {
        localStorage.setItem("walletAddress", currentAddress);
      }
    } catch (err) {
       console.error("Failed to update wallet state:", err);
       setError("Failed to fetch wallet data. Please check your connection and ensure MetaMask is configured correctly.");
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
        await updateWalletState(accounts[0], provider);
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
    if (typeof window !== "undefined") {
      localStorage.setItem("walletAddress", mockAddress);
    }
    // We just need to call updateWalletState with the mock address
    updateWalletState(mockAddress);
    router.push('/dashboard');
  }, [router, updateWalletState]);

  useEffect(() => {
    setLoading(true);
    const storedAddress = localStorage.getItem("walletAddress");
    
    if (storedAddress && ethers.isAddress(storedAddress)) {
      updateWalletState(storedAddress);
    } else {
      handleDisconnect();
    }

    const ethereum = (window as any).ethereum;
    if (ethereum?.isMetaMask) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0 && ethers.isAddress(accounts[0])) {
          updateWalletState(accounts[0]);
        } else {
          handleDisconnect();
          router.push('/login');
        }
      };
      
      const handleChainChanged = () => {
        window.location.reload();
      };

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const value = useMemo(() => ({ 
    address, 
    balance, 
    tokens,
    transactions, 
    nfts,
    portfolioHistory,
    portfolioChange,
    loading,
    connectWallet, 
    disconnectWallet,
    startDemoMode,
    error, 
    clearError 
  }), [
    address, balance, tokens, transactions, nfts, portfolioHistory, portfolioChange,
    loading, connectWallet, disconnectWallet, startDemoMode, error, clearError
  ]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
