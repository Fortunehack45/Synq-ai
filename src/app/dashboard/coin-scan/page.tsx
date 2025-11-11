import { CoinScanInterface } from "./components/coin-scan-interface";

export default function CoinScanPage() {
  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Coin Scan</h1>
      </div>
      <CoinScanInterface />
    </>
  );
}
