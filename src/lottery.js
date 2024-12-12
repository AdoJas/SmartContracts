let web3;
let lotteryContract;

let ticketsData = [];
const relayerAddress = "0x456F34EF88Df11A5FB3cAB282BAd8dbf1ff7E946";

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
    "name": "getPrizePoolBalance",
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

const contractAddress = "0xC0ff1D219A3116ef287c983514afEDD4E9aea5bC";

async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });

            lotteryContract = new web3.eth.Contract(lotteryABI, contractAddress);
            console.log("Contract initialized:", lotteryContract);
            window.ethereum.on("accountsChanged", async (accounts) => {
                try {
                    if (accounts.length > 0) {
                        console.log("MetaMask account changed:", accounts[0]);
                        localStorage.setItem("userAddress", accounts[0]);
                        await connectWallet();
                        await loadTickets();
                        await loadUnscratchedTickets();
                    } else {
                        console.log("No accounts connected.");
                        document.getElementById("user-profile").style.display = "none";
                        document.getElementById("main-menu").style.display = "none";
                        document.getElementById("profile").style.display = "none";
                        document.getElementById("scratch-tickets").style.display = "none";
                        document.getElementById("statistics").style.display = "none";
                    }
                } catch (error) {
                    console.error("Error handling account change:", error);
                }
            });
        } catch (error) {
            console.error("User denied account access", error);
            alert("Please allow access to MetaMask to use this DApp.");
        }
    } else {
        alert("Please install MetaMask!");
    }
}

async function connectWallet() {
  console.log("Connect Wallet button clicked");

  if (window.ethereum) {
      try {
          const accounts = await ethereum.request({ method: "eth_requestAccounts" });
          console.log("Accounts retrieved:", accounts);

          if (accounts.length === 0) {
              console.warn("No accounts found.");
              alert("No accounts found. Please check your MetaMask.");
              return;
          }

          const userAddress = accounts[0];
          console.log("User Address:", userAddress);
          localStorage.setItem("userAddress", userAddress);

          const balance = await web3.eth.getBalance(userAddress);
          const balanceInEth = web3.utils.fromWei(balance, "ether");
          console.log("User Balance:", balanceInEth, "ETH");

          document.getElementById("user-avatar").src = `https://avatars.dicebear.com/api/identicon/${userAddress}.svg`;
          document.getElementById("user-address").textContent = `Address: ${userAddress}`;
          document.getElementById("user-balance").textContent = `Balance: ${balanceInEth} ETH`;
          document.getElementById("user-profile").style.display = "block";

          console.log("Hiding login page and showing main menu");
          document.getElementById("login-page").style.display = "none"; 
          document.getElementById("main-menu").style.display = "block";
          console.log("Main menu should now be visible");
      } catch (error) {
          console.error("Error connecting MetaMask:", error);
          alert("Failed to connect MetaMask. Please try again.");
      }
  } else {
      console.error("MetaMask is not installed.");
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
            gas: 1000000,
        });
        alert("Ticket purchased successfully!");
        await loadTickets();
        await loadUnscratchedTickets();
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
        await loadTickets();
        await loadUnscratchedTickets();
    } catch (error) {
        console.error("Error purchasing tickets:", error);
        alert("Error purchasing tickets. Check console for details.");
    }
}

async function withdrawPrizes() {
  const withdrawBtn = document.getElementById('withdraw-btn');
  
  try {
      withdrawBtn.disabled = true;
      withdrawBtn.innerHTML = `
          <div class="spinner-border spinner-border-sm me-2" role="status">
              <span class="visually-hidden">Loading...</span>
          </div>
          Withdrawing...
      `;

      const userAddress = localStorage.getItem("userAddress");
      const prizeBalance = await lotteryContract.methods.prizeBalances(userAddress).call();

      if (prizeBalance === '0') {
          showNotification('No prizes available to withdraw', 'warning');
          return;
      }

      await lotteryContract.methods.withdrawPrizes().send({ 
          from: userAddress,
          gas: 300000
      });

      showNotification(`Successfully withdrawn ${web3.utils.fromWei(prizeBalance, 'ether')} ETH`, 'success');
      
      await updateBalance(userAddress);
      await updatePrizeBalance();
      
  } catch (error) {
      console.error('Withdrawal error:', error);
      showNotification('Failed to withdraw prizes. Please try again.', 'error');
  } finally {
      withdrawBtn.disabled = false;
      withdrawBtn.innerHTML = `
          <i class="fas fa-money-bill-wave me-2"></i>
          Withdraw Prizes
      `;
  }
}

