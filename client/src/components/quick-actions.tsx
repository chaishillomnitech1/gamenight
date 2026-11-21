export default function QuickActions() {
  const handleBatchMint = () => {
    console.log("Opening batch mint dialog");
  };

  const handleExportData = () => {
    console.log("Exporting metadata");
  };

  const handleSyncIPFS = () => {
    console.log("Syncing IPFS");
  };

  const handlePauseContract = () => {
    console.log("Pausing contract - Emergency action");
  };

  const handleEmergencyWithdraw = () => {
    console.log("Emergency withdraw - Emergency action");
  };

  return (
    <div className="card-gradient rounded-xl p-6 border border-border" data-testid="quick-actions">
      <h3 className="text-lg font-bold mb-6" data-testid="quick-actions-title">Quick Actions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={handleBatchMint}
          className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors" 
          data-testid="button-batch-mint"
        >
          <i className="fas fa-layer-group text-primary"></i>
          <span className="font-medium text-primary">Batch Mint</span>
        </button>
        
        <button 
          onClick={handleExportData}
          className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 transition-colors" 
          data-testid="button-export-data"
        >
          <i className="fas fa-download text-secondary"></i>
          <span className="font-medium text-secondary">Export Data</span>
        </button>
        
        <button 
          onClick={handleSyncIPFS}
          className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors" 
          data-testid="button-sync-ipfs"
        >
          <i className="fas fa-sync-alt text-accent"></i>
          <span className="font-medium text-accent">Sync IPFS</span>
        </button>
      </div>

      {/* Emergency Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-md font-bold mb-4 text-destructive" data-testid="emergency-actions-title">Emergency Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handlePauseContract}
            className="flex items-center justify-center space-x-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-colors" 
            data-testid="button-pause-contract"
          >
            <i className="fas fa-pause text-destructive"></i>
            <span className="font-medium text-destructive">Pause Minting</span>
          </button>
          
          <button 
            onClick={handleEmergencyWithdraw}
            className="flex items-center justify-center space-x-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-colors" 
            data-testid="button-emergency-withdraw"
          >
            <i className="fas fa-exclamation-triangle text-destructive"></i>
            <span className="font-medium text-destructive">Emergency Withdraw</span>
          </button>
        </div>
      </div>
    </div>
  );
}
