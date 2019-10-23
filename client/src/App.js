import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Authentication from './modules/Authentication/Authentication';
import { Footer } from './modules/Layout/Footer/Footer';
import { Layout } from './modules/Layout/Layout';
import { NavigationBar } from './modules/Layout/NavigationBar/NavigationBar';
import Configuration from './modules/Configuration/Configuration';
import Home from './modules/Home/Home';
import './App.scss';
import { ProtectedRoute } from './protected.route';
import Auth from './auth';

const App = (props)=> {
  
  useEffect(() => {
    Auth.setAuthTokenAPI(Auth.getSession());
    //console.log(localStorage.getItem('jwt'));
    
    // eslint-disable-next-line
  }, []);

  let content = (
    <React.Fragment>
      <NavigationBar/>
      <Layout>
        <Router>
          <Switch>
            <ProtectedRoute exact path="/" component={Home}/>
            <Route path="/configuration" component={Configuration}/>
            <Route path="/login" component={Authentication}/>
          </Switch>
        </Router>
      </Layout>
      <Footer/>
    </React.Fragment>
  );
  return content;
}

export default App;
