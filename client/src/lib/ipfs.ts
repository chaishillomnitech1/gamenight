// IPFS utilities for Guardian NFT platform

export interface IPFSFile {
  name: string;
  hash: string;
  size: number;
  type?: string;
}

export interface GuardianMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  ceremony_hash: string;
  matchID: string;
  provenanceURI: string;
}

export class IPFSService {
  private static instance: IPFSService;
  private pinataApiKey: string | null = null;
  private pinataSecretKey: string | null = null;

  static getInstance(): IPFSService {
    if (!IPFSService.instance) {
      IPFSService.instance = new IPFSService();
    }
    return IPFSService.instance;
  }

  configure(apiKey: string, secretKey: string) {
    this.pinataApiKey = apiKey;
    this.pinataSecretKey = secretKey;
  }

  async pinJSON(data: any, name?: string): Promise<IPFSFile> {
    if (!this.pinataApiKey || !this.pinataSecretKey) {
      throw new Error("IPFS service not configured with API keys");
    }

    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
    
    const body = {
      pinataContent: data,
      pinataMetadata: {
        name: name || `metadata-${Date.now()}`,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`IPFS pinning failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        name: name || result.pinataMetadata?.name || 'Unknown',
        hash: result.IpfsHash,
        size: result.PinSize || 0,
        type: 'json',
      };
    } catch (error) {
      console.error("Failed to pin JSON to IPFS:", error);
      throw error;
    }
  }

  async pinFile(file: File): Promise<IPFSFile> {
    if (!this.pinataApiKey || !this.pinataSecretKey) {
      throw new Error("IPFS service not configured with API keys");
    }

    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pinataMetadata', JSON.stringify({
      name: file.name,
    }));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`IPFS file pinning failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        name: file.name,
        hash: result.IpfsHash,
        size: result.PinSize || file.size,
        type: file.type,
      };
    } catch (error) {
      console.error("Failed to pin file to IPFS:", error);
      throw error;
    }
  }

  async unpinFile(hash: string): Promise<boolean> {
    if (!this.pinataApiKey || !this.pinataSecretKey) {
      throw new Error("IPFS service not configured with API keys");
    }

    const url = `https://api.pinata.cloud/pinning/unpin/${hash}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey,
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Failed to unpin file from IPFS:", error);
      return false;
    }
  }

  async getPinnedFiles(): Promise<IPFSFile[]> {
    if (!this.pinataApiKey || !this.pinataSecretKey) {
      throw new Error("IPFS service not configured with API keys");
    }

    const url = "https://api.pinata.cloud/data/pinList";

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pinned files: ${response.statusText}`);
      }

      const result = await response.json();
      
      return result.rows.map((item: any) => ({
        name: item.metadata?.name || 'Unknown',
        hash: item.ipfs_pin_hash,
        size: item.size || 0,
        type: item.metadata?.type || 'unknown',
      }));
    } catch (error) {
      console.error("Failed to get pinned files:", error);
      throw error;
    }
  }

  getIPFSUrl(hash: string): string {
    return `ipfs://${hash}`;
  }

  getHTTPUrl(hash: string, gateway = "https://gateway.pinata.cloud"): string {
    return `${gateway}/ipfs/${hash}`;
  }

  createGuardianMetadata(
    tokenId: number,
    tier: number,
    matchId: string,
    ceremonyHash: string,
    provenanceURI: string,
    customAttributes: Array<{ trait_type: string; value: string | number }> = []
  ): GuardianMetadata {
    const tierNames = ["Bronze", "Silver", "Gold", "Omni"];
    const tierName = tierNames[tier] || "Unknown";

    return {
      name: `Guardian #${tokenId}`,
      description: `A ${tierName} tier Guardian NFT representing ceremonial prowess and achievement in the Flame Court challenges.`,
      image: `/crest.svg`, // This would be the actual NFT image
      attributes: [
        { trait_type: "Tier", value: tierName },
        { trait_type: "Token ID", value: tokenId },
        { trait_type: "Match ID", value: matchId },
        { trait_type: "Generation", value: 1 },
        ...customAttributes,
      ],
      ceremony_hash: ceremonyHash,
      matchID: matchId,
      provenanceURI: provenanceURI,
    };
  }
}

export const ipfsService = IPFSService.getInstance();
