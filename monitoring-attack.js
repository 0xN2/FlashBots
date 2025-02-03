require('dotenv').config();
const { ethers } = require("ethers");

// Set up the network
const CHAIN_ID = 11155111; // Sepolia testnet chain ID
const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY}`); // Adjust the URL for your network

// Compromised wallet
const compromisedPrivateKey = process.env.COMPROMISED_KEY;
const compromisedWallet = new ethers.Wallet(compromisedPrivateKey).connect(provider);
const compromisedAddress = compromisedWallet.address;

// Recipient address where the ETH will be sent
const recipientAddress = "0x00000a361768B83abD80265Fc160807fEdB8C54b"; // Replace with your recipient address
//compromised Wallet : account n7,  0xCE1583fE69D0FeB1ef08760bd2fE0A73525921e4

const main = async () => {
    console.log("Monitoring the compromised wallet for incoming ETH...");

    // Get the initial balance
    let previousBalance = await provider.getBalance(compromisedAddress);

    // Polling every 5 seconds to check for balance changes
    setInterval(async () => {
        try {
            const currentBalance = await provider.getBalance(compromisedAddress);

            // Check if the balance has increased
            if (currentBalance > previousBalance) {
                console.log(`Received ETH! New Balance: ${ethers.formatEther(currentBalance)} ETH`);

                // Proceed to send the ETH to the recipient
                await sendTransaction(currentBalance);
            }

            // Update the previous balance
            previousBalance = currentBalance;
        } catch (error) {
            console.error("Error in monitoring loop:", error);
        }
    }, 5000); // Poll every 5 seconds
};

// Function to send the ETH to the recipient
const sendTransaction = async (currentBalance) => {
    console.log("Preparing to send ETH from compromised wallet...");

    // Calculate gas limit
    const gasLimit = 21000n; // Use 'n' for BigInt

    // Fetch fee data
    const feeData = await provider.getFeeData();
    const maxFeePerGas = feeData.maxFeePerGas;
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;

    // Ensure the fee data is available
    if (maxFeePerGas === null || maxPriorityFeePerGas === null) {
        console.error("Could not retrieve gas fee data.");
        return;
    }

    // Calculate total gas cost
    const gasCost = maxFeePerGas * gasLimit;

    // Calculate the amount to send (total balance minus gas cost)
    const amountToSend = currentBalance - gasCost;

    if (amountToSend <= 0n) {
        console.log("Not enough balance to cover gas fees.");
        return;
    }

    // Get the nonce
    const compromisedNonce = await provider.getTransactionCount(compromisedAddress);

    // Construct the transaction
    const tx = {
        type: 2, // EIP-1559 transaction
        chainId: CHAIN_ID,
        nonce: compromisedNonce,
        to: recipientAddress,
        value: amountToSend,
        gasLimit: gasLimit,
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
    };

    try {
        // Send the transaction
        console.log("Sending transaction...");
        const transactionResponse = await compromisedWallet.sendTransaction(tx);

        console.log(`Transaction hash: ${transactionResponse.hash}`);

        // Wait for the transaction to be mined
        const receipt = await transactionResponse.wait();

        console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
};

main();