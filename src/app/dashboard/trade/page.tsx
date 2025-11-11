import { SwapCard } from "./components/swap-card";

export default function TradePage() {
  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Trade</h1>
      </div>
      <div className="flex items-center justify-center w-full">
        <SwapCard />
      </div>
    </>
  );
}
