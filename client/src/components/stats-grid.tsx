import { useQuery } from "@tanstack/react-query";

export default function StatsGrid() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card-gradient rounded-xl p-6 border border-border animate-pulse">
            <div className="h-20 bg-muted/20 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="stats-grid">
      {/* Total Guardians */}
      <div className="card-gradient rounded-xl p-6 border border-border" data-testid="stat-total-guardians">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Total Guardians</p>
            <p className="text-3xl font-bold text-foreground" data-testid="text-total-guardians">
              {stats?.totalGuardians || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-shield-alt text-primary text-xl"></i>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <i className="fas fa-arrow-up text-accent mr-1"></i>
          <span className="text-accent font-medium">+12%</span>
          <span className="text-muted-foreground ml-2">from last month</span>
        </div>
      </div>

      {/* Pending Matches */}
      <div className="card-gradient rounded-xl p-6 border border-border" data-testid="stat-pending-matches">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Pending Matches</p>
            <p className="text-3xl font-bold text-foreground" data-testid="text-pending-matches">
              {stats?.pendingMatches || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-swords text-secondary text-xl"></i>
          </div>
        </div>
        <div className="mt-4">
          <button className="text-secondary font-medium text-sm hover:underline" data-testid="button-view-matches">
            View all matches →
          </button>
        </div>
      </div>

      {/* IPFS Status */}
      <div className="card-gradient rounded-xl p-6 border border-border" data-testid="stat-ipfs-status">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">IPFS Pinned</p>
            <p className="text-3xl font-bold text-foreground" data-testid="text-ipfs-pinned">
              {stats?.ipfsPinned || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-cloud text-accent text-xl"></i>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
          <span className="text-accent font-medium">Healthy</span>
        </div>
      </div>

      {/* Gas Tracker */}
      <div className="card-gradient rounded-xl p-6 border border-border" data-testid="stat-gas-tracker">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Current Gas</p>
            <p className="text-3xl font-bold text-foreground" data-testid="text-gas-price">
              {stats?.gasPrice || "-- gwei"}
            </p>
          </div>
          <div className="w-12 h-12 bg-muted/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-gas-pump text-muted-foreground text-xl"></i>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <i className="fas fa-arrow-down text-accent mr-1"></i>
          <span className="text-accent font-medium">Normal</span>
        </div>
      </div>
    </div>
  );
}
