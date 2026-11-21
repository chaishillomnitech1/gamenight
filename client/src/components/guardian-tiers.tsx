import { useQuery } from "@tanstack/react-query";

export default function GuardianTiers() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const tiers = [
    {
      name: "Omni",
      tier: 3,
      icon: "fas fa-crown",
      color: "primary",
      description: "Ultra-rare ceremonial guardians with supreme authority",
      minted: stats?.tiers.omni.minted || 0,
      max: stats?.tiers.omni.max || 10,
      glowClass: "tier-glow-omni"
    },
    {
      name: "Gold",
      tier: 2,
      icon: "fas fa-medal",
      color: "primary/80",
      description: "Elite guardians with ceremonial privileges",
      minted: stats?.tiers.gold.minted || 0,
      max: stats?.tiers.gold.max || 1000,
      glowClass: "tier-glow-gold"
    },
    {
      name: "Silver",
      tier: 1,
      icon: "fas fa-star",
      color: "muted-foreground",
      description: "Standard guardians for proven challengers",
      minted: stats?.tiers.silver.minted || 0,
      max: null,
      glowClass: "tier-glow-silver"
    },
    {
      name: "Bronze",
      tier: 0,
      icon: "fas fa-certificate",
      color: "muted-foreground",
      description: "Entry-level guardians for new challengers",
      minted: stats?.tiers.bronze.minted || 0,
      max: null,
      glowClass: ""
    },
  ];

  const getProgressWidth = (minted: number, max: number | null) => {
    if (!max) return 100;
    return Math.min((minted / max) * 100, 100);
  };

  const handleMint = (tier: number, tierName: string) => {
    // This would open a mint dialog or trigger minting process
    console.log(`Minting ${tierName} Guardian (tier ${tier})`);
  };

  return (
    <div className="mb-8" data-testid="guardian-tiers">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold ceremonial-font" data-testid="tiers-title">Guardian Tiers</h3>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors glow-effect" data-testid="button-mint-guardian">
          <i className="fas fa-plus mr-2"></i>
          Mint Guardian
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <div 
            key={tier.name} 
            className={`card-gradient rounded-xl p-6 border ${
              tier.name === 'Omni' ? 'border-primary' : 'border-border'
            } ${tier.glowClass}`}
            data-testid={`tier-card-${tier.name.toLowerCase()}`}
          >
            <div className="text-center">
              <div className={`w-16 h-16 ${
                tier.name === 'Omni' ? 'bg-primary/20' : 
                tier.name === 'Gold' ? 'bg-primary/10' : 'bg-muted/20'
              } rounded-full mx-auto mb-4 flex items-center justify-center`}>
                <i className={`${tier.icon} text-${tier.color} text-2xl`}></i>
              </div>
              
              <h4 className={`text-lg font-bold ceremonial-font mb-2 text-${tier.color}`} data-testid={`tier-name-${tier.name.toLowerCase()}`}>
                {tier.name}
              </h4>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Minted</span>
                  <span className="font-medium" data-testid={`tier-minted-${tier.name.toLowerCase()}`}>
                    {tier.minted}{tier.max ? `/${tier.max}` : ''}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      tier.name === 'Omni' || tier.name === 'Gold' ? 'bg-primary' : 'bg-muted-foreground'
                    }`}
                    style={{ width: `${getProgressWidth(tier.minted, tier.max)}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mb-4" data-testid={`tier-description-${tier.name.toLowerCase()}`}>
                {tier.description}
              </p>
              
              <button 
                onClick={() => handleMint(tier.tier, tier.name)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  tier.name === 'Omni' ? 'bg-primary text-primary-foreground hover:bg-primary/90' :
                  tier.name === 'Gold' ? 'bg-primary/80 text-primary-foreground hover:bg-primary/70' :
                  tier.name === 'Silver' ? 'bg-muted text-muted-foreground hover:bg-muted/80' :
                  'bg-muted/50 text-muted-foreground hover:bg-muted/60'
                }`}
                data-testid={`button-mint-${tier.name.toLowerCase()}`}
              >
                Mint {tier.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
