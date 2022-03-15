import logo from './logo.png';
import animacao from './assets/Animacao.gif'
import './App.css';
import web3 from './web3';
import myContract from './myContract';
import React from "react";
import { Link } from 'react-router-dom';
import $ from 'jquery';

class Usuario extends React.Component {
    
	constructor(props){
        super(props);
        this.state = {
            error : null,
            isLoaded : false,
			owner: '',
			contractAddress: '',
			numberFootballClubs: '',
			playerFootballClubsList: [],
			footballClubsList :  []       
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
		
		var count = 0;
		
		for(var index = 0; index < footballClubsList.length; index++){
			if (footballClubsList[index].owner === owner){
				playerFootballClubsList[index] = footballClubsList[index];	
				count++;
			}
		}
		console.log(playerFootballClubsList);
		console.log(playerFootballClubsList.length);
		
		const numberFootballClubs = count;		
		
		this.setState({owner, contractAddress,playerFootballClubsList, numberFootballClubs}); 	
		
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
	  console.log(accounts[0]);
	  $("#loader").show();
	  await myContract.methods.updateAdversarys(this.state.value, accounts[0]).send({from: accounts[0]}); 
	  $("#loader").hide(); 
	  this.setState({ message: 'Você selecionou seu clube!'});  
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
			<br/>
			<div id="loader" class="animacao">
				<img src={animacao} width="60" height="60" alt="logo" />
				<h6>Aguarde finalizar a seleção!</h6>
			</div>
			<div>
				<span>Você possui {this.state.numberFootballClubs} time(s), selecione um time para batalha</span>
				<table border="1">
					<tbody>
					<tr>
								<th>&nbsp;</th>
								<th>Clube</th>
								<th>Código</th>
								<th>Ano</th>
								<th>Total de Títulos</th>
								<th>Energia</th>
								<th>Valor em Ether</th>						
					</tr>
						{this.state.playerFootballClubsList.map(FootballClub => (
						<tr key={FootballClub.id}>
								<td><img src={FootballClub.logoUri} alt="logo" /></td>
								<td>{FootballClub.name}</td>
								<td>{FootballClub.id}</td>
								<td>{FootballClub.year}</td>
								<td>{FootballClub.total_title}</td>
								<td>{FootballClub.level}</td>
								<td>{web3.utils.fromWei(FootballClub.value, 'ether')}</td>						
						</tr>
					))
				}
				</tbody>
				</table>
			</div>
			<form onSubmit={this.onSubmit}> 
			<div> 
			<label> Digite o código do time do clube que deseja para batalhar: </label> 
			<input value = {this.state.value} onChange = {event => this.setState({value: event.target.value})} /> 
			&nbsp;
			<button> Confirmar </button> 
			</div> 		
			</form>
			<div>
			<Link  className="App-link" to="/home">[Marketplace]</Link> 
			&nbsp;&nbsp;
			<Link  className="App-link" to="/batalha">[Times Adversários]</Link>
			</div>       		
		  </header>
		</div>
	  );
	}
}

export default Usuario;
