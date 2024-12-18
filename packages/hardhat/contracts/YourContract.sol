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
        address creator;
        string offeredSkill;
        string requestedSkill;
        bool isActive;
        uint256 createdAt;
    }

    mapping(uint256 => Offer) public offers;
    uint256 public offerCount;

    event OfferCreated(uint256 id, address creator, string offeredSkill, string requestedSkill);
    event OfferAccepted(uint256 id, address acceptor);
    event OfferCanceled(uint256 id);

    function createOffer(string memory offeredSkill, string memory requestedSkill) public {
        offerCount++;
        offers[offerCount] = Offer(msg.sender, offeredSkill, requestedSkill, true, block.timestamp);
        emit OfferCreated(offerCount, msg.sender, offeredSkill, requestedSkill);
    }

    function acceptOffer(uint256 id) public {
        Offer storage offer = offers[id];
        require(offer.isActive, "Offer is not active");
        // Logic for skill exchange can be implemented here
        offer.isActive = false;
        emit OfferAccepted(id, msg.sender);
    }

    function cancelOffer(uint256 id) public {
        Offer storage offer = offers[id];
        require(msg.sender == offer.creator, "Only creator can cancel the offer");
        offer.isActive = false;
        emit OfferCanceled(id);
    }
}