function updateUserProfile() {
  const userAddress = localStorage.getItem("userAddress");
  
  document.getElementById("user-avatar").src = `https://avatars.dicebear.com/api/identicon/${userAddress}.svg`;
  document.getElementById("user-address").textContent = formatAddress(userAddress);
  
  updateBalance(userAddress);
}

async function updateBalance(address) {
  try {
      const balance = await web3.eth.getBalance(address);
      const balanceInEth = web3.utils.fromWei(balance, "ether");
      document.getElementById("user-balance").textContent = `${parseFloat(balanceInEth).toFixed(4)} ETH`;
  } catch (error) {
      console.error("Error fetching balance:", error);
      document.getElementById("user-balance").textContent = "Error loading balance";
  }
}

function formatAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function addWithdrawButton() {
  const profileSection = document.getElementById('profile');
  
  const existingWithdraw = document.querySelector('.withdraw-section');
  if (existingWithdraw) {
      existingWithdraw.remove();
  }
  
  const withdrawSection = document.createElement('div');
  withdrawSection.className = 'withdraw-section';
  withdrawSection.innerHTML = `
      <div class="card mb-4">
          <div class="card-body">
              <h5 class="card-title">Available Prizes</h5>
              <p class="prize-balance mb-3">Loading...</p>
              <button id="withdraw-btn" class="btn btn-success" onclick="withdrawPrizes()">
                  <i class="fas fa-money-bill-wave me-2"></i>
                  Withdraw Prizes
              </button>
          </div>
      </div>
  `;
  
  profileSection.insertBefore(withdrawSection, profileSection.firstChild);
  updatePrizeBalance();
}

async function updatePrizeBalance() {
  const prizeBalanceElement = document.querySelector('.prize-balance');
  const userAddress = localStorage.getItem("userAddress");
  
  try {
      const balance = await lotteryContract.methods.prizeBalances(userAddress).call();
      const balanceInEth = web3.utils.fromWei(balance, 'ether');
      prizeBalanceElement.textContent = `${balanceInEth} ETH available to withdraw`;
  } catch (error) {
      console.error('Error fetching prize balance:', error);
      prizeBalanceElement.textContent = 'Error loading balance';
  }
}

async function loadTickets() {
  const userAddress = localStorage.getItem("userAddress");
  const profileTickets = document.getElementById("profile-tickets");
  
  profileTickets.innerHTML = `
      <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading your tickets...</p>
      </div>
  `;

  try {
      const ticketIds = await lotteryContract.methods.getUserTickets(userAddress).call();
      ticketsData = []; 

      if (ticketIds.length === 0) {
          profileTickets.innerHTML = `
              <div class="empty-state">
                  <i class="fas fa-ticket-alt fa-3x mb-3"></i>
                  <h3>No Tickets Found</h3>
                  <p>Start your journey by purchasing tickets!</p>
                  <button onclick="navigateTo('buy-tickets')" class="btn btn-primary mt-3">
                      Buy Tickets
                  </button>
              </div>
          `;
          return;
      }

      for (const ticketId of ticketIds) {
          const ticket = await lotteryContract.methods.tickets(ticketId).call();
          const prizeInEth = web3.utils.fromWei(ticket.prize, "ether");
          
          ticketsData.push({
              id: ticketId,
              status: parseInt(ticket.status),
              prize: parseFloat(prizeInEth),
              purchaseDate: Date.now() 
          });
      }

      if (!document.querySelector('.filter-controls')) {
          const filterControls = document.createElement('div');
          filterControls.className = 'filter-controls';
          filterControls.innerHTML = `
              <div class="filter-group">
                  <select id="status-filter" class="form-select">
                      <option value="all">All Tickets</option>
                      <option value="unscratched">Unscratched</option>
                      <option value="scratched">Scratched</option>
                      <option value="won">Won Prize</option>
                      <option value="no-prize">No Prize</option>
                  </select>
              </div>
              <div class="filter-group">
                  <select id="sort-filter" class="form-select">
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Prize</option>
                      <option value="lowest">Lowest Prize</option>
                  </select>
              </div>
          `;
          profileTickets.insertBefore(filterControls, profileTickets.firstChild);
      }

      profileTickets.innerHTML += '<div class="profile-tickets"></div>';
      
      renderTickets(ticketsData);
      setupFilters();

  } catch (error) {
      console.error("Error loading tickets:", error);
      profileTickets.innerHTML = `
          <div class="error-state">
              <i class="fas fa-exclamation-circle fa-3x mb-3"></i>
              <h3>Failed to Load Tickets</h3>
              <p>Please try again later</p>
          </div>
      `;
  }
}
function setupFilters() {
  const statusFilter = document.getElementById('status-filter');
  const sortFilter = document.getElementById('sort-filter');

  statusFilter.addEventListener('change', () => applyFilters());
  sortFilter.addEventListener('change', () => applyFilters());
}

