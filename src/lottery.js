let web3;
let lotteryContract;

const lotteryABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_relayer",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PrizeWithdrawn",
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
        "indexed": false,
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
    "name": "prizeBalances",
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
    "name": "relayer",
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
    "name": "totalPrizeBalances",
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
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userTickets",
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
      }
    ],
    "name": "scratchTicketMeta",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawPrizes",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
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
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserTickets",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

const contractAddress = "0x415BA39c9215F20B17E14f888276076C5c69aa01";

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
    console.log("Debug: Accounts:", accounts); 

    try {
        console.log("Debug: Calling purchaseTicket with account:", accounts[0]); 
        await lotteryContract.methods.purchaseTicket().send({
            from: accounts[0],
            value: web3.utils.toWei("0.01", "ether"),
        });
        alert("Ticket purchased successfully!");
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
    } catch (error) {
        console.error("Error purchasing tickets:", error);
        alert("Error purchasing tickets. Check console for details.");
    }
}



async function loadTickets() {
    const userAddress = localStorage.getItem("userAddress");
    const ticketsList = document.getElementById("ticket-list");
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
    console.log("Debug: loadUnscratchedTickets called"); 

    const userAddress = localStorage.getItem("userAddress");
    console.log("Debug: User Address from LocalStorage:", userAddress); 

    const ticketCards = document.getElementById("ticket-cards");
    if (!ticketCards) {
        console.error("Error: 'ticket-cards' container not found in DOM."); 
        return;
    }
    ticketCards.innerHTML = "";

    const ticketCount = await lotteryContract.methods.ticketCounter().call();
    console.log("Debug: Total Tickets in Contract:", ticketCount); 

    for (let i = 1; i <= ticketCount; i++) {
        const ticket = await lotteryContract.methods.tickets(i).call();
        console.log(`Debug: Ticket ${i}:`, ticket); 

        if (ticket.owner.toLowerCase() === userAddress.toLowerCase()) {
            console.log(`Debug: Ticket ${i} belongs to user`); 

            if (ticket.status == 0) { 
                console.log(`Debug: Ticket ${i} is unscratched`); 

                const card = document.createElement("div");
                card.className = "col-md-4 ticket-card";
                card.setAttribute("data-ticket-id", i); 
                card.innerHTML = `
                    <div class="ticket-info">
                        <h5>Ticket ID: ${i}</h5>
                        <p>Status: Unscratched</p>
                    </div>
                    <button class="scratch-button" onclick="scratchTicket(${i})">Scratch</button>
                `;
                ticketCards.appendChild(card);
            }
        }
    }

    if (ticketCards.innerHTML === "") {
        console.log("Debug: No unscratched tickets to display"); 
    }
}



async function scratchTicket(ticketId) {
    console.log(`Debug: scratchTicket called for Ticket ID: ${ticketId}`); 
    const clientSeed = generateSecureClientSeed();
    const relayerAddress = "0x456F34EF88Df11A5FB3cAB282BAd8dbf1ff7E946"; 
    const button = document.querySelector(`.scratch-button[onclick="scratchTicket(${ticketId})"]`);
    if (!button) {
        console.error(`Error: Button for Ticket ID ${ticketId} not found in DOM.`); 
        return;
    }

    button.disabled = true;

    try {
        const accounts = await web3.eth.getAccounts();
        console.log("Debug: Accounts fetched from MetaMask:", accounts); 

        console.log(`Debug: Sending transaction to scratch Ticket ID ${ticketId}`); 
        await lotteryContract.methods.scratchTicketMeta(ticketId, accounts[0], clientSeed).send({ from: relayerAddress });

        const ticket = await lotteryContract.methods.tickets(ticketId).call();
        console.log(`Debug: Ticket ${ticketId} after scratch:`, ticket); 

        const card = button.parentElement;

        card.innerHTML = `
            <div class="ticket-info">
                <h5>Ticket ID: ${ticketId}</h5>
                <p>Status: Scratched</p>
                <p>Prize: ${web3.utils.fromWei(ticket.prize, "ether")} ETH</p>
            </div>
        `;

        initScratchArea(ticketId, ticket.prize);

    } catch (error) {
        console.error("Error scratching ticket:", error); 
        button.disabled = false; 
    }
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

function displayPrize(prize, card) {
  const prizeMessage = card.querySelector(".prize-message");
  if (prizeMessage) {
      prizeMessage.textContent = prize > 0
          ? `Congratulations! You won ${web3.utils.fromWei(prize.toString(), "ether")} ETH!`
          : "Better luck next time!";
      prizeMessage.style.color = prize > 0 ? "green" : "red";
  } else {
      console.error("Prize message element not found.");
  }
}

window.addEventListener("load", initWeb3);
document.getElementById("login-btn").addEventListener("click", connectWallet);