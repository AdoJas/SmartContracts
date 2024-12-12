# Decentralized Scratch Lottery System

## Project Overview

### Architecture
- Smart Contract (Solidity)
- Web Frontend (JavaScript/HTML/CSS)
- Relayer Service (Node.js)

### Components
1. **ScratchLottery.sol**
   - Ticket management
   - Prize distribution
   - Secure withdrawals
   - Relayer integration

2. **Frontend Application**
   - MetaMask integration
   - Interactive scratch interface
   - User dashboard
   - Transaction management

### Key Features

#### Smart Contract
- Secure ticket issuance
- Verifiable randomization
- Automated prize distribution
- Gas optimization via relayer

#### User Interface
- Wallet connection
- Ticket purchasing
- Interactive scratching
- Prize visualization
- Balance management
- Balance withdrawal

### Security Measures
1. Relayer validation
2. Prize pool protection
3. Withdrawal verification
4. Transaction safety checks

### Testing Environment
- Local: Ganache
- Tools: Truffle, MetaMask

### Development Stack
- Solidity ^0.8.7
- Web3.js
- Bootstrap
- Node.js

### Prize Distribution Model
This model is for demonstration purposes only.
This is not a self sustaining model. 

```
for every 1000 tickets sold:

Revenue: 10 ETH (1000 * 0.01)
Expected Prizes: ~13.3 ETH
Net Loss: ~-3.3 ETH
Profit Margin: ~-33%
```
```solidity
function _calculatePrize(uint256 randomness) internal pure returns (uint256) {
    uint256 outcome = randomness % 100;
    if (outcome < 10) return 1 ether;      // 10% chance
    if (outcome < 30) return 0.1 ether;    // 20% chance
    if (outcome < 60) return 0.01 ether;   // 30% chance
    return 0;                              // 40% chance
}
```
### Project Structure

```scratch-lottery/
├── contracts/
│   └── ScratchLottery.sol
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── lottery.js
├── test/
│   └── scratch_lottery_test.js
└── [truffle-config.js]
```

## Implementation Benefits

1. **Transparency**: All operations recorded on blockchain
2. **Fairness**: Verifiable random number generation
3. **Security**: Smart contract-based fund management
4. **UX**: Gas-free scratching via relayer
5. **Automation**: Instant prize distribution

## Some pictures:
1. Initial screen ![image](https://github.com/user-attachments/assets/b7390ed0-a989-4487-b606-537d184cff37)
2. User profile screen ![image](https://github.com/user-attachments/assets/22f01e93-89da-4efb-89b5-2a8880854a84)
3. Buying a ticket ![image](https://github.com/user-attachments/assets/a0d27418-550f-4a73-9869-cd897dc6be49)
4. Confirming ticket purchase ![image](https://github.com/user-attachments/assets/2af09fcf-9c47-400d-8d56-36e9d7261756)
5. Scratch a ticket ![image](https://github.com/user-attachments/assets/a0904fac-73f7-4550-93a1-050364b64227)
6. Relaying ticket scratching to another account ![image](https://github.com/user-attachments/assets/f7021c14-baa6-45f3-b29c-cba9c787e7e3)
7. Personal statistics ![image](https://github.com/user-attachments/assets/177fbcee-49a2-4e02-b060-bec8c8ee21c5)





