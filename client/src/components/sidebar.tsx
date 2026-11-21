import WalletConnection from "./wallet-connection";

export default function Sidebar() {
  return (
    <div className="w-64 sidebar-gradient border-r border-border flex flex-col">
      {/* Brand Header */}
      <div className="p-6 border-b border-border" data-testid="brand-header">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-shield-alt text-primary-foreground text-lg"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold ceremonial-font" data-testid="brand-title">Flame Court</h1>
            <p className="text-xs text-muted-foreground" data-testid="brand-subtitle">Guardian Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2" data-testid="navigation">
        <a href="#dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20" data-testid="nav-dashboard">
          <i className="fas fa-chart-line w-5"></i>
          <span className="font-medium">Dashboard</span>
        </a>
        <a href="#matches" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-matches">
          <i className="fas fa-swords w-5"></i>
          <span>Pending Matches</span>
        </a>
        <a href="#guardians" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-guardians">
          <i className="fas fa-users-crown w-5"></i>
          <span>Guardian Registry</span>
        </a>
        <a href="#contracts" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-contracts">
          <i className="fas fa-file-contract w-5"></i>
          <span>Contracts</span>
        </a>
        <a href="#ipfs" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-ipfs">
          <i className="fas fa-cloud w-5"></i>
          <span>IPFS Manager</span>
        </a>
      </nav>

      <WalletConnection />
    </div>
  );
}
