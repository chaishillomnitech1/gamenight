import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export interface ContractInfo {
  name: string;
  address: string;
  network: string;
  isActive: boolean;
  deployedAt: Date;
}

export function useContract(contractName?: string) {
  const [gasPrice, setGasPrice] = useState<string>("0");
  const [blockNumber, setBlockNumber] = useState<number>(0);

  const { data: contracts, isLoading } = useQuery<ContractInfo[]>({
    queryKey: ["/api/contracts"],
  });

  const contract = contractName 
    ? contracts?.find(c => c.name === contractName)
    : null;

  // Simulate gas price and block number updates
  useEffect(() => {
    const updateNetworkData = () => {
      // In a real implementation, this would fetch from Web3 provider
      setGasPrice(`${Math.floor(Math.random() * 50) + 15} gwei`);
      setBlockNumber(prev => prev + Math.floor(Math.random() * 3) + 1);
    };

    // Initial values
    setBlockNumber(18234567);
    setGasPrice("24 gwei");

    const interval = setInterval(updateNetworkData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getContractByName = (name: string): ContractInfo | undefined => {
    return contracts?.find(c => c.name === name);
  };

  const isContractActive = (name: string): boolean => {
    const contract = getContractByName(name);
    return contract?.isActive || false;
  };

  const getContractAddress = (name: string): string | undefined => {
    const contract = getContractByName(name);
    return contract?.address;
  };

  return {
    contracts: contracts || [],
    contract,
    gasPrice,
    blockNumber,
    isLoading,
    getContractByName,
    isContractActive,
    getContractAddress,
  };
}

export function useGuardianManager() {
  return useContract("GuardianManager");
}

export function useReceiptContract() {
  return useContract("IReceipt");
}
