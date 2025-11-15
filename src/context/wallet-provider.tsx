
"use client";

import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { ethers, BrowserProvider } from "ethers";
import { Alchemy, Network, OwnedNft, TokenBalance, TokenMetadataResponse } from "alchemy-sdk";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { toast } from "@/hooks/use-toast";

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
  value: number;
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
  setAddress: Dispatch<SetStateAction<string | null>>;
}

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

const getAlchemy = (chainId: bigint) => {
    const userKey = typeof window !== 'undefined' ? localStorage.getItem('alchemyApiKey') : null;
    const envKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
    const apiKey = userKey || envKey;

    if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.length < 30) {
        if (!userKey) {
        console.warn("Alchemy API key not found or invalid. Some features may not be available.");
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
        console.warn(`Unsupported network for Alchemy: ${chainIdNumber}.`);
        return null;
    }

    return new Alchemy({ apiKey, network });
};

const fetchTransactionHistory = async (address: string, chainId: bigint): Promise<FormattedTransaction[]> => {
  const url = `/api/transactions?address=${address}&chainId=${String(chainId)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || `API request failed with status ${response.status}`);
    }

    if (data.result && Array.isArray(data.result)) {
      return data.result.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value),
        timeStamp: tx.timeStamp ? parseInt(tx.timeStamp, 10) : undefined,
        type: tx.from.toLowerCase() === address.toLowerCase() ? 'Send' : 'Receive'
      }));
    } else {
      throw new Error(data.error || 'Failed to parse transaction history.');
    }
  } catch (error) {
    console.error("Failed to fetch transaction history from internal API:", error);
    throw error;
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
      cachedUrl: PlaceHolderImages.find(img => img.id === pNft.id)?.imageUrl ?? `https://picsum.photos/seed/${i+1}/300/300`,
      originalUrl: PlaceHolderImages.find(img => img.id === pNft.id)?.imageUrl ?? `https://picsum.photos/seed/${i+1}/300/300`,
    },
    timeLastUpdated: new Date().toISOString(),
    balance: "1",
  } as OwnedNft))
};

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
  const seed = 12345;
  const random = mulberry32(seed);
  
  let lastValue = 38587.5;

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const change = (random() - 0.49) * 2000;
    lastValue += change;

    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(lastValue.toFixed(2)),
    });
  }
  return data;
};

const fetchHistoricalPrices = async (): Promise<Map<string, number>> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30&interval=daily');
    if (!response.ok) {
      throw new Error('Failed to fetch historical prices from CoinGecko');
    }
    const data = await response.json();
    const prices = new Map<string, number>();
    data.prices.forEach((pricePoint: [number, number]) => {
      const date = new Date(pricePoint[0]).toISOString().split('T')[0];
      prices.set(date, pricePoint[1]);
    });
    return prices;
  } catch (error) {
    console.error(error);
    return new Map();
  }
};


const fetchPortfolioHistory = async (address: string, alchemy: Alchemy | null): Promise<PortfolioHistoryPoint[]> => {
  if (!alchemy) return [];

  const history: PortfolioHistoryPoint[] = [];
  const today = new Date();
  const prices = await fetchHistoricalPrices();
  if (prices.size === 0) return [];

  const blockPromises: Promise<{ date: string; balance: number } | null>[] = [];
  const blocksPerDay = 7200;

  try {
    const latestBlock = await alchemy.core.getBlockNumber();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setUTCHours(12, 0, 0, 0);

      const blockNumber = latestBlock - i * blocksPerDay;

      blockPromises.push(
        alchemy.core
          .getBalance(address, blockNumber)
          .then((balanceWei) => {
            const balanceString = (balanceWei as any)._hex ? (balanceWei as any)._hex : balanceWei.toString();
            return {
              date: date.toISOString().split("T")[0],
              balance: parseFloat(ethers.formatEther(balanceString)),
            };
          })
          .catch((e) => {
            console.error(`Failed to get balance for block ${blockNumber}`, e);
            return null;
          })
      );
    }
    
    const dailyBalances = (await Promise.all(blockPromises)).filter((b): b is { date: string; balance: number } => b !== null);

    dailyBalances.forEach(({ date, balance }) => {
      const price = prices.get(date);
      if (price) {
        history.push({
          date: date,
          value: balance * price,
        });
      }
    });

    return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error('Failed to fetch portfolio history:', error);
    return [];
  }
};


