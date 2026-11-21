import { 
  type User, 
  type InsertUser, 
  type GuardianNft, 
  type InsertGuardianNft,
  type Match,
  type InsertMatch,
  type Contract,
  type InsertContract,
  type IpfsPin,
  type InsertIpfsPin
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Guardian NFTs
  getGuardianNft(id: string): Promise<GuardianNft | undefined>;
  getGuardianNftByTokenId(tokenId: number): Promise<GuardianNft | undefined>;
  createGuardianNft(nft: InsertGuardianNft): Promise<GuardianNft>;
  getGuardianNftsByTier(tier: number): Promise<GuardianNft[]>;
  getRecentMints(limit?: number): Promise<GuardianNft[]>;

  // Matches
  getMatch(id: string): Promise<Match | undefined>;
  getMatchByMatchId(matchId: string): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: string, updates: Partial<Match>): Promise<Match>;
  getPendingMatches(): Promise<Match[]>;
  getMatchesByStatus(status: string): Promise<Match[]>;

  // Contracts
  getContract(id: string): Promise<Contract | undefined>;
  getContractByName(name: string): Promise<Contract | undefined>;
  createContract(contract: InsertContract): Promise<Contract>;
  getActiveContracts(): Promise<Contract[]>;

  // IPFS Pins
  getIpfsPin(id: string): Promise<IpfsPin | undefined>;
  createIpfsPin(pin: InsertIpfsPin): Promise<IpfsPin>;
  getIpfsPinsByType(type: string): Promise<IpfsPin[]>;
  getAllIpfsPins(): Promise<IpfsPin[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private guardianNfts: Map<string, GuardianNft>;
  private matches: Map<string, Match>;
  private contracts: Map<string, Contract>;
  private ipfsPins: Map<string, IpfsPin>;

  constructor() {
    this.users = new Map();
    this.guardianNfts = new Map();
    this.matches = new Map();
    this.contracts = new Map();
    this.ipfsPins = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed some initial data for demonstration
    const contract1: Contract = {
      id: randomUUID(),
      name: "GuardianManager",
      address: "0x1234567890123456789012345678901234567890",
      network: "goerli",
      isActive: true,
      deployedAt: new Date(),
    };

    const contract2: Contract = {
      id: randomUUID(),
      name: "IReceipt",
      address: "0x9876543210987654321098765432109876543210",
      network: "goerli",
      isActive: true,
      deployedAt: new Date(),
    };

    this.contracts.set(contract1.id, contract1);
    this.contracts.set(contract2.id, contract2);

    // Seed some pending matches
    const match1: Match = {
      id: randomUUID(),
      matchId: "guard-2025-01-12-0001",
      challenger1: "0x8f9a1234567890123456789012345678901234b2c",
      challenger2: "0x7c8b9876543210987654321098765432109876d1e",
      winner: null,
      tier: 2, // Gold
      roundScores: null,
      status: "pending",
      ceremonyHash: null,
      createdAt: new Date(),
      resolvedAt: null,
    };

    const match2: Match = {
      id: randomUUID(),
      matchId: "guard-2025-01-12-0002",
      challenger1: "0x6b7a1111222233334444555566667777888899ff",
      challenger2: "0x5a6b2222333344445555666677778888999900aa",
      winner: null,
      tier: 1, // Silver
      roundScores: null,
      status: "pending",
      ceremonyHash: null,
      createdAt: new Date(),
      resolvedAt: null,
    };

    this.matches.set(match1.id, match1);
    this.matches.set(match2.id, match2);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Guardian NFTs
  async getGuardianNft(id: string): Promise<GuardianNft | undefined> {
    return this.guardianNfts.get(id);
  }

  async getGuardianNftByTokenId(tokenId: number): Promise<GuardianNft | undefined> {
    return Array.from(this.guardianNfts.values()).find(nft => nft.tokenId === tokenId);
  }

  async createGuardianNft(insertNft: InsertGuardianNft): Promise<GuardianNft> {
    const id = randomUUID();
    const nft: GuardianNft = { 
      ...insertNft, 
      id, 
      createdAt: new Date() 
    };
    this.guardianNfts.set(id, nft);
    return nft;
  }

  async getGuardianNftsByTier(tier: number): Promise<GuardianNft[]> {
    return Array.from(this.guardianNfts.values()).filter(nft => nft.tier === tier);
  }

  async getRecentMints(limit = 10): Promise<GuardianNft[]> {
    return Array.from(this.guardianNfts.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  // Matches
  async getMatch(id: string): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async getMatchByMatchId(matchId: string): Promise<Match | undefined> {
    return Array.from(this.matches.values()).find(match => match.matchId === matchId);
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = randomUUID();
    const match: Match = { 
      ...insertMatch, 
      id, 
      createdAt: new Date(),
      resolvedAt: null 
    };
    this.matches.set(id, match);
    return match;
  }

  async updateMatch(id: string, updates: Partial<Match>): Promise<Match> {
    const match = this.matches.get(id);
    if (!match) {
      throw new Error("Match not found");
    }
    const updatedMatch = { ...match, ...updates };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }

  async getPendingMatches(): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(match => match.status === "pending");
  }

  async getMatchesByStatus(status: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(match => match.status === status);
  }

  // Contracts
  async getContract(id: string): Promise<Contract | undefined> {
    return this.contracts.get(id);
  }

  async getContractByName(name: string): Promise<Contract | undefined> {
    return Array.from(this.contracts.values()).find(contract => contract.name === name);
  }

  async createContract(insertContract: InsertContract): Promise<Contract> {
    const id = randomUUID();
    const contract: Contract = { 
      ...insertContract, 
      id, 
      deployedAt: new Date() 
    };
    this.contracts.set(id, contract);
    return contract;
  }

  async getActiveContracts(): Promise<Contract[]> {
    return Array.from(this.contracts.values()).filter(contract => contract.isActive);
  }

  // IPFS Pins
  async getIpfsPin(id: string): Promise<IpfsPin | undefined> {
    return this.ipfsPins.get(id);
  }

  async createIpfsPin(insertPin: InsertIpfsPin): Promise<IpfsPin> {
    const id = randomUUID();
    const pin: IpfsPin = { 
      ...insertPin, 
      id, 
      createdAt: new Date() 
    };
    this.ipfsPins.set(id, pin);
    return pin;
  }

  async getIpfsPinsByType(type: string): Promise<IpfsPin[]> {
    return Array.from(this.ipfsPins.values()).filter(pin => pin.type === type);
  }

  async getAllIpfsPins(): Promise<IpfsPin[]> {
    return Array.from(this.ipfsPins.values());
  }
}

export const storage = new MemStorage();
