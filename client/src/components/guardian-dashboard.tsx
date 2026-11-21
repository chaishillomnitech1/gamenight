import Sidebar from "./sidebar";
import StatsGrid from "./stats-grid";
import GuardianTiers from "./guardian-tiers";
import PendingMatches from "./pending-matches";
import RecentMints from "./recent-mints";
import ContractStatus from "./contract-status";
import IPFSManager from "./ipfs-manager";
import QuickActions from "./quick-actions";
import MatchResolutionModal from "./match-resolution-modal";
import DeploymentPanel from "./deployment-panel";
import { useState } from "react";

export default function GuardianDashboard() {
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResolveMatch = (match: any) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" data-testid="dashboard-title">Guardian Manager Dashboard</h2>
              <p className="text-muted-foreground" data-testid="dashboard-subtitle">Manage ceremonial matches and mint Guardian NFTs</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Network Status */}
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30" data-testid="network-status">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm text-accent font-medium">Goerli</span>
              </div>
              
              {/* Deploy Status */}
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 transition-colors" data-testid="button-deploy">
                <i className="fas fa-rocket text-secondary"></i>
                <span className="text-secondary font-medium">Deploy Contracts</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6" data-testid="main-content">
          <StatsGrid />
          <GuardianTiers />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <PendingMatches onResolveMatch={handleResolveMatch} />
            <RecentMints />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ContractStatus />
            <IPFSManager />
          </div>

          <QuickActions />
        </main>
      </div>

      <MatchResolutionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedMatch={selectedMatch}
      />
      
      <DeploymentPanel />
    </div>
  );
}
