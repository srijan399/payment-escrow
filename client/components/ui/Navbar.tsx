import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./button";

export const Navbar = () => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <a
        href="#features"
        className="text-slate-600 hover:text-slate-900 transition-colors"
      >
        Features
      </a>
      <a
        href="#how-it-works"
        className="text-slate-600 hover:text-slate-900 transition-colors"
      >
        How It Works
      </a>
      <a
        href="#institutions"
        className="text-slate-600 hover:text-slate-900 transition-colors"
      >
        For Institutions
      </a>
      <div className="gap-x-4 flex items-center flex-wrap">
        <ConnectButton chainStatus="none" accountStatus="avatar" />
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          Get Started
        </Button>
      </div>
    </nav>
  );
};
