import { useState, useEffect, useCallback } from "react";
import { web3Service, type WalletConnection } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";

export function useWallet() {
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const connection = await web3Service.connectWallet();
      if (connection) {
        setConnection(connection);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${connection.address.slice(0, 6)}...${connection.address.slice(-4)}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(() => {
    setConnection(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  }, [toast]);

  const switchToGoerli = useCallback(async () => {
    const success = await web3Service.switchNetwork(5); // Goerli chainId
    if (success) {
      toast({
        title: "Network Switched",
        description: "Switched to Goerli testnet",
      });
    } else {
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch to Goerli testnet",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const existingConnection = await web3Service.getConnection();
      if (existingConnection) {
        setConnection(existingConnection);
      }
    };

    checkConnection();
  }, []);

  // Set up event listeners
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setConnection(null);
      } else if (connection) {
        setConnection({
          ...connection,
          address: accounts[0],
        });
      }
    };

    const handleChainChanged = (chainId: string) => {
      if (connection) {
        setConnection({
          ...connection,
          chainId: parseInt(chainId, 16),
        });
      }
    };

    web3Service.onAccountsChanged(handleAccountsChanged);
    web3Service.onChainChanged(handleChainChanged);

    return () => {
      web3Service.removeListeners();
    };
  }, [connection]);

  return {
    address: connection?.address || "",
    chainId: connection?.chainId || 0,
    isConnected: Boolean(connection?.isConnected),
    isConnecting,
    connect,
    disconnect,
    switchToGoerli,
  };
}
