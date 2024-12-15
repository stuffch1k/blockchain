//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract {
    address public immutable owner;
    constructor(address _owner){
        owner=_owner;
        
    }
    struct Transaction {
        uint id;
        address user;
        string category;
        string description;
        uint amount;
        uint timestamp;
        bool isIncome; // true for income, false for expense
    }

    mapping(address => Transaction[]) private transactions;
    uint private transactionCount;

    event TransactionAdded(uint id, address user, string category, string description, uint amount, bool isIncome);

    function addTransaction(string memory category, string memory description, uint amount, bool isIncome) public {
        transactionCount++;
        transactions[msg.sender].push(Transaction(transactionCount, msg.sender, category, description, amount, block.timestamp, isIncome));
        emit TransactionAdded(transactionCount, msg.sender, category, description, amount, isIncome);
    }

    function getTransactions() public view returns (Transaction[] memory) {
        return transactions[msg.sender];
    }
}