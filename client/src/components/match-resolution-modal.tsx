import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface MatchResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMatch: any;
}

export default function MatchResolutionModal({ isOpen, onClose, selectedMatch }: MatchResolutionModalProps) {
  const [selectedWinner, setSelectedWinner] = useState<string>("");
  const [roundScores, setRoundScores] = useState([
    { round: 1, challenger1Score: 0, challenger2Score: 0 },
    { round: 2, challenger1Score: 0, challenger2Score: 0 },
  ]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const resolveMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/matches/resolve", data);
    },
    onSuccess: () => {
      toast({
        title: "Match Resolved",
        description: "The match has been resolved successfully. Ready for minting.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/matches/pending"] });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Resolution Failed",
        description: error.message || "Failed to resolve match",
        variant: "destructive",
      });
    },
  });

  const igniteMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/ignite", data);
    },
    onSuccess: (response: any) => {
      const data = response.json();
      toast({
        title: "Guardian Minted!",
        description: `Guardian NFT #${data.tokenId} has been minted successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/guardians/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches/pending"] });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint Guardian NFT",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedWinner("");
    setRoundScores([
      { round: 1, challenger1Score: 0, challenger2Score: 0 },
      { round: 2, challenger1Score: 0, challenger2Score: 0 },
    ]);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleResolve = () => {
    if (!selectedMatch || !selectedWinner) {
      toast({
        title: "Invalid Selection",
        description: "Please select a winner before resolving the match.",
        variant: "destructive",
      });
      return;
    }

    resolveMutation.mutate({
      matchId: selectedMatch.matchId,
      winner: selectedWinner,
      roundScores,
      winnerAddress: selectedWinner,
      metadata: {
        name: `Guardian - ${selectedMatch.matchId}`,
        description: "Guardian Challenge receipt",
        attributes: [
          { trait_type: "Tier", value: getTierName(selectedMatch.tier) },
          { trait_type: "Match ID", value: selectedMatch.matchId },
        ],
      },
    });
  };

  const handleIgnite = () => {
    if (!selectedMatch || !selectedWinner) {
      toast({
        title: "Invalid Selection",
        description: "Please select a winner before minting.",
        variant: "destructive",
      });
      return;
    }

    const loser = selectedWinner === selectedMatch.challenger1 ? selectedMatch.challenger2 : selectedMatch.challenger1;

    igniteMutation.mutate({
      matchID: selectedMatch.matchId,
      winner: selectedWinner,
      loser,
      roundScores,
      winnerAddress: selectedWinner,
      tier: selectedMatch.tier,
      metadata: {
        name: `Guardian - ${selectedMatch.matchId}`,
        description: "Guardian Challenge receipt",
        attributes: [
          { trait_type: "Tier", value: getTierName(selectedMatch.tier) },
          { trait_type: "Match ID", value: selectedMatch.matchId },
        ],
      },
    });
  };

  const getTierName = (tier: number) => {
    const tierNames = ["Bronze", "Silver", "Gold", "Omni"];
    return tierNames[tier] || "Unknown";
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const updateRoundScore = (roundIndex: number, field: string, value: number) => {
    setRoundScores(prev => prev.map((round, index) => 
      index === roundIndex ? { ...round, [field]: value } : round
    ));
  };

  if (!selectedMatch) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-card border-border" data-testid="match-resolution-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold ceremonial-font" data-testid="modal-title">
            Resolve Guardian Challenge
          </DialogTitle>
        </DialogHeader>

        {/* Match Details */}
        <div className="mb-6 p-4 rounded-lg bg-background/50 border border-border" data-testid="match-details">
          <h4 className="font-medium mb-3">Match Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Match ID</p>
              <p className="font-medium" data-testid="match-id">{selectedMatch.matchId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tier</p>
              <span className="px-2 py-1 bg-primary/20 text-primary rounded text-sm font-medium" data-testid="match-tier">
                {getTierName(selectedMatch.tier)}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Challenger 1</p>
              <p className="font-medium" data-testid="challenger1">{formatAddress(selectedMatch.challenger1)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Challenger 2</p>
              <p className="font-medium" data-testid="challenger2">{formatAddress(selectedMatch.challenger2)}</p>
            </div>
          </div>
        </div>

        {/* Winner Selection */}
        <div className="mb-6" data-testid="winner-selection">
          <h4 className="font-medium mb-3">Select Winner</h4>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setSelectedWinner(selectedMatch.challenger1)}
              className={`p-4 rounded-lg border transition-colors text-left ${
                selectedWinner === selectedMatch.challenger1 
                  ? 'border-accent bg-accent/10 text-accent' 
                  : 'border-border hover:border-accent hover:bg-accent/10'
              }`}
              data-testid="button-select-challenger1"
            >
              <p className="font-medium">Challenger 1</p>
              <p className="text-sm text-muted-foreground">{formatAddress(selectedMatch.challenger1)}</p>
            </button>
            <button 
              onClick={() => setSelectedWinner(selectedMatch.challenger2)}
              className={`p-4 rounded-lg border transition-colors text-left ${
                selectedWinner === selectedMatch.challenger2 
                  ? 'border-accent bg-accent/10 text-accent' 
                  : 'border-border hover:border-accent hover:bg-accent/10'
              }`}
              data-testid="button-select-challenger2"
            >
              <p className="font-medium">Challenger 2</p>
              <p className="text-sm text-muted-foreground">{formatAddress(selectedMatch.challenger2)}</p>
            </button>
          </div>
        </div>

        {/* Round Scores */}
        <div className="mb-6" data-testid="round-scores">
          <h4 className="font-medium mb-3">Round Scores</h4>
          <div className="space-y-2">
            {roundScores.map((round, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Label className="text-sm text-muted-foreground w-16">Round {round.round}:</Label>
                <Input 
                  type="number" 
                  placeholder="Score 1" 
                  value={round.challenger1Score || ""}
                  onChange={(e) => updateRoundScore(index, 'challenger1Score', parseInt(e.target.value) || 0)}
                  className="flex-1"
                  data-testid={`input-round${round.round}-challenger1`}
                />
                <span className="text-muted-foreground">vs</span>
                <Input 
                  type="number" 
                  placeholder="Score 2" 
                  value={round.challenger2Score || ""}
                  onChange={(e) => updateRoundScore(index, 'challenger2Score', parseInt(e.target.value) || 0)}
                  className="flex-1"
                  data-testid={`input-round${round.round}-challenger2`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4" data-testid="modal-actions">
          <Button 
            variant="ghost" 
            onClick={handleClose}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleResolve}
            disabled={!selectedWinner || resolveMutation.isPending}
            className="bg-secondary hover:bg-secondary/90"
            data-testid="button-resolve"
          >
            {resolveMutation.isPending ? "Resolving..." : "Resolve Match"}
          </Button>
          <Button 
            onClick={handleIgnite}
            disabled={!selectedWinner || igniteMutation.isPending}
            className="bg-accent hover:bg-accent/90 glow-effect"
            data-testid="button-ignite"
          >
            <i className="fas fa-fire mr-2"></i>
            {igniteMutation.isPending ? "Minting..." : "Ignite & Mint Guardian"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
