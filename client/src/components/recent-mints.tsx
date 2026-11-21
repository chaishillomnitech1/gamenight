import { useQuery } from "@tanstack/react-query";

export default function RecentMints() {
  const { data: mints, isLoading } = useQuery({
    queryKey: ["/api/guardians/recent"],
  });

  const getTierName = (tier: number) => {
    const tierNames = ["Bronze", "Silver", "Gold", "Omni"];
    return tierNames[tier] || "Unknown";
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const mintDate = new Date(date);
    const diffMs = now.getTime() - mintDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="card-gradient rounded-xl p-6 border border-border">
        <div className="animate-pulse">
          <div className="h-6 bg-muted/20 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-muted/20 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted/20 rounded mb-2"></div>
                  <div className="h-3 bg-muted/10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-gradient rounded-xl p-6 border border-border" data-testid="recent-mints">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold" data-testid="recent-mints-title">Recent Mints</h3>
        <button className="text-primary hover:underline text-sm font-medium" data-testid="button-view-all-mints">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {mints?.length > 0 ? (
          mints.map((mint: any) => (
            <div key={mint.id} className="flex items-center space-x-4" data-testid={`mint-${mint.tokenId}`}>
              {/* Guardian NFT crest placeholder */}
              <div className="w-12 h-12 rounded-lg border border-primary/30 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <i className="fas fa-shield-alt text-primary"></i>
              </div>
              
              <div className="flex-1">
                <p className="font-medium" data-testid={`mint-token-id-${mint.tokenId}`}>#{mint.tokenId}</p>
                <p className="text-sm text-muted-foreground">
                  <span data-testid={`mint-recipient-${mint.tokenId}`}>{formatAddress(mint.ownerAddress)}</span> • {' '}
                  <span data-testid={`mint-tier-${mint.tokenId}`}>{getTierName(mint.tier)}</span>
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-accent font-medium" data-testid={`mint-status-${mint.tokenId}`}>
                  {mint.transactionHash ? "Confirmed" : "Pending"}
                </p>
                <p className="text-xs text-muted-foreground" data-testid={`mint-timestamp-${mint.tokenId}`}>
                  {formatTimeAgo(mint.createdAt)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground" data-testid="no-recent-mints">
            <i className="fas fa-coins text-4xl mb-4"></i>
            <p>No recent mints</p>
            <p className="text-sm">Guardian NFTs will appear here after minting</p>
          </div>
        )}
      </div>
    </div>
  );
}
