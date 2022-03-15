import logo from './logo.png';
import animacao from './assets/Animacao.gif'
import './App.css';
import web3 from './web3';
import myContract from './myContract';
import React from "react";
import { Link } from 'react-router-dom';
import $ from 'jquery';

class Home extends React.Component {
    
	constructor(props){
        super(props);
        this.state = {
            error : null,
            isLoaded : false,
			owner: '',
			contractAddress: '',
			numberFootballClubs: '',
			footballClub: '',
			playerFootballClubsList: [],
			footballClubsList :  []       
        };
    }
    
	async componentDidMount() {
		$("#loader").hide();
		const accounts = await web3.eth.getAccounts();
		const owner = accounts[0];
		const contractAddress = await myContract.methods.contractAddress().call();
		const footballClubsList = await myContract.methods.get_All_FootballClubs().call();
		
		var playerFootballClubsList = [];

		var count = 0;
		
		for(var index = 0; index < footballClubsList.length; index++){
			if (footballClubsList[index].status === "disponivel"){
				playerFootballClubsList[index] = footballClubsList[index];	
				count++;
			}
		}
		console.log(playerFootballClubsList);
		console.log(playerFootballClubsList.length);
		const numberFootballClubs = count;	
		
		this.setState({owner, contractAddress, footballClubsList, numberFootballClubs, playerFootballClubsList}); 
		
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
	  const footballClub = await myContract.methods.get_FootballClub(this.state.value).call();
	  var amountToSendWei = footballClub.value;
	  $("#loader").show();
	  await myContract.methods.sendEth(accounts[0], this.state.value).send({from: accounts[0], value: amountToSendWei});
	  this.setState({footballClub});
	  $("#loader").hide();  
	  
	  this.setState({ message: 'Você comprou seu clube!'});
	}

	render()
	{
	  return (
		<div className="App">
		  <header className="App-header">
			<br/>
			<img src={logo} alt="logo" /> 
			<br/>		
			<span>Endereço do contrato do jogo:  {this.state.contractAddress}</span>
			<span>Endereço do jogador:  {this.state.owner}</span>
			<br/>
			<span><h4>Marketplace</h4></span>
			<div id="loader" class="animacao">
				<img src={animacao} width="60" height="60" alt="logo" />
				<h6>Aguarde finalizar a compra!</h6>
			</div>	
				
			<div>
				<span>O número de clubes disponíveis para compra é:  {this.state.numberFootballClubs}</span>
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
			<label> Digite o código do clube que deseja comprar: </label> 
			<input value = {this.state.value} onChange = {event => this.setState({value: event.target.value})} /> 
			&nbsp;
			<button> Confirmar </button> 
			</div> 		
			</form>
			<div>
			<Link  className="App-link" to="/usuario">[Veja sua coleção de times de futebol]</Link> 
			&nbsp;&nbsp;&nbsp;
			<Link  className="App-link" to="/">[Sair do Jogo]</Link>
			</div>
		  </header>
		</div>
	  );
	}
}

export default Home;
