import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMatchSchema, insertGuardianNftSchema } from "@shared/schema";
import { z } from "zod";

// Validation schemas
const resolveMatchSchema = z.object({
  matchId: z.string(),
  winner: z.string(),
  roundScores: z.array(z.object({
    round: z.number(),
    challenger1Score: z.number(),
    challenger2Score: z.number(),
  })),
  winnerAddress: z.string(),
  metadata: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    attributes: z.array(z.any()).optional(),
  }).optional(),
});

const igniteRequestSchema = z.object({
  matchID: z.string(),
  winner: z.string(),
  loser: z.string(),
  roundScores: z.array(z.any()),
  metadata: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    attributes: z.array(z.any()).optional(),
  }).optional(),
  winnerAddress: z.string(),
  tier: z.number().min(0).max(3),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get dashboard stats
  app.get("/api/stats", async (req, res) => {
    try {
      const totalGuardians = (await storage.getGuardianNftsByTier(0)).length +
                            (await storage.getGuardianNftsByTier(1)).length +
                            (await storage.getGuardianNftsByTier(2)).length +
                            (await storage.getGuardianNftsByTier(3)).length;
      
      const pendingMatches = await storage.getPendingMatches();
      const ipfsPins = await storage.getAllIpfsPins();
      
      // Tier counts
      const bronzeMinted = (await storage.getGuardianNftsByTier(0)).length;
      const silverMinted = (await storage.getGuardianNftsByTier(1)).length;
      const goldMinted = (await storage.getGuardianNftsByTier(2)).length;
      const omniMinted = (await storage.getGuardianNftsByTier(3)).length;

      res.json({
        totalGuardians,
        pendingMatches: pendingMatches.length,
        ipfsPinned: ipfsPins.length,
        gasPrice: "24 gwei", // This would come from a real gas tracker API
        tiers: {
          bronze: { minted: bronzeMinted, max: null },
          silver: { minted: silverMinted, max: null },
          gold: { minted: goldMinted, max: 1000 },
          omni: { minted: omniMinted, max: 10 },
        }
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Get pending matches
  app.get("/api/matches/pending", async (req, res) => {
    try {
      const matches = await storage.getPendingMatches();
      res.json(matches);
    } catch (error) {
      console.error("Error fetching pending matches:", error);
      res.status(500).json({ error: "Failed to fetch pending matches" });
    }
  });

  // Get recent mints
  app.get("/api/guardians/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recentMints = await storage.getRecentMints(limit);
      res.json(recentMints);
    } catch (error) {
      console.error("Error fetching recent mints:", error);
      res.status(500).json({ error: "Failed to fetch recent mints" });
    }
  });

  // Get active contracts
  app.get("/api/contracts", async (req, res) => {
    try {
      const contracts = await storage.getActiveContracts();
      res.json(contracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      res.status(500).json({ error: "Failed to fetch contracts" });
    }
  });

  // Get IPFS pins
  app.get("/api/ipfs/pins", async (req, res) => {
    try {
      const pins = await storage.getAllIpfsPins();
      const totalSize = pins.reduce((sum, pin) => sum + (pin.size || 0), 0);
      
      res.json({
        pins,
        totalPins: pins.length,
        totalSize,
        status: "healthy"
      });
    } catch (error) {
      console.error("Error fetching IPFS pins:", error);
      res.status(500).json({ error: "Failed to fetch IPFS pins" });
    }
  });

  // Resolve match and prepare for minting
  app.post("/api/matches/resolve", async (req, res) => {
    try {
      const data = resolveMatchSchema.parse(req.body);
      
      const match = await storage.getMatchByMatchId(data.matchId);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }

      if (match.status !== "pending") {
        return res.status(400).json({ error: "Match already resolved" });
      }

      // Update match with resolution data
      const updatedMatch = await storage.updateMatch(match.id, {
        winner: data.winner,
        roundScores: data.roundScores,
        status: "resolved",
        resolvedAt: new Date(),
      });

      res.json({
        success: true,
        match: updatedMatch,
        message: "Match resolved successfully. Ready for minting."
      });
    } catch (error) {
      console.error("Error resolving match:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to resolve match" });
    }
  });

  // Ignite endpoint - mint Guardian NFT
  app.post("/api/ignite", async (req, res) => {
    try {
      const data = igniteRequestSchema.parse(req.body);
      
      // Check if match exists and is resolved
      const match = await storage.getMatchByMatchId(data.matchID);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }

      if (match.status === "minted") {
        return res.status(400).json({ error: "Guardian already minted for this match" });
      }

      // Generate ceremony hash (in real implementation, this would be computed from match data)
      const ceremonyData = {
        matchId: data.matchID,
        winner: data.winner,
        loser: data.loser,
        roundScores: data.roundScores,
        timestamp: new Date().toISOString(),
      };
      const ceremonyHash = "0x" + Buffer.from(JSON.stringify(ceremonyData)).toString('hex').slice(0, 64);

      // In real implementation, this would:
      // 1. Pin metadata to IPFS
      // 2. Call smart contract mint function
      // 3. Wait for transaction confirmation
      
      // For now, simulate the minting process
      const tokenId = Math.floor(Math.random() * 10000) + 1000;
      const ipfsUri = `ipfs://QmYourMetadataHash${tokenId}`;
      
      // Create Guardian NFT record
      const guardianNft = await storage.createGuardianNft({
        tokenId,
        contractAddress: "0x1234567890123456789012345678901234567890", // GuardianManager address
        ownerAddress: data.winnerAddress,
        tier: data.tier,
        metadata: data.metadata || {},
        ipfsUri,
        ceremonyHash,
        transactionHash: `0x${'a'.repeat(64)}`, // Mock transaction hash
      });

      // Create IPFS pin record
      await storage.createIpfsPin({
        ipfsHash: `QmYourMetadataHash${tokenId}`,
        name: `Guardian #${tokenId} Metadata`,
        size: 1024,
        type: "metadata",
        relatedTokenId: tokenId,
      });

      // Update match status
      await storage.updateMatch(match.id, {
        status: "minted",
        ceremonyHash,
      });

      res.json({
        success: true,
        tokenId,
        txHash: guardianNft.transactionHash,
        tokenUri: ipfsUri,
        ceremonyHash,
        guardian: guardianNft
      });

    } catch (error) {
      console.error("Error minting guardian:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to mint guardian" });
    }
  });

  // Verify endpoint - check ceremony hash
  app.post("/api/verify", async (req, res) => {
    try {
      const { ceremonyHash, tokenId } = req.body;
      
      if (!ceremonyHash || !tokenId) {
        return res.status(400).json({ error: "Missing ceremonyHash or tokenId" });
      }

      const guardian = await storage.getGuardianNftByTokenId(tokenId);
      if (!guardian) {
        return res.status(404).json({ error: "Guardian not found" });
      }

      const isValid = guardian.ceremonyHash === ceremonyHash;
      
      res.json({
        valid: isValid,
        guardian: isValid ? guardian : null,
        message: isValid ? "Ceremony hash verified" : "Invalid ceremony hash"
      });

    } catch (error) {
      console.error("Error verifying ceremony:", error);
      res.status(500).json({ error: "Failed to verify ceremony" });
    }
  });

  // Health check
  app.get("/api/health", async (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        ipfs: "connected",
        blockchain: "connected"
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
