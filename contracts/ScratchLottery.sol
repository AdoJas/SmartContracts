// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract ScratchLottery {
    uint256 public ticketPrice = 0.01 ether;
    uint256 public ticketCounter;
    uint256 public totalPrizePool;
    uint256 public totalPrizeBalances; // Tracks total user prize balances

    address public relayer; // Designated account to pay gas fees

    enum TicketStatus { Unscratched, Scratched }

    struct Ticket {
        address owner;
        TicketStatus status;
        uint256 prize;
    }

    mapping(uint256 => Ticket) public tickets;
    mapping(address => uint256[]) public userTickets;
    mapping(address => uint256) public prizeBalances;

    event TicketPurchased(address indexed buyer, uint256 ticketId);
    event TicketScratched(address indexed owner, uint256 indexed ticketId, uint256 prize);
    event PrizeWithdrawn(address indexed user, uint256 amount);

    // Constructor to set the relayer address during deployment
    constructor(address _relayer) {
        relayer = _relayer; // Set the relayer address
    }

    modifier onlyRelayer() {
        require(msg.sender == relayer, "Caller is not the designated relayer");
        _;
    }

    // Function to purchase a single ticket
    function purchaseTicket() external payable {
        require(msg.value == ticketPrice, "Incorrect ticket price");
        uint256 ticketId = _createTicket(msg.sender);
        emit TicketPurchased(msg.sender, ticketId);
    }

    // Function to purchase multiple tickets
    function purchaseMultipleTickets(uint256 numberOfTickets) external payable {
        require(numberOfTickets > 0, "Must purchase at least one ticket");
        uint256 totalCost = numberOfTickets * ticketPrice;
        require(msg.value == totalCost, "Incorrect ETH value sent");

        for (uint256 i = 0; i < numberOfTickets; i++) {
            uint256 ticketId = _createTicket(msg.sender);
            emit TicketPurchased(msg.sender, ticketId);
        }
    }

    // Function to scratch a ticket (relayer pays gas)
    function scratchTicketMeta(
        uint256 ticketId,
        address user,
        string calldata clientSeed
    ) external onlyRelayer {
        Ticket storage ticket = tickets[ticketId];
        require(ticket.owner == user, "Not the ticket owner");
        require(ticket.status == TicketStatus.Unscratched, "Ticket already scratched");

        uint256 randomness = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            blockhash(block.number - 1),
            ticketId,
            clientSeed
        )));
        uint256 prize = _calculatePrize(randomness);

        // Update logical balance without checking prize pool
        ticket.status = TicketStatus.Scratched;
        ticket.prize = prize;

        prizeBalances[user] += prize;

        emit TicketScratched(user, ticketId, prize);
    }

    // Function to withdraw prizes
    function withdrawPrizes() external {
        uint256 balance = prizeBalances[msg.sender];
        require(balance > 0, "No prizes to withdraw");
        require(address(this).balance >= balance, "Insufficient funds in the DApp");

        prizeBalances[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");

        emit PrizeWithdrawn(msg.sender, balance);
    }

    // Function to get total number of tickets
    function getTotalTickets() external view returns (uint256) {
        return ticketCounter;
    }

    // Function to get total prize pool
    function getPrizePoolBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Function to get user tickets
    function getUserTickets(address user) external view returns (uint256[] memory) {
        return userTickets[user];
    }

    // Internal function to create a new ticket
    function _createTicket(address buyer) internal returns (uint256) {
        ticketCounter++;
        tickets[ticketCounter] = Ticket(buyer, TicketStatus.Unscratched, 0);
        userTickets[buyer].push(ticketCounter);
        totalPrizePool += ticketPrice;
        return ticketCounter;
    }

    // Internal function to calculate prize based on randomness
    function _calculatePrize(uint256 randomness) internal pure returns (uint256) {
        uint256 outcome = randomness % 100;
        if (outcome < 10) return 1 ether;
        if (outcome < 30) return 0.1 ether;
        if (outcome < 60) return 0.01 ether;
        return 0;
    }
}
