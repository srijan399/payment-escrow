![Edupay](./client/public/hero.png)

# EduPay - Cross-Border Stablecoin Payment System

A decentralized application (dApp) for cross-border tuition fee and donation payments using ERC20 stablecoins. The system uses an escrow mechanism where payments are held in a smart contract until approved and released by an admin.

## 🌐 Live Demo

- **Frontend**: [https://edupay-dusky.vercel.app/](https://edupay-dusky.vercel.app/)
- **Contract Address**: `0xA65CB7b99f66c82d72A0eBd038874945D025cEaD` (Sepolia Testnet)
- **Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0xA65CB7b99f66c82d72A0eBd038874945D025cEaD)

## 🚀 Quick Start

### Prerequisites

- Node.js (v23 or later)
- Git
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH for gas fees
- Test USDC tokens on Sepolia

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/srijan399/payment-escrow
   cd payment-escrow
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install web3 dependencies
   cd ../web3
   npm install
   ```

3. **Run the frontend**
   ```bash
   cd client
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

### Smart Contract Development

Navigate to the `web3` folder and use the provided Makefile:

```bash
cd web3

# Compile contracts
make compile

# Deploy to local network
make run

# Verify contract on Etherscan
make verify
```

## 📋 How It Works

### Payment Flow

1. **Deposit**: Users deposit stablecoins (USDC) into the escrow contract, specifying:
   - Amount to transfer
   - Target institution
   - Invoice reference

2. **Escrow**: Funds are held securely in the smart contract until admin approval

3. **Release/Refund**: Admin can either:
   - Release funds to the institution's wallet
   - Refund the original payer

### User Interface

- **Connect Wallet**: Connect your MetaMask wallet to Sepolia testnet
- **Make Payment**: Enter payment details and approve USDC spending
- **Track Status**: View all payments and their current status
- **Admin Panel**: Approve or refund pending payments (admin only)

### Contract Functions

#### Public Functions
- `deposit(uint amount, string institution, string invoiceRef)`: Create escrow payment
- `checkAllowance(address payer)`: Check current token allowance
- `isAllowanceSufficient(address payer, uint amount)`: Verify sufficient allowance
- `getPayments()`: Retrieve all payments

#### Admin Functions
- `release(uint id, address to)`: Release payment to institution
- `refund(uint id)`: Refund payment to original payer

### Payment States

```solidity
enum PaymentStatus {
    Staged,    // Payment deposited, awaiting approval
    Released,  // Payment released to institution
    Refunded   // Payment refunded to payer
}
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with app router
- **TypeScript**: Type-safe development
- **Wagmi**: React hooks for Ethereum
- **Tailwind CSS**: Utility-first styling

### Smart Contract
- **Solidity 0.8.28**: Smart contract development
- **Foundry**: Development framework
- **OpenZeppelin**: Security standards

## 💰 Test Tokens

To test the application on Sepolia testnet:

1. **Get Sepolia ETH**: Use [Sepolia Faucet](https://sepoliafaucet.com/)
2. **Get Test USDC**: Use [Circle's Testnet Faucet](https://faucet.circle.com/) or find USDC contract on Sepolia
3. **USDC Contract on Sepolia**: Check Etherscan for the current USDC testnet address

### Known Limitations
- Single admin model (could be upgraded to multi-sig)
- No time-based release mechanism
- Institution addresses must be provided manually

## 🎯 Assumptions & Design Decisions

1. **Single Admin Model**: The deployer becomes the admin with full control over releases and refunds
2. **Stablecoin Choice**: Uses USDC token on Sepolia (currently configured for USDC)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
