import { PlaceHolderImages } from './placeholder-images';

export const portfolioData = [
  { month: 'Jan', totalValue: 4000 },
  { month: 'Feb', totalValue: 3000 },
  { month: 'Mar', totalValue: 5000 },
  { month: 'Apr', totalValue: 4500 },
  { month: 'May', totalValue: 6000 },
  { month: 'Jun', totalValue: 5500 },
  { month: 'Jul', totalValue: 7000 },
  { month: 'Aug', totalValue: 6500 },
  { month: 'Sep', totalValue: 7500 },
  { month: 'Oct', totalValue: 8000 },
  { month: 'Nov', totalValue: 9000 },
  { month: 'Dec', totalValue: 10000 },
];

export const tokens = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    balance: '5.25',
    value: '$16,537.50',
    icon: PlaceHolderImages.find(img => img.id === 'eth-logo'),
    change: '+2.5%',
    changeType: 'positive',
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    balance: '10,000.00',
    value: '$10,000.00',
    icon: PlaceHolderImages.find(img => img.id === 'usdc-logo'),
    change: '+0.01%',
    changeType: 'positive',
  },
  {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    balance: '0.15',
    value: '$9,000.00',
    icon: PlaceHolderImages.find(img => img.id === 'wbtc-logo'),
    change: '-1.2%',
    changeType: 'negative',
  },
  {
    name: 'Uniswap',
    symbol: 'UNI',
    balance: '500',
    value: '$3,500.00',
    icon: PlaceHolderImages.find(img => img.id === 'uni-logo'),
    change: '+5.8%',
    changeType: 'positive',
  },
];

export const nfts = [
  {
    name: 'Abstract Art #1',
    collection: 'ArtBlocks',
    image: PlaceHolderImages.find(img => img.id === 'nft-1'),
  },
  {
    name: 'CryptoPunk #1234',
    collection: 'CryptoPunks',
    image: PlaceHolderImages.find(img => img.id === 'nft-2'),
  },
  {
    name: 'Future World',
    collection: 'Foundation',
    image: PlaceHolderImages.find(img => img.id === 'nft-3'),
  },
  {
    name: 'Generative #56',
    collection: 'GenArt',
    image: PlaceHolderImages.find(img => img.id === 'nft-4'),
  },
];

export const transactions = [
  {
    type: 'Swap',
    description: 'Swapped 1 ETH for 3,150 USDC on Uniswap',
    date: '2023-10-26',
    amount: '-1 ETH',
    status: 'Completed',
  },
  {
    type: 'Receive',
    description: 'Received 0.5 ETH from 0xabcd...efgh',
    date: '2023-10-25',
    amount: '+0.5 ETH',
    status: 'Completed',
  },
  {
    type: 'NFT Mint',
    description: 'Minted "Future World" on Foundation',
    date: '2023-10-24',
    amount: '-0.1 ETH',
    status: 'Completed',
  },
  {
    type: 'Send',
    description: 'Sent 1,000 USDC to 0x1234...5678',
    date: '2023-10-23',
    amount: '-1,000 USDC',
    status: 'Completed',
  },
  {
    type: 'Stake',
    description: 'Staked 100 UNI in governance pool',
    date: '2023-10-22',
    amount: '-100 UNI',
    status: 'Pending',
  },
];
