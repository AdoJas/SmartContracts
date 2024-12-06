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

    modifier ticketOwner(uint256 ticketId) {
        require(tickets[ticketId].owner == msg.sender, "You do not own this ticket");
        _;
    }

    modifier unscratched(uint256 ticketId) {
        require(tickets[ticketId].status == TicketStatus.Unscratched, "Ticket already scratched");
        _;
    }

    function purchaseTicket() public payable {
        require(msg.value == ticketPrice, "Incorrect ticket price");
        ticketCounter++;
        tickets[ticketCounter] = Ticket({
            owner: msg.sender,
            status: TicketStatus.Unscratched,
            prize: 0
        });

        totalPrizePool += msg.value;

        emit TicketPurchased(msg.sender, ticketCounter);
    }

    function scratchTicket(uint256 ticketId) public ticketOwner(ticketId) unscratched(ticketId) {
        uint256 randomness = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            msg.sender,
            ticketId
        )));

        uint256 prize = calculatePrize(randomness);

        tickets[ticketId].status = TicketStatus.Scratched;
        tickets[ticketId].prize = prize;

        if (prize > 0) {
            totalPrizePool -= prize;
            payable(tickets[ticketId].owner).transfer(prize);
        }

        emit TicketScratched(msg.sender, ticketId, prize);
    }

    function calculatePrize(uint256 randomness) internal pure returns (uint256) {
        uint256 outcome = randomness % 100;
        if (outcome < 5) {
            return 1 ether; // 5% chance for a jackpot
        } else if (outcome < 20) {
            return 0.1 ether; // 15% chance for a medium prize
        } else if (outcome < 50) {
            return 0.01 ether; // 30% chance for a small prize
        }
        return 0; // 50% chance for no prize
    }

    function withdrawEther() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No Ether to withdraw");
        payable(owner).transfer(balance);
    }
}
