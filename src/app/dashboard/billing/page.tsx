import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "For individuals getting started with crypto analysis.",
    features: [
      "Basic Wallet Analysis",
      "Limited AI Queries (5/day)",
      "View Transaction History",
      "Community Support",
    ],
    cta: "Current Plan",
    disabled: true,
  },
  {
    name: "Pro",
    price: "$14.99",
    period: "/month",
    description: "For professionals and power users who need advanced insights.",
    features: [
      "Advanced Wallet & DeFi Analysis",
      "Unlimited AI Queries",
      "Smart Contract Audits",
      "Real-time Alerts",
      "Priority Email Support",
    ],
    cta: "Upgrade to Pro",
    primary: true,
  },
  {
    name: "Pro Plus",
    price: "$49.99",
    period: "/month",
    description: "For institutions and users who need the absolute best.",
    features: [
      "All Pro Features",
      "On-chain Forensics Tools",
      "Customizable Dashboards",
      "Dedicated Account Manager",
      "24/7 Phone Support",
    ],
    cta: "Upgrade to Pro Plus",
  },
];

export default function BillingPage() {
  return (
    <>
      <div className="flex flex-col items-start mb-8">
        <h1 className="text-lg font-semibold md:text-2xl">Billing</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and find the perfect plan for your needs.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col glass ${
              plan.primary ? "border-primary shadow-primary/20 shadow-lg" : ""
            }`}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.primary ? "default" : "outline"}
                disabled={plan.disabled}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
