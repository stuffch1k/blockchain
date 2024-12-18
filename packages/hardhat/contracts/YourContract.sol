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
    // State Variables

    address public immutable owner;
    constructor(address _owner){
        owner=_owner;  
    }
    struct Offer {
        uint256 id;
        address creator;
        string offeredSkill;
        string requestedSkill;
        bool isActive;
    }

    mapping(uint256 => Offer) public offers;
    mapping(address => uint256[]) public userOffers;
    uint256 public offerCount;

    event OfferCreated(uint256 id, address creator, string offeredSkill, string requestedSkill);
    event OfferUpdated(uint256 id, bool isActive);

    function createOffer(string memory offeredSkill, string memory requestedSkill) public {
        offerCount++;
        offers[offerCount] = Offer(offerCount, msg.sender, offeredSkill, requestedSkill, true);
        userOffers[msg.sender].push(offerCount);

        emit OfferCreated(offerCount, msg.sender, offeredSkill, requestedSkill);
    }

    function updateOffer(uint256 id, bool isActive) public {
        require(offers[id].creator == msg.sender, "Not the offer creator");
        offers[id].isActive = isActive;

        emit OfferUpdated(id, isActive);
    }

    function getUserOffers(address user) public view returns (uint256[] memory) {
    return userOffers[user];
}


    function getOffer(uint256 id) public view returns (Offer memory) {
        return offers[id];
    }
}
