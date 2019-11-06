import React, { useEffect } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Authentication from './modules/Authentication/Authentication';
import { Footer } from './modules/Layout/Footer/Footer';
import { Layout } from './modules/Layout/Layout';
import NavigationBar from './modules/Layout/NavigationBar/NavigationBar';
import Configuration from './modules/Configuration/Configuration';
import Home from './modules/Home/Home';
import './App.scss';
import { ProtectedRoute } from './protected.route';
import { history } from './_helpers/history';

const App = (props) => {

  useEffect(() => {

    // eslint-disable-next-line
  }, []);

  let content = (
    <React.Fragment>
      <Router history={history}>
        <NavigationBar history={history} />
        <Layout>
          <Switch>
            <ProtectedRoute exact path="/home" component={Home} />
            <ProtectedRoute path="/configuration" component={Configuration} />
            <Route path="/login" render={({ history }) => (
                <Authentication history={history}/>
              )} />
          </Switch>
        </Layout>
        <Footer />
      </Router>
    </React.Fragment>
  );
  return content;
}

export default App;
