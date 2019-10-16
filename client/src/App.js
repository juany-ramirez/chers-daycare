import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Contact } from './Contact'
import { NavigationBar, Layout, Footer } from './modules'
import About from './About'
import Home from './Home'
import './App.scss';

function App() {
  return (
    <React.Fragment>
      <NavigationBar/>
      <Layout>
        <Router>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
            <Route path="/contact" component={Contact}/>
          </Switch>
        </Router>
      </Layout>
      <Footer/>
    </React.Fragment>
  );
}

export default App;
