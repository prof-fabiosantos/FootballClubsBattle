import logo from './logoMain.png';
import './App.css';
import myContract from './myContract';
import React from "react";
import { Link } from 'react-router-dom';

class Main extends React.Component {
    
	constructor(props){
        super(props);
        this.state = {
            error : null,
            isLoaded : false,
			contractAddress: ''			
        };
    }
    
	async componentDidMount() {	
		
		const contractAddress = await myContract.methods.contractAddress().call();
		this.setState({contractAddress});
	}

	onSubmit = async(event) => {
	  //event.preventDefault();  
	};


	render()
	{
	  return (
		<div className="App">
		  <header className="App-header">
			<br/>
			<img src={logo} alt="logo" /> 
			<br/>		
			<span>Endereço do contrato do jogo:  {this.state.contractAddress}</span>
			<div>
				<br/>
				<Link  className="App-link" to="/home">[Jogar]</Link>
			</div>		
		  </header>
		</div>
	  );
	}
}

export default Main;
