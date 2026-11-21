# Guardian NFT Platform

## Overview

This is a Guardian NFT platform for managing ceremonial matches and minting tiered NFTs. The platform combines Web3 functionality with a React dashboard to create a complete NFT management system. Users can resolve matches, mint Guardian NFTs in different tiers (Bronze, Silver, Gold, Omni), and manage metadata through IPFS integration. The system features real-time statistics, pending match resolution, and comprehensive admin controls for managing the entire Guardian ecosystem.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with **React 18** and **TypeScript**, using **Vite** as the build tool. The UI leverages **shadcn/ui** components built on top of **Radix UI** primitives for accessibility and consistency. **TailwindCSS** handles styling with a dark theme-first approach and custom color variables for the ceremonial aesthetic.

State management utilizes **TanStack Query** for server state and caching, with **Wouter** for client-side routing. The component architecture follows a modular approach with reusable UI components and specialized dashboard components for different data views.

### Backend Architecture  
The server is built with **Express.js** and **TypeScript**, running in ESM module format. The backend provides RESTful API endpoints for managing matches, Guardian NFTs, contracts, and IPFS pins. A custom storage interface abstracts data operations, currently implemented with in-memory storage for development.

The server includes middleware for request logging, JSON parsing, and error handling. Development mode integrates Vite middleware for hot module replacement.

### Database Design
The schema uses **Drizzle ORM** with **PostgreSQL** as the target database. Key entities include:
- **Users**: Basic user authentication and management
- **Guardian NFTs**: Tiered NFT records with metadata and IPFS links
- **Matches**: Ceremonial match data with scoring and resolution status  
- **Contracts**: Smart contract deployment tracking
- **IPFS Pins**: Metadata storage and provenance records

The schema supports tier-based NFT minting (0=Bronze, 1=Silver, 2=Gold, 3=Omni) with ceremony hash tracking for immutable records.

### Web3 Integration
The platform integrates Web3 functionality through a custom service layer that handles wallet connections via MetaMask, network switching to testnets, and contract interactions. The architecture supports smart contract deployment tracking and transaction monitoring.

### File Storage Strategy
IPFS integration through **Pinata** handles metadata storage and provenance. The system pins JSON metadata for Guardian NFTs and maintains IPFS hash records in the database for retrieval and verification.

## External Dependencies

### Core Framework Dependencies
- **React 18** with TypeScript for the frontend framework
- **Express.js** for the backend server
- **Vite** for build tooling and development server
- **TailwindCSS** for styling and design system

### UI and Component Libraries  
- **shadcn/ui** component library built on Radix UI primitives
- **@radix-ui/react-*** packages for accessible UI components
- **Lucide React** for icon system
- **class-variance-authority** for component variants

### Data and State Management
- **TanStack Query** for server state management and caching
- **React Hook Form** with **@hookform/resolvers** for form handling
- **Zod** for schema validation and type safety
- **Drizzle ORM** with **drizzle-kit** for database operations

### Database and Storage
- **PostgreSQL** via **@neondatabase/serverless** for production database
- **Pinata SDK** (@pinata/sdk) for IPFS metadata storage
- **connect-pg-simple** for session storage

### Blockchain and Web3
- **@nomiclabs/hardhat-ethers** for smart contract development
- **@openzeppelin/contracts** for secure contract implementations
- Ethereum wallet integration (MetaMask) for transaction signing

### Development and Build Tools
- **esbuild** for server-side bundling
- **tsx** for TypeScript execution in development
- **@replit/vite-plugin-*** packages for Replit-specific tooling
- **postcss** with **autoprefixer** for CSS processing

### Utility Libraries
- **date-fns** for date formatting and manipulation
- **clsx** and **tailwind-merge** for conditional CSS classes
- **cmdk** for command palette functionality
- **nanoid** for unique ID generation