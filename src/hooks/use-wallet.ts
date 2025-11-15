
"use client";

import { useContext, Dispatch, SetStateAction } from "react";
import { WalletContext } from "@/context/wallet-provider";

interface UseWalletProps {
  setShowComingSoon?: Dispatch<SetStateAction<boolean>>;
}

export const useWallet = (props?: UseWalletProps) => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  
  if (props) {
    // This is a bit of a workaround to pass a setter from a page to the context hook
    // It's used here to allow the login page to control the "coming soon" dialog
    (context as any).setShowComingSoon = props.setShowComingSoon;
  }
  
  return context;
};
