// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract ScratchLottery {
    address public owner;
    uint256 public ticketPrice;
    uint256 public ticketCounter;
    uint256 public totalPrizePool;

    enum TicketStatus { Unscratched, Scratched }
    struct Ticket {
        address owner;
        uint8 status; // 0 = Unscratched, 1 = Scratched
        uint256 prize;
    }

    mapping(uint256 => Ticket) public tickets;

    event TicketPurchased(address indexed buyer, uint256 indexed ticketId);
    event TicketScratched(address indexed owner, uint256 indexed ticketId, uint256 prize);

    constructor() {
        owner = msg.sender;
        ticketPrice = 0.01 ether;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier validTicketOwner(uint256 ticketId) {
        require(tickets[ticketId].owner == msg.sender, "You do not own this ticket");
        _;
    }

    modifier validUnscratched(uint256 ticketId) {
        require(tickets[ticketId].status == 0, "Ticket already scratched");
        _;
    }

    function purchaseTicket() external payable {
        require(msg.value == ticketPrice, "Incorrect ticket price");
        _createTicket(msg.sender);
    }

    function purchaseMultipleTickets(uint256 numberOfTickets) external payable {
        require(numberOfTickets > 0, "Must purchase at least one ticket");
        uint256 totalCost = numberOfTickets * ticketPrice;
        require(msg.value == totalCost, "Incorrect ETH value sent");

        for (uint256 i = 0; i < numberOfTickets; i++) {
            _createTicket(msg.sender);
        }
    }

    function scratchTicket(uint256 ticketId, string calldata clientSeed) 
        external 
        validTicketOwner(ticketId) 
        validUnscratched(ticketId) 
    {
        uint256 randomness = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            blockhash(block.number - 1),
            ticketId,
            clientSeed
        )));

        uint256 prize = _calculatePrize(randomness);

        Ticket storage ticket = tickets[ticketId];
        ticket.status = 1; // Scratched
        ticket.prize = prize;

        if (prize > 0) {
            require(totalPrizePool >= prize, "Insufficient prize pool");
            totalPrizePool -= prize;
            payable(msg.sender).transfer(prize);
        }

        emit TicketScratched(msg.sender, ticketId, prize);
    }

    function withdrawEther() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No Ether to withdraw");
        payable(owner).transfer(balance);
    }

    function getTotalTickets() external view returns (uint256) {
        return ticketCounter;
    }

    function getTotalPrizePool() external view returns (uint256) {
        return totalPrizePool;
    }

    function _calculatePrize(uint256 randomness) internal pure returns (uint256) {
        uint256 outcome = randomness % 100000; // Generate outcome between 0-99,999
        if (outcome < 1) return 5 ether;         // 0.001% chance
        if (outcome < 11) return 0.5 ether;      // 0.01% chance
        if (outcome < 111) return 0.05 ether;    // 0.1% chance
        if (outcome < 2111) return 0.01 ether;   // 2% chance
        return 0;                                // 97.889% chance for no prize
    }

    function _createTicket(address buyer) internal {
        ticketCounter++;
        tickets[ticketCounter] = Ticket(buyer, 0, 0); // Default: Unscratched, Prize: 0
        totalPrizePool += ticketPrice;
        emit TicketPurchased(buyer, ticketCounter);
    }
}