function applyFilters() {
  const statusFilter = document.getElementById('status-filter').value;
  const sortFilter = document.getElementById('sort-filter').value;

  let filteredTickets = [...ticketsData];

  switch(statusFilter) {
      case 'unscratched':
          filteredTickets = filteredTickets.filter(t => t.status === 0);
          break;
      case 'scratched':
          filteredTickets = filteredTickets.filter(t => t.status === 1);
          break;
      case 'won':
          filteredTickets = filteredTickets.filter(t => t.status === 1 && t.prize > 0);
          break;
      case 'no-prize':
          filteredTickets = filteredTickets.filter(t => t.status === 1 && t.prize === 0);
          break;
  }

  switch(sortFilter) {
      case 'newest':
          filteredTickets.sort((a, b) => b.purchaseDate - a.purchaseDate);
          break;
      case 'oldest':
          filteredTickets.sort((a, b) => a.purchaseDate - b.purchaseDate);
          break;
      case 'highest':
          filteredTickets.sort((a, b) => b.prize - a.prize);
          break;
      case 'lowest':
          filteredTickets.sort((a, b) => a.prize - b.prize);
          break;
  }

  renderTickets(filteredTickets);
}

function renderTickets(tickets) {
  const ticketsContainer = document.querySelector('.profile-tickets');
  ticketsContainer.innerHTML = '';

  if (tickets.length === 0) {
      ticketsContainer.innerHTML = `
          <div class="empty-state">
              <i class="fas fa-ticket-alt fa-3x mb-3"></i>
              <h3>No Matching Tickets</h3>
              <p>Try adjusting your filters</p>
          </div>
      `;
      return;
  }

  tickets.forEach(ticket => {
      const ticketElement = document.createElement('div');
      ticketElement.className = 'profile-ticket-card';
      
      let statusBadge;
      if (ticket.status === 0) {
          statusBadge = '<span class="ticket-badge badge-unscratched">Unscratched</span>';
      } else if (ticket.prize > 0) {
          statusBadge = '<span class="ticket-badge badge-scratched">Won Prize</span>';
      } else {
          statusBadge = '<span class="ticket-badge badge-no-prize">No Prize</span>';
      }

      ticketElement.innerHTML = `
          <div class="ticket-header">
              <span class="ticket-id">#${ticket.id}</span>
              ${statusBadge}
          </div>
          <div class="ticket-prize">
              <div class="prize-amount">${ticket.status === 0 ? '?' : ticket.prize}</div>
              <div class="prize-label">ETH</div>
          </div>
          <div class="ticket-footer">
              <div class="ticket-date">
                  <i class="far fa-clock"></i>
                  <span>Purchased on ${new Date(ticket.purchaseDate).toLocaleDateString()}</span>
              </div>
          </div>
      `;

      ticketsContainer.appendChild(ticketElement);
  });
}

