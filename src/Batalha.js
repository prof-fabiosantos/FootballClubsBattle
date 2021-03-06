import logo from './logo.png';
import animacao from './assets/giphy.gif'
import './App.css';
import web3 from './web3';
import myContract from './myContract';
import React from "react";
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import $ from 'jquery';
import {
  Grommet,
  Grid,
  Card,
  CardBody,
  CardHeader,
  Text 
} from 'grommet'
 
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
			adversarysList:  [],
			numberOfWinners: ''			
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
						console.log(count);
					}
				}
			}
		}
		console.log(playerFootballClubsList);
		console.log(playerFootballClubsList.length);
		
		const numberFootballClubs = count;		
		
		this.setState({owner, contractAddress, playerFootballClubsList, numberFootballClubs, adversarysList, footballClubsList, numberOfWinners}); 	
		
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
	  this.setState({ message: 'Aguardando a execu????o da transa????o...'});
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
	  <Grommet full>
	  
		<div  className="App">
		  <header className="App-header">		
			<br/>
			<img src={logo} alt="logo" /> 
			<br/>		
			<span>Endere??o do contrato do jogo:  {this.state.contractAddress}</span>
			<span>Endere??o do jogador:  {this.state.owner}</span>
			<span>N??mero de vit??rias do jogador:  {this.state.numberOfWinners}</span>
			<span><h4>Batalha</h4></span>
			
			<div id="loader" class="animacao">
				<img src={animacao} width="300" height="180" alt="logo" />
				<h6>Aguarde o fim da partida!</h6>
			</div>
			<div>
				<p>O n??mero de clubs cards dispon??veis para batalhar agora ??:  {this.state.numberFootballClubs}</p>
				
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
							  C??digo {FootballClub.id}
							</Text>
						  </CardHeader>
						  
						  <CardBody justifyContent="center" pad="small">
								<img src={FootballClub.logoUri} alt="logo" />
								<Text size="xsmall">{FootballClub.name}</Text>
								<Text size="xsmall">Ano: {FootballClub.year}</Text>
								<Text size="xsmall">T??tulos: {FootballClub.total_title}</Text>
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
			<label> Digite o c??digo do advers??rio que deseja batalhar: </label> 
			<input value = {this.state.value} onChange = {event => this.setState({value: event.target.value})} /> 
			&nbsp;
			<button> Confirmar </button> 
			</div> 		
			</form>
			<div>
			<Link  className="App-link" to="/home">[Marketplace]</Link> 
			&nbsp;&nbsp;
			<Link  className="App-link" to="/usuario">[Veja sua cole????o de times de futebol]</Link> 
			</div>       		
		  </header>
		</div>
	</Grommet>
	  );
	}
}

export default Batalha;
