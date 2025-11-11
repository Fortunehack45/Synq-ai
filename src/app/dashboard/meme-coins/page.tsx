import { MemeCoinTable } from "./components/meme-coin-table";

export default function MemeCoinsPage() {
  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Meme Coins</h1>
      </div>
      <MemeCoinTable />
    </>
  );
}
