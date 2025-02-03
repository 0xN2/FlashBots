

# Rescue a Compromised Wallet Using Flashbots: 
### This README explains how the provided scripts work and how they can be used to rescue a compromised wallet using Flashbots. The scripts are designed to automate the process of monitoring a compromised wallet and transferring funds securely using Flashbots' private mempool transactions.

## Overview
The scripts are split into two main parts:

1. Monitoring and ETH Transfer Script
This script continuously monitors the compromised wallet for incoming ETH.
When ETH is detected, it automatically transfers the received funds to a specified recipient address.

2. Flashbots Bundle Script
This script uses Flashbots to create and send a bundle of transactions.
It allows you to send ETH to the compromised wallet and simultaneously transfer ERC20 tokens from the compromised wallet to a recipient address.
This ensures that any incoming ETH to the compromised wallet is immediately used to transfer tokens out, minimizing exposure.


## How It Works
Key Components
1. Monitoring and ETH Transfer Script
Compromised Wallet: The script monitors the compromised wallet's balance using a polling mechanism.
Balance Check: Every 5 seconds, the script checks if the compromised wallet's balance has increased.
Transfer Mechanism: If ETH is detected, the script constructs and sends a transaction to transfer the received ETH to the recipient address.
Gas Fees: The script calculates gas fees dynamically to ensure the transaction is sent with optimal gas costs.

2. Flashbots Bundle Script
Flashbots Provider: The script connects to the Flashbots relay to send transactions directly to miners, bypassing the public mempool.
Bundle Transactions:
Transaction 1: Sends ETH to the compromised wallet (sponsored by another wallet).
Transaction 2: Transfers ERC20 tokens from the compromised wallet to the recipient address.
Simulation and Broadcasting: The script simulates the bundle to check for errors and then broadcasts it to the network, ensuring it is included in the next block.


### Deployment Steps
Prerequisites

### Environment Variables:
ALCHEMY: Your Alchemy API key for the Sepolia testnet.
SPONSOR_KEY: The private key of a wallet that will sponsor the gas fees.
COMPROMISED_KEY: The private key of the compromised wallet.



Run the Scripts
First Script (Monitoring and ETH Transfer):

bash´´´ 

node monitoring-attack.js
This script will start monitoring the compromised wallet for incoming ETH.
´´´ 

Second Script (Flashbots Bundle):

bash
node flashbots-rescue.js
This script will send a bundle of transactions to transfer ETH to the compromised wallet and simultaneously transfer tokens out.


