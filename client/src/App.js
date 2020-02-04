import React, { useEffect} from "react";
import { Router, Route, Switch } from "react-router-dom";
import Authentication from "./modules/Authentication/Authentication";
import { Footer } from "./modules/Layout/Footer/Footer";
import NavigationBar from "./modules/Layout/NavigationBar/NavigationBar";
import Configuration from "./modules/Configuration/Configuration";
import Home from "./modules/Home/Home";
import LandingPage from "./modules/LandingPage";
import { ProtectedRoute, AdminRoute } from "./protected.route";
import { history } from "./_helpers/history";
import "./App.scss";

const App = props => {
 
  useEffect(() => {
    
    // eslint-disable-next-line
  }, []);

  let content = (
    <React.Fragment>
      <Router history={history}>
          <NavigationBar history={history} />
          <Switch>
            <ProtectedRoute exact path="/home" component={Home} />
            <AdminRoute path="/configuration" component={Configuration} />
            <Route
              path="/login"
              render={({ history }) => <Authentication history={history} />}
            />
            <Route exact path="/" component={LandingPage} />
          </Switch>
          <Footer />
      </Router>
    </React.Fragment>
  );
  return content;
};

export default App;
