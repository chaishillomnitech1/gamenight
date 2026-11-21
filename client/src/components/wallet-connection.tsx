import { useWallet } from "@/hooks/use-wallet";

export default function WalletConnection() {
  const { address, isConnected, connect, disconnect } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="p-4 border-t border-border" data-testid="wallet-connection">
      {isConnected ? (
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <i className="fas fa-wallet text-accent-foreground text-sm"></i>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-accent" data-testid="wallet-address">
              {formatAddress(address)}
            </p>
            <p className="text-xs text-muted-foreground">Connected</p>
          </div>
          <button 
            onClick={disconnect}
            className="text-xs text-muted-foreground hover:text-foreground"
            data-testid="button-disconnect"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      ) : (
        <button 
          onClick={connect}
          className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
          data-testid="button-connect-wallet"
        >
          <i className="fas fa-wallet text-primary"></i>
          <span className="text-primary font-medium">Connect Wallet</span>
        </button>
      )}
    </div>
  );
}
