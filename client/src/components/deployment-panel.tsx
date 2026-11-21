import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function DeploymentPanel() {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: contracts } = useQuery({
    queryKey: ["/api/contracts"],
  });

  const handleRedeploy = () => {
    console.log("Redeploying contracts");
    // This would trigger contract redeployment
  };

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  const getContractStatus = (contractName: string) => {
    const contract = contracts?.find((c: any) => c.name === contractName);
    return contract?.isActive ? "Deployed" : "Not Deployed";
  };

  return (
    <div className="fixed bottom-6 right-6 z-40" data-testid="deployment-panel">
      <div className="bg-card rounded-xl border border-border shadow-2xl">
        {/* Collapsed State */}
        {!isExpanded && (
          <div className="p-4" data-testid="deployment-collapsed">
            <Button 
              variant="ghost"
              onClick={togglePanel}
              className="flex items-center space-x-3 text-secondary font-medium"
              data-testid="button-expand-deployment"
            >
              <i className="fas fa-rocket"></i>
              <span>Deploy Status</span>
              <i className="fas fa-chevron-up"></i>
            </Button>
          </div>
        )}

        {/* Expanded State */}
        {isExpanded && (
          <div className="p-6 w-80" data-testid="deployment-expanded">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold" data-testid="deployment-title">Contract Deployment</h4>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={togglePanel}
                data-testid="button-collapse-deployment"
              >
                <i className="fas fa-chevron-down text-muted-foreground"></i>
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between" data-testid="guardian-manager-status">
                <span className="text-sm">GuardianManager</span>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-accent"></i>
                  <span className="text-accent text-sm">{getContractStatus("GuardianManager")}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between" data-testid="ireceipt-status">
                <span className="text-sm">IReceipt</span>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-accent"></i>
                  <span className="text-accent text-sm">{getContractStatus("IReceipt")}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between" data-testid="ipfs-config-status">
                <span className="text-sm">IPFS Config</span>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-accent"></i>
                  <span className="text-accent text-sm">Connected</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleRedeploy}
              className="w-full mt-4 bg-secondary hover:bg-secondary/90"
              data-testid="button-redeploy"
            >
              <i className="fas fa-redo mr-2"></i>
              Redeploy Contracts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
