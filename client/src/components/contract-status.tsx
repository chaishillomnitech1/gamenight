import { useQuery } from "@tanstack/react-query";

export default function ContractStatus() {
  const { data: contracts, isLoading } = useQuery({
    queryKey: ["/api/contracts"],
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="card-gradient rounded-xl p-6 border border-border">
        <div className="animate-pulse">
          <div className="h-6 bg-muted/20 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-gradient rounded-xl p-6 border border-border" data-testid="contract-status">
      <h3 className="text-lg font-bold mb-6" data-testid="contract-status-title">Contract Status</h3>
      
      <div className="space-y-4">
        {contracts?.map((contract: any) => (
          <div 
            key={contract.id} 
            className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border"
            data-testid={`contract-${contract.name.toLowerCase()}`}
          >
            <div>
              <p className="font-medium" data-testid={`contract-name-${contract.name.toLowerCase()}`}>
                {contract.name}
              </p>
              <p className="text-sm text-muted-foreground font-mono" data-testid={`contract-address-${contract.name.toLowerCase()}`}>
                {formatAddress(contract.address)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-accent text-sm font-medium" data-testid={`contract-status-${contract.name.toLowerCase()}`}>
                {contract.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Block</span>
            <span className="font-medium" data-testid="last-block">18,234,567</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Gas Price</span>
            <span className="font-medium" data-testid="current-gas-price">24 gwei</span>
          </div>
        </div>
      </div>
    </div>
  );
}