const calculatePortfolioChange = (history: PortfolioHistoryPoint[]): number => {
  if (history.length < 2) {
    return 0;
  }
  const latestValue = history[history.length - 1].value;
  const previousValue = history[history.length - 2].value;

  if (previousValue === 0) {
    return latestValue > 0 ? 100 : 0;
  }

  const change = ((latestValue - previousValue) / previousValue) * 100;
  return change;
};

const mockAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const mockBalance = "12.3456";
interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
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

  const resetState = useCallback(() => {
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
  }, []);
  
  const disconnectWallet = useCallback(() => {
    resetState();
    router.push("/login");
  }, [router, resetState]);
  
  const fetchDemoData = useCallback(() => {
    const ethPrice = 3150;
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
        { name: 'USD Coin', symbol: 'USDC', balance: '5000.00', value: '$5,000.00', iconUrl: usdcLogo?.imageUrl, iconHint: usdcLogo?.imageHint, contractAddress: 'usdc' },
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
  }, []);

  const startDemoMode = useCallback(() => {
    setLoading(true);
    localStorage.setItem("walletAddress", mockAddress);
    fetchDemoData();
    setLoading(false);
  }, [fetchDemoData]);

  const connectWallet = useCallback(async (): Promise<void> => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      setError("MetaMask not detected. Please install the extension.");
      return;
    }
    
    setLoading(true);
    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts && accounts.length > 0) {
        localStorage.setItem("walletAddress", accounts[0]);
        setAddress(accounts[0]);
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
  }, []);

  useEffect(() => {
    const fetchWalletData = async (walletAddress: string) => {
      setLoading(true);

      if (walletAddress.toLowerCase() === mockAddress.toLowerCase()) {
        fetchDemoData();
        setLoading(false);
        return;
      }

      try {
        const provider = new BrowserProvider((window as any).ethereum);
        const network = await provider.getNetwork();
        const alchemy = getAlchemy(network.chainId);

        if (!alchemy) {
          toast({
            variant: "destructive",
            title: "Unsupported Network or API Key Error",
            description: "Please switch to a supported network (Mainnet, Sepolia). Switching to demo mode.",
          });
          startDemoMode();
          return;
        }

        const balanceWei = await alchemy.core.getBalance(walletAddress);
        const balanceEth = ethers.formatEther(balanceWei.toString());
        const history = await fetchTransactionHistory(walletAddress, network.chainId);
        const userNfts = await fetchNfts(walletAddress, alchemy);
        const portfolioHistoryData = await fetchPortfolioHistory(walletAddress, alchemy);
        
        const tokenBalances = await fetchTokenBalances(walletAddress, alchemy);
        const tokenMetadata: TokenMetadataResponse[] = await Promise.all(
          tokenBalances.map(token => alchemy.core.getTokenMetadata(token.contractAddress))
        );

        const ethPrice = 3150; // Fallback static price
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
          const balance = parseFloat(ethers.formatUnits(token.tokenBalance!, metadata.decimals || 18));
          const tokenValue = metadata.symbol === 'USDC' || metadata.symbol === 'USDT' ? balance : 0; 
          return {
            name: metadata.name || 'Unknown Token',
            symbol: metadata.symbol || '???',
            balance: balance.toFixed(4),
            value: tokenValue > 0 ? tokenValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00',
            iconUrl: metadata.logo,
            iconHint: `${metadata.name} logo`,
            contractAddress: token.contractAddress,
          };
        });

        setBalance(balanceEth);
        setTokens([ethToken, ...formattedTokens]);
        setTransactions(history);
        setNfts(userNfts);
        setPortfolioHistory(portfolioHistoryData);
        setPortfolioChange(calculatePortfolioChange(portfolioHistoryData));
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch wallet data:", err);
        toast({
          variant: "destructive",
          title: "Data Fetching Error",
          description: `Could not fetch live wallet data: ${err.message}. Switching to demo mode.`,
        });
        startDemoMode();
      } finally {
        setLoading(false);
      }
    };
    
    // This effect runs ONCE on mount to check for a stored address.
    // It is the main entry point for hydrating the wallet state.
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
        setAddress(storedAddress);
        fetchWalletData(storedAddress);
    } else {
        setLoading(false); // If no address, we're not loading data.
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0 && accounts[0] !== address) {
        localStorage.setItem('walletAddress', accounts[0]);
        setAddress(accounts[0]);
        fetchWalletData(accounts[0]);
      } else if (accounts.length === 0) {
        disconnectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    const ethereum = (window as any).ethereum;
    if (ethereum) {
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);

      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []); // <-- EMPTY dependency array. This is critical.


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
    clearError,
    setAddress,
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
