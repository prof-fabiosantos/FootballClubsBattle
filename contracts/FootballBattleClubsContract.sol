//Autor: Prof. Fabio Santos (fssilva@uea.edu.br)
// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";

contract FootballBattleClubsContract is ERC721  {

    struct FootballClub {
        uint id;
        string logoUri;
        string name;
        uint year;
        uint total_title;
        uint level;
        uint value;
        string status;
        address owner;        
    }

    FootballClub[] public footballClubs;
        

    address public gameOwner;
    address public contractAddress;
    

    constructor () ERC721("Football Token", "FTB") {
        gameOwner = msg.sender;
        contractAddress = address(this);
    }
      
    modifier onlyOwnerOf(uint _attackingClub) {
        require(ownerOf(_attackingClub) == msg.sender, "Deve ser o proprietario do footballClub para batalhar");
        _;
    }   

    function createNewFootballClub(string memory _logoUri, string memory _name, uint _year, uint _total_title, uint _value) public {
        require(msg.sender == gameOwner, "Somente o proprietatio do jogo pode criar um novo Football Clubd card");
        uint _id = footballClubs.length;
        string memory _status = "disponivel";
        uint _level = 1;
        
        footballClubs.push(FootballClub(_id, _logoUri, _name, _year, _total_title, _level, _value, _status, gameOwner));
        _safeMint(gameOwner, _id);        
    }

    function battle(uint _attackingFootballClub, uint _defendingFootballClub) public onlyOwnerOf(_attackingFootballClub) {
        FootballClub storage attacker = footballClubs[_attackingFootballClub];
        FootballClub storage defender = footballClubs[_defendingFootballClub];

        if (attacker.level >= defender.level) {
            attacker.level += 2;
            defender.level += 1;
        }
        else{
            attacker.level += 1;
            defender.level += 2;
        }
    }

    
    function get_FootballClub(uint _id) view public returns (FootballClub memory footballClub){
        for (uint index = 0; index < footballClubs.length; index++){
            if (footballClubs[index].id == _id){
                return footballClubs[index];                  
            }
        }        
    }

    function get_All_FootballClubs() view public returns (FootballClub[] memory){
        return footballClubs;
    }
   
    function sendEth(address _user, uint _FootballClub_id) public payable {
       require(msg.value == footballClubs[_FootballClub_id].value);
       
       (bool didSend, ) = gameOwner.call{value: msg.value}("");
       footballClubs[_FootballClub_id].status = "vendido";
       footballClubs[_FootballClub_id].owner = _user;
           
       require(didSend);
   }


}