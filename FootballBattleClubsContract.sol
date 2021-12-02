/Autor: Prof. Fabio Santos (fssilva@uea.edu.br)
// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";

contract FootballBattleClubsContract is ERC721  {

    struct FootballClub {
        string name;
        uint ano;
        uint qt_titulos;
        uint level;        
    }

    FootballClub[] public footballClubs;
    address public gameOwner;

    constructor () ERC721("Football Token", "FTB") {
        gameOwner = msg.sender;
    }

    modifier onlyOwnerOf(uint _attackingClub) {
        require(ownerOf(_attackingClub) == msg.sender, "Must be owner of footballClub to battle");
        _;
    }   

    function createNewFootballClub(string memory _name, uint _ano, uint _qt_titulos, address _to) public {
        require(msg.sender == gameOwner, "Only game owner can create new Football Clubd card");
        uint id = footballClubs.length;
        footballClubs.push(FootballClub(_name, _ano, _qt_titulos, 1));
        _safeMint(_to, id);        
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
}



