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
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "authorizedRelayers",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
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
      "inputs": [
        {
          "internalType": "address",
          "name": "relayer",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "status",
          "type": "bool"
        }
      ],
      "name": "setRelayer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newPrice",
          "type": "uint256"
        }
      ],
      "name": "setTicketPrice",
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
          "name": "numberOfTickets",
          "type": "uint256"
        }
      ],
      "name": "purchaseMultipleTickets",
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
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "clientSeed",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "scratchTicketMeta",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "messageHash",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "recoverSigner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "sig",
          "type": "bytes"
        }
      ],
      "name": "splitSignature",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getTotalTickets",
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
      "name": "getTotalPrizePool",
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
    }
  ];
const contractAddress = "0xe423AcC16C8cF663a6c0A6A194b7446764687612";

if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // Ensure user authorizes
} else {
    alert("Please install MetaMask!");
}

async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            const userAddress = accounts[0];
            localStorage.setItem("userAddress", userAddress);

            const balance = await web3.eth.getBalance(userAddress);
            const balanceInEth = web3.utils.fromWei(balance, "ether");

            document.getElementById("user-avatar").src = `https://avatars.dicebear.com/api/identicon/${userAddress}.svg`;
            document.getElementById("user-address").textContent = `Address: ${userAddress}`;
            document.getElementById("user-balance").textContent = `Balance: ${balanceInEth} ETH`;
            document.getElementById("user-profile").style.display = "block";

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
        loadUnscratchedTickets(); 
    } catch (error) {
        console.error("Error purchasing ticket:", error);
        alert("Error purchasing ticket: " + error.message);
    }
}

async function purchaseMultipleTickets() {
    const numberOfTickets = parseInt(document.getElementById("ticket-count").value, 10);
    if (numberOfTickets <= 0) {
        alert("Please enter a valid number of tickets.");
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const totalCost = web3.utils.toWei((numberOfTickets * 0.01).toString(), "ether");

    try {
        await lotteryContract.methods.purchaseMultipleTickets(numberOfTickets).send({
            from: accounts[0],
            value: totalCost,
        });
        alert(`${numberOfTickets} tickets purchased successfully!`);
        loadUnscratchedTickets(); 
    } catch (error) {
        console.error("Error purchasing tickets:", error);
        alert("Error purchasing tickets. Check console for details.");
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
                ticket.status == 0 ? "Unscratched" : "Scratched"
            }, Prize: ${web3.utils.fromWei(ticket.prize, "ether")} ETH`;
            ticketsList.appendChild(ticketElement);
        }
    }
}

async function loadUnscratchedTickets() {
    const userAddress = localStorage.getItem("userAddress");
    const ticketCards = document.getElementById("ticket-cards");
    ticketCards.innerHTML = "";

    const ticketCount = await lotteryContract.methods.ticketCounter().call();

    for (let i = 1; i <= ticketCount; i++) {
        const ticket = await lotteryContract.methods.tickets(i).call();

        if (ticket.owner.toLowerCase() === userAddress.toLowerCase() && ticket.status == 0) {
            const card = document.createElement("div");
            card.className = "col-md-4 ticket-card";
            card.setAttribute("data-ticket-id", i);
            card.innerHTML = `
                <div class="ticket-info">
                    <h5>Ticket ID: ${i}</h5>
                    <p>Status: Unscratched</p>
                    <canvas class="scratch-area" width="200" height="100"></canvas>
                    <button class="scratch-button" onclick="relayScratchTicket(${i})">Scratch</button>
                </div>
            `;
            ticketCards.appendChild(card);
        }
    }
}

async function relayScratchTicket(ticketId) {
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];
    const clientSeed = generateSecureClientSeed();

    const message = web3.utils.soliditySha3(ticketId, userAddress, clientSeed);
    const signature = await web3.eth.personal.sign(message, userAddress);

    try {
        const response = await fetch("http://localhost:4000/relay", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userAddress,
                ticketId,
                clientSeed,
                signature,
            }),
        });

        const result = await response.json();
        if (result.success) {
            console.log("Transaction relayed:", result.transactionHash);
            alert("Your ticket has been scratched successfully!");

            loadUnscratchedTickets();
        } else {
            console.error("Relayer error:", result.error);
            alert("Failed to relay transaction.");
        }
    } catch (error) {
        console.error("Error relaying transaction:", error);
        alert("Error relaying transaction. Please try again.");
    }
}


function displayPrize(prize, card) {
    const prizeMessage = card.querySelector(".prize-message");
    if (prizeMessage) {
        prizeMessage.textContent = prize > 0
            ? `Congratulations! You won ${prize} ETH!`
            : "Better luck next time!";
        prizeMessage.style.color = prize > 0 ? "green" : "red";
    } else {
        console.error("Prize message element not found.");
    }
}

function initScratchArea(ticketId, prize) {
    const card = document.querySelector(`.ticket-card[data-ticket-id="${ticketId}"]`);
    if (!card) {
        console.error(`Card for Ticket ID ${ticketId} not found.`);
        return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 100;
    canvas.className = "scratch-area";
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText("Scratch Here", canvas.width / 2, canvas.height / 2);

    ctx.globalCompositeOperation = "destination-out";

    let isDrawing = false;
    canvas.onmousedown = () => (isDrawing = true);
    canvas.onmouseup = () => (isDrawing = false);
    canvas.onmousemove = (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        if (isMostlyCleared(ctx, canvas)) {
            canvas.style.pointerEvents = "none"; 
            displayPrize(prize, card); 
        }
    };

    card.appendChild(canvas);

    let prizeMessage = card.querySelector(".prize-message");
    if (!prizeMessage) {
        prizeMessage = document.createElement("p");
        prizeMessage.className = "prize-message";
        prizeMessage.textContent = ""; 
        card.appendChild(prizeMessage);
    }
}

function isMostlyCleared(ctx, canvas) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clearedPixels = 0;

    for (let i = 3; i < imageData.length; i += 4) {
        if (imageData[i] === 0) clearedPixels++;
    }

    return clearedPixels / (canvas.width * canvas.height) > 0.9; 
}
function navigateTo(page) {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("buy-tickets").style.display = "none";
    document.getElementById("profile").style.display = "none";
    document.getElementById("scratch-tickets").style.display = "none";

    document.getElementById(page).style.display = "block";

    if (page === "profile") {
        loadTickets();
    } else if (page === "scratch-tickets") {
        loadUnscratchedTickets();
    }
}

function loadMainMenu() {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-menu").style.display = "block";
}

function generateSecureClientSeed() {
    return crypto.getRandomValues(new Uint32Array(4))
        .reduce((acc, val) => acc + val.toString(36), '');
}

window.addEventListener("load", initWeb3);
document.getElementById("login-btn").addEventListener("click", connectWallet);
