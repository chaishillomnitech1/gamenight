// Web3 utilities for Guardian NFT platform
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
}

export class Web3Service {
  private static instance: Web3Service;
  
  static getInstance(): Web3Service {
    if (!Web3Service.instance) {
      Web3Service.instance = new Web3Service();
    }
    return Web3Service.instance;
  }

  async connectWallet(): Promise<WalletConnection | null> {
    if (!window.ethereum) {
      throw new Error("MetaMask or compatible wallet not found");
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      return {
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        isConnected: true,
      };
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return null;
    }
  }

  async getConnection(): Promise<WalletConnection | null> {
    if (!window.ethereum) {
      return null;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length === 0) {
        return null;
      }

      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      return {
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        isConnected: true,
      };
    } catch (error) {
      console.error("Failed to get wallet connection:", error);
      return null;
    }
  }

  async switchNetwork(chainId: number): Promise<boolean> {
    if (!window.ethereum) {
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (error) {
      console.error("Failed to switch network:", error);
      return false;
    }
  }

  onAccountsChanged(callback: (accounts: string[]) => void) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }

  onChainChanged(callback: (chainId: string) => void) {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }

  removeListeners() {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  }
}

export const web3Service = Web3Service.getInstance();
