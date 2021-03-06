import logo from './logo.png';
import animacao from './assets/Animacao.gif'
import './App.css';
import web3 from './web3';
import myContract from './myContract';
import React from "react";
import { Link } from 'react-router-dom';
import $ from 'jquery';
import {
  Grommet,
  Grid,
  Card,
  CardBody,
  CardHeader,
  Text 
} from 'grommet'


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
			footballClubsList :  [],
			numberOfWinners: '',			
        };
    }
    
	async componentDidMount() {
		$("#loader").hide();
		const accounts = await web3.eth.getAccounts();
		const owner = accounts[0];
		const contractAddress = await myContract.methods.contractAddress().call();
		var playerFootballClubsList = [];

		const footballClubsList = await myContract.methods.get_All_FootballClubs().call(); 
		const numberOfWinners = await myContract.methods.getNumberBattleWinner(owner).call();
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
		
		this.setState({owner, contractAddress,playerFootballClubsList, numberFootballClubs, numberOfWinners}); 	
		
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
	  <Grommet full>
	  
		<div  className="App">
		  <header className="App-header">
			<br/>
			<img src={logo} alt="logo" /> 
			<br/>		
			<span>Endereço do contrato do jogo:  {this.state.contractAddress}</span>
			 <span>Endereço do jogador:  {this.state.owner}</span>
			 <span>Número de vitórias do jogador:  {this.state.numberOfWinners}</span>
			<br/>
			<div id="loader" class="animacao">
				<img src={animacao} width="60" height="60" alt="logo" />
				<h6>Aguarde finalizar a seleção!</h6>
			</div>
			
			<div>
				<p>O número de clubs cards disponíveis para batalha é:  {this.state.numberFootballClubs}</p>
				
				 <Grid
				  fill
				  columns="xsmall"
				  gap="medium"
				>					
								{this.state.playerFootballClubsList.map(FootballClub => (
						 
						  <Card 
							  key={FootballClub.id}
							  background="light-1"
							  width="larger"
							>
							<CardHeader pad={{"horizontal": "small", "top": "small"}}>
							<Text weight="bold">
							  Código {FootballClub.id}
							</Text>
						  </CardHeader>
						  
						  <CardBody justifyContent="center" pad="small">
								<img src={FootballClub.logoUri} alt="logo" />
								<Text size="xsmall">{FootballClub.name}</Text>
								<Text size="xsmall">Ano: {FootballClub.year}</Text>
								<Text size="xsmall">Títulos: {FootballClub.total_title}</Text>
								<Text size="xsmall">Energia: {FootballClub.level}</Text>
								<Text size="xsmall">Ether: {web3.utils.fromWei(FootballClub.value, 'ether')}</Text>
								
						  </CardBody>
						
						</Card>
					
					))
				}
				</Grid> 
			</div>	
			
			<form onSubmit={this.onSubmit}> 
			<div> 
			<br/>
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
	</Grommet>
	  );
	}
}

export default Usuario;
