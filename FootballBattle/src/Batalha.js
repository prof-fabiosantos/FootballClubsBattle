import logo from './logo.png';
import animacao from './assets/giphy.gif'
import './App.css';
import web3 from './web3';
import myContract from './myContract';
import React from "react";
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import $ from 'jquery';
 
class Batalha extends React.Component {
    
	constructor(props){
        super(props);
	
        this.state = {
            error: null,
            isLoaded: false,
			owner: '',
			winner: '',
			contractAddress: '',
			numberFootballClubs: '',
			playerFootballClubsList: [],
			footballClubsList: [],
			adversarysList:  []       
        };
    }
	
    
	async componentDidMount() {
		$("#loader").hide();
		const accounts = await web3.eth.getAccounts();
		const owner = accounts[0];	
		const contractAddress = await myContract.methods.contractAddress().call();
		
		var playerFootballClubsList = [];

		const footballClubsList = await myContract.methods.get_All_FootballClubs().call(); 
		console.log(footballClubsList);
		console.log(footballClubsList.length);
		
		const adversarysList = await myContract.methods.get_All_Adversarys().call(); 
		console.log(adversarysList);
		console.log(adversarysList.length);
		
		var count = 0;
		
		for(var index = 0; index < footballClubsList.length; index++){
			for(var index2 = 0; index2 < adversarysList.length; index2++){		
				if(footballClubsList[index].owner !== owner){
					if (footballClubsList[index].id === adversarysList[index2].id){				
						playerFootballClubsList[index] = footballClubsList[index];	
						count++;								
					}
				}
			}
		}
		console.log(playerFootballClubsList);
		console.log(playerFootballClubsList.length);
		
		const numberFootballClubs = count;		
		
		this.setState({owner, contractAddress, playerFootballClubsList, numberFootballClubs, adversarysList, footballClubsList}); 	
		
		if (window.ethereum) {
		  window.ethereum.on("accountsChanged", (accounts) => {
			if (accounts.length > 0) {
			  window.location.reload();
			} 
		  });
		}		
	}

	
	onSubmit = async(event) => {
	  event.preventDefault();
	  this.setState({ message: 'Aguardando a execução da transação...'});
	  const accounts = await web3.eth.getAccounts();
	  var index;
	  for(index = 0; index < this.state.adversarysList.length; index++){		
				if(this.state.adversarysList[index].owner === this.state.owner){			   
				   break;					   			  				
				}
	  }   
	  
	  $("#loader").show();  
	  await myContract.methods.battle(this.state.adversarysList[index].id, this.state.value).send({from: accounts[0]});  
		
	  const winner = await await myContract.methods.winner().call();
	  this.setState({winner});
	  console.log("teste: "+winner);
	  $("#loader").hide();
	  swal({
			  title: "O time vencendor da batalha foi",
			  text: this.state.winner,
			  icon: "success",
			  timer: 5000,
			  button: true
			});
	 
	}




	render()
	{
	  return (
		<div  className="App">
		  <header className="App-header">		
			<br/>
			<img src={logo} alt="logo" /> 
			<br/>		
			<span>Endereço do contrato do jogo:  {this.state.contractAddress}</span>
			<span>Endereço do jogador:  {this.state.owner}</span>
			<span><h4>Batalha</h4></span>
			
			<div id="loader" class="animacao">
				<img src={animacao} width="140" height="140" alt="logo" />
				<h6>Aguarde o fim da partida!</h6>
			</div>
			
			<div>
				<span>Times Adversários para batalhar:  {this.state.numberFootballClubs}</span>
				<table border="1">
					<tbody>
					<tr>
								<th>&nbsp;</th>
								<th>Clube</th>
								<th>Código</th>
								<th>Ano</th>
								<th>Total de Títulos</th>
								<th>Energia</th>
													
					</tr>
						{this.state.playerFootballClubsList.map(FootballClub => (
						<tr key={FootballClub.id}>
								<td><img src={FootballClub.logoUri} alt="logo" /></td>
								<td>{FootballClub.name}</td>
								<td>{FootballClub.id}</td>
								<td>{FootballClub.year}</td>
								<td>{FootballClub.total_title}</td>
								<td>{FootballClub.level}</td>													
						</tr>
					))
				}
				</tbody>
				</table>
			</div>	
			<form onSubmit={this.onSubmit}> 
			<div> 
			<label> Digite o código do adversário que deseja batalhar: </label> 
			<input value = {this.state.value} onChange = {event => this.setState({value: event.target.value})} /> 
			&nbsp;
			<button> Confirmar </button> 
			</div> 		
			</form>
			<div>
			<Link  className="App-link" to="/home">[Marketplace]</Link> 
			&nbsp;&nbsp;
			<Link  className="App-link" to="/usuario">[Veja sua coleção de times de futebol]</Link> 
			</div>       		
		  </header>
		</div>
	  );
	}
}

export default Batalha;
