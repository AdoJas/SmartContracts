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
        TicketStatus status;
        uint256 prize;
    }
    mapping(uint256 => Ticket) public tickets;
    mapping(address => bool) public authorizedRelayers;
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

    modifier onlyRelayer() {
        require(authorizedRelayers[msg.sender], "Not an authorized relayer");
        _;
    }

    modifier validTicketOwner(uint256 ticketId, address user) {
        require(tickets[ticketId].owner == user, "You do not own this ticket");
        _;
    }

    modifier validUnscratched(uint256 ticketId) {
        require(tickets[ticketId].status == TicketStatus.Unscratched, "Ticket already scratched");
        _;
    }
    function setRelayer(address relayer, bool status) external onlyOwner {
        authorizedRelayers[relayer] = status;
    }
    function setTicketPrice(uint256 newPrice) external onlyOwner {
        ticketPrice = newPrice;
    }
    function withdrawEther() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No Ether to withdraw");
        payable(owner).transfer(balance);
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
    function scratchTicketMeta(
        uint256 ticketId,
        address user,
        string calldata clientSeed,
        bytes calldata signature
    ) external onlyRelayer validTicketOwner(ticketId, user) validUnscratched(ticketId) {
        bytes32 messageHash = keccak256(abi.encodePacked(ticketId, user, clientSeed));
        require(recoverSigner(messageHash, signature) == user, "Invalid signature");
        uint256 randomness = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            blockhash(block.number - 1),
            ticketId,
            clientSeed
        )));
        uint256 prize = _calculatePrize(randomness);
        Ticket storage ticket = tickets[ticketId];
        ticket.status = TicketStatus.Scratched;
        ticket.prize = prize;
        if (prize > 0) {
            require(totalPrizePool >= prize, "Insufficient prize pool");
            totalPrizePool -= prize;
            payable(user).transfer(prize);
        }
        emit TicketScratched(user, ticketId, prize);
    }
    function _createTicket(address buyer) internal {
        ticketCounter++;
        tickets[ticketCounter] = Ticket(buyer, TicketStatus.Unscratched, 0); // Default: Unscratched, Prize: 0
        totalPrizePool += ticketPrice;
        emit TicketPurchased(buyer, ticketCounter);
    }
    function _calculatePrize(uint256 randomness) internal pure returns (uint256) {
    uint256 outcome = randomness % 100; // Generate outcome between 0-99
    if (outcome < 20) return 1 ether;          // 20% chance for 1 ETH
    if (outcome < 50) return 0.1 ether;        // 30% chance for 0.1 ETH
    if (outcome < 80) return 0.01 ether;       // 30% chance for 0.01 ETH
    return 0;                                  // 20% chance for no prize
    }
    function recoverSigner(bytes32 messageHash, bytes calldata signature) public pure returns (address) {
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        return ecrecover(ethSignedMessageHash, v, r, s);
    }
    function splitSignature(bytes memory sig) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
    function getTotalTickets() external view returns (uint256) {
        return ticketCounter;
    }
    function getTotalPrizePool() external view returns (uint256) {
        return totalPrizePool;
    }
}
