console.log("lottery.js loaded");
const lotteryArtifact = require("../build/contracts/ScratchLottery.json");
const lotteryABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "ticketId",
                "type": "uint256"
            }
        ],
        "name": "TicketPurchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "ticketId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "prize",
                "type": "uint256"
            }
        ],
        "name": "TicketScratched",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "ticketCounter",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "ticketPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "tickets",
        "outputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "enum ScratchLottery.TicketStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "prize",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "totalPrizePool",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "purchaseTicket",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "ticketId",
                "type": "uint256"
            }
        ],
        "name": "scratchTicket",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawEther",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const contractAddress = "0x53D5bb86238461a09211303bC6251DeC3A92209c";
let lotteryContract;
let userAccount;



async function connectWallet() {
    try {
        if (window.ethereum) {
            console.log("MetaMask detected!");
            web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            console.log("Web3 initialized:", web3);
        } else {
            alert("Please install MetaMask!");
        }
    } catch (err) {
        console.error("Error connecting to MetaMask:", err);
    }
}

async function purchaseTicket() {
    try {
        await lotteryContract.methods.purchaseTicket().send({
            from: userAccount,
            value: Web3.utils.toWei("0.01", "ether"),
        });
        alert("Ticket purchased!");
    } catch (err) {
        console.error(err);
        alert("Failed to purchase ticket.");
    }
}

async function scratchTicket(ticketId) {
    try {
        await lotteryContract.methods.scratchTicket(ticketId).send({
            from: userAccount,
        });
        alert("Ticket scratched!");
    } catch (err) {
        console.error(err);
        alert("Failed to scratch ticket.");
    }
}
async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); 
    } else {
        alert("Please install MetaMask!");
    }

    lotteryContract = new web3.eth.Contract(lotteryABI, contractAddress);
    console.log("Contract initialized:", lotteryContract);
}
