import { useQuery } from "@tanstack/react-query";

interface PendingMatchesProps {
  onResolveMatch: (match: any) => void;
}

export default function PendingMatches({ onResolveMatch }: PendingMatchesProps) {
  const { data: matches, isLoading } = useQuery({
    queryKey: ["/api/matches/pending"],
  });

  const getTierName = (tier: number) => {
    const tierNames = ["Bronze", "Silver", "Gold", "Omni"];
    return tierNames[tier] || "Unknown";
  };

  const getTierColor = (tier: number) => {
    const tierColors = [
      "primary/10 text-primary/60", // Bronze
      "muted/20 text-muted-foreground", // Silver  
      "primary/20 text-primary", // Gold
      "primary/30 text-primary" // Omni
    ];
    return tierColors[tier] || "muted/20 text-muted-foreground";
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  if (isLoading) {
    return (
      <div className="card-gradient rounded-xl p-6 border border-border">
        <div className="animate-pulse">
          <div className="h-6 bg-muted/20 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-gradient rounded-xl p-6 border border-border" data-testid="pending-matches">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold" data-testid="pending-matches-title">Pending Matches</h3>
        <div className="px-3 py-1 bg-secondary/20 rounded-full">
          <span className="text-secondary text-sm font-medium" data-testid="pending-count">
            {matches?.length || 0} pending
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {matches?.length > 0 ? (
          matches.map((match: any) => (
            <div 
              key={match.id} 
              className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-colors"
              data-testid={`match-${match.matchId}`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-sword text-secondary"></i>
                </div>
                <div>
                  <p className="font-medium" data-testid={`match-id-${match.id}`}>{match.matchId}</p>
                  <p className="text-sm text-muted-foreground">
                    <span data-testid={`challenger1-${match.id}`}>{formatAddress(match.challenger1)}</span> vs{' '}
                    <span data-testid={`challenger2-${match.id}`}>{formatAddress(match.challenger2)}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span 
                  className={`px-2 py-1 rounded text-xs font-medium bg-${getTierColor(match.tier)}`}
                  data-testid={`match-tier-${match.id}`}
                >
                  {getTierName(match.tier)}
                </span>
                <button 
                  onClick={() => onResolveMatch(match)}
                  className="px-3 py-1 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors pulse-glow"
                  data-testid={`button-resolve-${match.id}`}
                >
                  Resolve
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground" data-testid="no-pending-matches">
            <i className="fas fa-check-circle text-4xl mb-4 text-accent"></i>
            <p>No pending matches</p>
            <p className="text-sm">All challenges have been resolved</p>
          </div>
        )}
      </div>

      {matches?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <button className="w-full px-4 py-2 text-secondary font-medium hover:bg-secondary/10 rounded-lg transition-colors" data-testid="button-view-all-matches">
            View All Pending Matches
          </button>
        </div>
      )}
    </div>
  );
}
