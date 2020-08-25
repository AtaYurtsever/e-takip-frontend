import React from 'react';
import "./App.css"
import ApplicationForm, {ApplicationPopup,ModifyPopup} from "./components/Application"
import {BrowserRouter as Router,Switch, Route} from "react-router-dom";
import Add ,{AddButton, Signup} from './components/Add'
import OrganizerEvents from "./components/OrganizerEvents"
import AllEvents,{AllEventsHeader}from "./components/AllEvents"
import Grid from '@material-ui/core/Grid';
import Applicants from './components/Applicants'
// import {Transition,TransitionGroup,CSSTransition} from "react-transition-group";

function App() {
  
  return (
    <Grid container spacing={3} className="App">
      <Grid item xs={12} style={{justifyContent:`center`,alignItems:`center`}}>
        <Router>
          <Switch>
                <Route path="/new"><Add/></Route>
                <Route path='/signup'><Signup/></Route>
                <Route exact path='/'><AddButton/></Route>
          </Switch>
        </Router>
      </Grid>
      
      <Router>
        
        <Switch>
          <Route path="/events/:id/apply" component={ApplicationForm}/>
          <Route path="/events/:id/modify"component={ModifyPopup}/>
          <Route path="/events/:id/moderate" component={Applicants}/>
          <Route path="/events/:id" component={ApplicationPopup}/>
          <Route path="/">
            <Grid item xs={12}>  
              <OrganizerEvents/>
            </Grid>
            <Grid item xs={12}>  
              <AllEventsHeader/>
            </Grid>
            <Grid item xs={12}>  
              <AllEvents/>
            </Grid>    
          </Route> 
        </Switch>
      </Router>
    </Grid>
  );
}

export default App;
