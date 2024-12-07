let web3;
let lotteryContract;

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
          "indexed": false,
          "internalType": "uint256",
          "name": "ticketId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "randomness",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "outcome",
          "type": "uint256"
        }
      ],
      "name": "DebugRandomness",
      "type": "event"
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
        },
        {
          "internalType": "string",
          "name": "clientSeed",
          "type": "string"
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
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "ticketId",
          "type": "uint256"
        }
      ],
      "name": "getTicketDetails",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "enum ScratchLottery.TicketStatus",
          "name": "",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

const contractAddress = "0x5f5DC98C0e8F0a11DFD772A132d1a7143ee531a8";

async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        lotteryContract = new web3.eth.Contract(lotteryABI, contractAddress);
        console.log("Contract initialized:", lotteryContract);
    } else {
        alert("Please install MetaMask!");
    }
}

async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            localStorage.setItem("userAddress", accounts[0]);
            loadMainMenu();
        } catch (error) {
            alert("Failed to connect MetaMask. Please try again.");
        }
    } else {
        alert("MetaMask is not installed. Please install MetaMask to use this DApp.");
    }
}

async function purchaseTicket() {
    const accounts = await web3.eth.getAccounts();
    try {
        await lotteryContract.methods.purchaseTicket().send({
            from: accounts[0],
            value: web3.utils.toWei("0.01", "ether"),
        });
        alert("Ticket purchased successfully!");
    } catch (error) {
        alert("Error purchasing ticket: " + error.message);
    }
}

async function loadTickets() {
    const userAddress = localStorage.getItem("userAddress");
    const ticketsList = document.getElementById("tickets-list");
    ticketsList.innerHTML = "";

    const ticketCount = await lotteryContract.methods.ticketCounter().call();
    for (let i = 1; i <= ticketCount; i++) {
        const ticket = await lotteryContract.methods.tickets(i).call();
        if (ticket.owner.toLowerCase() === userAddress.toLowerCase()) {
            const ticketElement = document.createElement("li");
            ticketElement.classList.add("list-group-item");
            ticketElement.textContent = `Ticket ID: ${i}, Status: ${
                ticket.status === "0" ? "Unscratched" : "Scratched"
            }, Prize: ${web3.utils.fromWei(ticket.prize, "ether")} ETH`;
            ticketsList.appendChild(ticketElement);
        }
    }
}

async function scratchTicket() {
    const ticketId = document.getElementById("scratch-ticket-id").value;
    try {
        const accounts = await web3.eth.getAccounts();
        await lotteryContract.methods.scratchTicket(ticketId, "player-seed").send({ from: accounts[0] });

        const ticket = await lotteryContract.methods.tickets(ticketId).call();
        const details = `Ticket ID: ${ticketId}, Status: Scratched, Prize: ${web3.utils.fromWei(ticket.prize, "ether")} ETH`;

        document.getElementById("ticket-details").innerText = details;

        if (ticket.prize > 0) {
            alert("Prize transferred to your wallet!");
        }
    } catch (error) {
        alert("Error scratching ticket: " + error.message);
    }
}

function navigateTo(page) {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("buy-tickets").style.display = "none";
    document.getElementById("profile").style.display = "none";
    document.getElementById("scratch-tickets").style.display = "none";

    document.getElementById(page).style.display = "block";

    if (page === "profile") loadTickets();
}

function loadMainMenu() {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-menu").style.display = "block";
}

window.addEventListener("load", initWeb3);
document.getElementById("login-btn").addEventListener("click", connectWallet);
