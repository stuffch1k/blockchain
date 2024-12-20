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
    mapping(address => Offer[]) public userOffers;
    mapping (address => string[]) public userSkills;
    uint256 public offerCount;

    event OfferCreated(uint256 id, address creator, string offeredSkill, string requestedSkill);
    event OfferUpdated(uint256 id, bool isActive);
    event OfferFulfilled(uint256 id, address executor);
    event SkillAdded(address user, string skill);
    event SkillsExchanged(address indexed user1, address indexed user2, string skillGiven, string skillReceived);

    function createOffer(string memory offeredSkill, string memory requestedSkill) public {
        require(!alreadyCreatedOffer(msg.sender, offeredSkill, requestedSkill), "You already create same offer");
        offerCount++;
        Offer memory new_offer = Offer(offerCount, msg.sender, offeredSkill, requestedSkill, true);
        offers[offerCount] = new_offer;
        userOffers[msg.sender].push(new_offer);

        emit OfferCreated(offerCount, msg.sender, offeredSkill, requestedSkill);
    }

    function alreadyCreatedOffer(address user, string memory offeredSkill, string memory requestedSkill) internal view returns (bool){
        Offer[] memory _userOffers = getUserOffers(user);
        for ( uint i = 0; i < _userOffers.length; i++) {
            if (keccak256(abi.encodePacked(_userOffers[i].offeredSkill)) == keccak256(abi.encodePacked(offeredSkill)) 
            && keccak256(abi.encodePacked(_userOffers[i].requestedSkill)) == keccak256(abi.encodePacked(requestedSkill))){
                return true;
            }
        }
        return false;
    }

    function addSkill(string memory skill) public {
        require(!hasSkill(skill, msg.sender), "You already have this skill");
        userSkills[msg.sender].push(skill);
        emit SkillAdded(msg.sender, skill);
    }

    function updateOffer(uint256 id, bool isActive) public {
        require(offers[id].creator == msg.sender, "Not the offer creator");
        offers[id].isActive = isActive;

        emit OfferUpdated(id, isActive);
    }

    function fulfillOffer(uint256 offerId) public {
        Offer storage offer = offers[offerId];
        require(offer.isActive, "Offer is inactive");
        // Проверяем, есть ли у исполнителя запрашиваемый навык
        require(hasSkill(offer.requestedSkill, msg.sender), "You don't have requiered skill");
        
        // Обмен навыками
        _exchangeSkills(offer.creator, msg.sender, offer.offeredSkill, offer.requestedSkill);

        // Отмечаем оффер как выполненный
        offer.isActive = false;
        emit OfferFulfilled(offerId, msg.sender);
    }

    function _exchangeSkills(address user1, address user2, string memory skillGiven, string memory skillReceived) internal {
        // Удаляем навык у первого пользователя
        _removeSkill(user1, skillGiven);
        // Добавляем навык первому пользователю
        userSkills[user1].push(skillReceived);
        // Удаляем навык у второго пользователя
        _removeSkill(user2, skillReceived);
        // Добавляем навык второму пользователю
        userSkills[user2].push(skillGiven);

        emit SkillsExchanged(user1, user2, skillGiven, skillReceived);
    }

    function hasSkill(string memory skillName, address user) internal view returns (bool) {
        string[] memory skills = getUserSkills(user);
        for ( uint i = 0; i < skills.length; i++) {
            ///Сравниваем две строки на равенство
            if (keccak256(abi.encodePacked(skills[i])) == keccak256(abi.encodePacked(skillName))){
                return true;
            }
        }
        return false;
    }

    function _removeSkill(address user, string memory skillName) internal {
        string[] storage skills = userSkills[user];
        for (uint i = 0; i < skills.length; i++) {
            if (keccak256(abi.encodePacked(skills[i])) == keccak256(abi.encodePacked(skillName))) {
                skills[i] = skills[skills.length - 1]; // Перемещаем последний элемент на место удаляемого
                skills.pop(); // Удаляем последний элемент
                break;
            }
        }
    }

    function getUserOffers(address user) public view returns (Offer[] memory) {
        return userOffers[user];
    }

    function getUserSkills(address user) public view returns (string[] memory){
        return userSkills[user];
    }

    function getAllOffers() public view returns (Offer[] memory){
        Offer[] memory offerList = new Offer[](offerCount);
        for (uint i = 1; i <= offerCount; i++) {
            offerList[i - 1] = offers[i];
        }
        return offerList;
    }

    function getOffer(uint256 id) public view returns (Offer memory) {
        return offers[id];
    }
}