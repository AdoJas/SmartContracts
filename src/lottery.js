let web3;
let lotteryContract;
let web3Initialized = false;

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

const contractAddress = "0x27987e1f30EE244dCAeCF0F59cBD2bB54E51517e";

async function initWeb3() {
    try {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            await window.ethereum.enable();

            lotteryContract = new web3.eth.Contract(lotteryABI, contractAddress);
            web3Initialized = true;

            console.log("Contract initialized:", lotteryContract);
        } else {
            alert("Please install MetaMask to use this DApp!");
        }
    } catch (err) {
        console.error("Error initializing Web3:", err);
        alert("Failed to initialize Web3. Check the console for details.");
    }
}

async function connectWallet() {
    try {
        await initWeb3();
        alert("Wallet connected successfully!");
    } catch (err) {
        console.error("Error connecting wallet:", err);
        alert("Failed to connect wallet.");
    }
}

async function purchaseTicket() {
    try {
        if (!web3Initialized || !lotteryContract) {
            alert("Web3 or contract is not initialized. Please connect your wallet first.");
            return;
        }

        const accounts = await web3.eth.getAccounts();
        console.log("MetaMask Accounts:", accounts);

        if (!accounts || accounts.length === 0) {
            alert("No MetaMask accounts found. Please ensure MetaMask is connected.");
            return;
        }

        await lotteryContract.methods.purchaseTicket().send({
            from: accounts[0],
            value: web3.utils.toWei("0.01", "ether"),
        });
        alert("Ticket purchased successfully!");
    } catch (error) {
        console.error("Error purchasing ticket:", error);
        alert("Failed to purchase ticket.");
    }
}

async function scratchTicket() {
    try {
        const ticketId = document.getElementById("ticketId").value;
        if (!ticketId) {
            alert("Please enter a valid ticket ID!");
            return;
        }

        if (!web3Initialized || !lotteryContract) {
            alert("Contract not initialized. Please connect your wallet first.");
            return;
        }

        const accounts = await web3.eth.getAccounts();
        await lotteryContract.methods.scratchTicket(ticketId).send({
            from: accounts[0],
        });
        alert(`Ticket #${ticketId} scratched successfully!`);
    } catch (error) {
        console.error("Error scratching ticket:", error);
        alert("Failed to scratch ticket.");
    }
}

window.addEventListener("load", initWeb3);