async function loadUnscratchedTickets() {
  const userAddress = localStorage.getItem("userAddress");
  const ticketCards = document.getElementById("ticket-cards");
  
  ticketCards.innerHTML = `
      <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading your tickets...</p>
      </div>
  `;

  try {
      const ticketCount = await lotteryContract.methods.ticketCounter().call();
      ticketCards.innerHTML = '';
      let hasUnscratched = false;

      for (let i = 1; i <= ticketCount; i++) {
          const ticket = await lotteryContract.methods.tickets(i).call();

          if (ticket.owner.toLowerCase() === userAddress.toLowerCase() && ticket.status == 0) {
              hasUnscratched = true;
              const card = document.createElement("div");
              card.className = "ticket-card";
              card.innerHTML = `
                  <div class="ticket-info">
                      <h5>Ticket #${i}</h5>
                      <p class="status">Status: Unscratched</p>
                  </div>
                  <div class="scratch-container">
                      <div class="prize-div">
                          <span class="prize-amount">???</span>
                          <span class="eth-label">ETH</span>
                      </div>
                      <canvas class="scratch-area"></canvas>
                  </div>
                  <button class="scratch-button">
                      <span class="default-text">
                          <i class="fas fa-hand-pointer"></i> SCRATCH
                      </span>
                      <span class="loading-text">
                          <div class="spinner-small"></div> Processing...
                      </span>
                  </button>
              `;

              const scratchButton = card.querySelector(".scratch-button");
              scratchButton.addEventListener("click", () => handleScratch(i, card));

              ticketCards.appendChild(card);
          }
      }

      if (!hasUnscratched) {
          ticketCards.innerHTML = `
              <div class="empty-state">
                  <i class="fas fa-ticket-alt"></i>
                  <h3>No Unscratched Tickets</h3>
                  <p>Purchase tickets to start playing!</p>
                  <button onclick="navigateTo('buy-tickets')" class="btn-primary">
                      Buy Tickets
                  </button>
              </div>
          `;
      }
  } catch (error) {
      console.error("Error loading tickets:", error);
      ticketCards.innerHTML = `
          <div class="error-state">
              <i class="fas fa-exclamation-circle"></i>
              <h3>Failed to Load Tickets</h3>
              <p>Please try again later</p>
          </div>
      `;
  }
}
function initializeScratchArea(cardElement, prizeInEth) {
  const canvas = cardElement.querySelector(".scratch-area");
  const ctx = canvas.getContext("2d");
  const container = cardElement.querySelector(".scratch-container");

  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  canvas.style.display = "block";

  ctx.fillStyle = "#C0C0C0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  function draw(e) {
      if (!isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 40;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      [lastX, lastY] = [x, y];

      checkScratchCompletion(ctx, canvas, cardElement);
  }

  canvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", () => isDrawing = false);
  canvas.addEventListener("mouseout", () => isDrawing = false);

  canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      isDrawing = true;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
  });

  canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      draw(touch);
  });

  canvas.addEventListener("touchend", () => isDrawing = false);
}

function checkScratchCompletion(ctx, canvas, cardElement) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let scratched = 0;

  for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) scratched++;
  }

  const scratchedPercentage = (scratched / (pixels.length / 4)) * 100;

  if (scratchedPercentage > 50) {
      canvas.style.display = "none";
      cardElement.classList.add("revealed");
  }
}

function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}
async function handleScratch(ticketId, cardElement) {
  const scratchButton = cardElement.querySelector(".scratch-button");
  scratchButton.classList.add("loading");
  
  try {
      const clientSeed = generateSecureClientSeed();
      const userAddress = localStorage.getItem("userAddress");

      await lotteryContract.methods
          .scratchTicketMeta(ticketId, userAddress, clientSeed)
          .send({ from: relayerAddress, gas: 500000 });

      const updatedTicket = await lotteryContract.methods.tickets(ticketId).call();
      const prizeInEth = web3.utils.fromWei(updatedTicket.prize, "ether");

      cardElement.querySelector(".status").textContent = "Status: Scratched";
      cardElement.querySelector(".prize-amount").textContent = prizeInEth;
      
      scratchButton.style.display = "none";
      initializeScratchArea(cardElement, prizeInEth);
      
  } catch (error) {
      console.error("Error scratching ticket:", error);
      scratchButton.classList.remove("loading");
      showNotification("Failed to scratch ticket. Please try again.", "error");
  }
}

function generateSecureClientSeed() {
    const array = new Uint32Array(4);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => dec.toString(36)).join('');
}

function navigateTo(page) {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("buy-tickets").style.display = "none";
    document.getElementById("profile").style.display = "none";
    document.getElementById("scratch-tickets").style.display = "none";
    document.getElementById("statistics").style.display = "none";

    const selectedPage = document.getElementById(page);
    selectedPage.style.display = "block";

    if (page === "profile") {
        setTimeout(loadTickets, 0); 
        addWithdrawButton();
    } else if (page === "scratch-tickets") {
        loadUnscratchedTickets();
    } else if (page === "statistics") {
        loadStatistics();
    }
}

