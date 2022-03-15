import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './Home';
import Usuario from './Usuario';
import Main from './Main'
import Batalha from './Batalha'

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
		<Route path="/home" exact component={Home} />
        <Route path="/usuario"  component={Usuario} /> 
		<Route path="/batalha"  component={Batalha} /> 		
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;