import { useQuery } from "@tanstack/react-query";

export default function IPFSManager() {
  const { data: ipfsData, isLoading } = useQuery({
    queryKey: ["/api/ipfs/pins"],
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="card-gradient rounded-xl p-6 border border-border">
        <div className="animate-pulse">
          <div className="h-6 bg-muted/20 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-16 bg-muted/10 rounded-lg"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-muted/10 rounded-lg"></div>
              <div className="h-20 bg-muted/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-gradient rounded-xl p-6 border border-border" data-testid="ipfs-manager">
      <h3 className="text-lg font-bold mb-6" data-testid="ipfs-manager-title">IPFS Management</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border" data-testid="pinata-status">
          <div>
            <p className="font-medium">Pinata Status</p>
            <p className="text-sm text-muted-foreground">Metadata pinning service</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-accent text-sm font-medium" data-testid="pinata-connection-status">
              {ipfsData?.status === "healthy" ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-background/30" data-testid="pinned-files-stat">
            <p className="text-2xl font-bold text-primary" data-testid="total-pinned-files">
              {ipfsData?.totalPins || 0}
            </p>
            <p className="text-xs text-muted-foreground">Pinned Files</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-background/30" data-testid="storage-used-stat">
            <p className="text-2xl font-bold text-secondary" data-testid="storage-used">
              {formatFileSize(ipfsData?.totalSize || 0)}
            </p>
            <p className="text-xs text-muted-foreground">Storage Used</p>
          </div>
        </div>

        <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors" data-testid="button-manage-ipfs">
          <i className="fas fa-cloud-upload mr-2"></i>
          Manage IPFS Pins
        </button>
      </div>
    </div>
  );
}
