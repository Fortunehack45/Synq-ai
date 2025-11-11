import { OverviewCards } from "./components/overview-cards";
import { PortfolioChart } from "./components/portfolio-chart";
import { AssetsTabs } from "./components/assets-tabs";
import { RecentTransactions } from "./components/recent-transactions";

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="flex flex-1 rounded-lg ">
        <div className="flex flex-col w-full gap-4 md:gap-8">
            <OverviewCards />
            <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <PortfolioChart />
              </div>
              <div className="lg:col-span-2">
                <AssetsTabs />
              </div>
            </div>
            <div>
              <RecentTransactions />
            </div>
        </div>
      </div>
    </>
  );
}