function loadMainMenu() {
  console.log("Entering loadMainMenu...");
  document.getElementById("login-page").style.display = "none";
  document.getElementById("main-menu").style.display = "block";
  console.log("Login page hidden, main menu displayed.");
}

async function loadStatistics() {
  const statsContainer = document.getElementById("statistics");
  
  statsContainer.innerHTML = `
      <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading statistics...</p>
      </div>
  `;

  try {
      const [totalTickets, prizePoolWei, scratchedCount] = await Promise.all([
          lotteryContract.methods.getTotalTickets().call(),
          lotteryContract.methods.getPrizePoolBalance().call(),
          countScratchedTickets()
      ]);

      const prizePoolEth = web3.utils.fromWei(prizePoolWei, "ether");
      
      statsContainer.innerHTML = `
          <div class="stats-grid">
              <div class="stat-card">
                  <i class="fas fa-ticket-alt fa-2x"></i>
                  <h3>Total Tickets</h3>
                  <div class="stat-value">${totalTickets}</div>
              </div>
              <div class="stat-card">
                  <i class="fas fa-coins fa-2x"></i>
                  <h3>Prize Pool</h3>
                  <div class="stat-value">${parseFloat(prizePoolEth).toFixed(4)} ETH</div>
              </div>
              <div class="stat-card">
                  <i class="fas fa-check-circle fa-2x"></i>
                  <h3>Scratched Tickets</h3>
                  <div class="stat-value">${scratchedCount}</div>
              </div>
              <div class="stat-card">
                  <i class="fas fa-percentage fa-2x"></i>
                  <h3>Scratch Rate</h3>
                  <div class="stat-value">${totalTickets > 0 ? ((scratchedCount / totalTickets) * 100).toFixed(1) : 0}%</div>
              </div>
          </div>
      `;

  } catch (error) {
      console.error("Error loading statistics:", error);
      statsContainer.innerHTML = `
          <div class="error-state">
              <i class="fas fa-exclamation-circle fa-3x"></i>
              <h3>Failed to Load Statistics</h3>
              <p>Please try again later</p>
          </div>
      `;
  }
}

async function loadPrizePoolBalance() {
  try {
      const balanceWei = await lotteryContract.methods.getPrizePoolBalance().call();
      
      const balanceEth = web3.utils.fromWei(balanceWei, "ether");
      
      const formattedBalance = parseFloat(balanceEth).toFixed(4);
      
      return formattedBalance;
  } catch (error) {
      console.error("Error fetching prize pool balance:", error);
      return "0.0000";
  }
}

async function countScratchedTickets() {
  const totalTickets = await lotteryContract.methods.ticketCounter().call();
  let scratched = 0;
  
  for (let i = 1; i <= totalTickets; i++) {
      const ticket = await lotteryContract.methods.tickets(i).call();
      if (ticket.status === "1") scratched++;
  }
  
  return scratched;
}

function renderWinningsChart(userWinnings) {
    const ctx = document.getElementById("winningsChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Total Winnings"],
            datasets: [{
                label: "Winnings (ETH)",
                data: [userWinnings],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

function renderTicketBreakdownChart(scratched, unscratched, won) {
    const ctx = document.getElementById("ticketBreakdownChart").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Scratched", "Unscratched", "Won"],
            datasets: [{
                data: [scratched, unscratched, won],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            }],
        },
        options: {
            responsive: true,
        },
    });
}

async function updateWinningsCounter() {
    const winningsCounter = document.getElementById('winningsCounter');
    try {
        const totalPrizePool = await lotteryContract.methods.getTotalPrizePool().call();
        const totalPrizePoolEth = web3.utils.fromWei(totalPrizePool, 'ether');
        winningsCounter.textContent = `${totalPrizePoolEth} ETH`;
    } catch (error) {
        console.error("Error fetching total prize pool:", error);
        winningsCounter.textContent = "Error fetching data";
    }
}

window.addEventListener("load", initWeb3);
document.getElementById("login-btn").addEventListener("click", connectWallet);
