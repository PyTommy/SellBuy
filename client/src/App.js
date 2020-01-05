import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {loadUser} from './actions/auth';

// Import Components
import Layout from './hoc/Layout/Layout';
import MyPage from './components/MyPage/MyPage';
import InboxPage from './containers/InboxPage/InboxPage';

import Auth from './components/Auth/Auth';
import Products from './components/Products/Products';
import SingleProduct from './components/SingleProduct/SingleProduct';
import Sell from './components/Sell/Sell';
import Avatar from './components/Avatar/Avatar';


class App extends Component {
  componentDidMount() {
    this.props.loadUser(null);
  }

  render() {

    
    const LikePage = () => (
      <p>LikePage</p>
    );
    const BoughtPage = () => (
      <p>BoughtPage</p>
    );
    const SellPage = () => (
      <p>SellPage</p>
    );
    const NotFoundPage = () => (
      <p>404</p>
    );

    return (
      <BrowserRouter>
        <Layout>
          <Switch>
          <Route path="/products/:id" component={SingleProduct}/> 
          <Route path="/products" exact component={Products} />
          <Route path="/likes" component={LikePage} />
          <Route path="/bought" component={BoughtPage} />
          <Route path="/sell" exact component={Sell} />
          <Route path="/inbox" component={InboxPage} />
          <Route path="/mypage/avatar" exact component={Avatar} />
          <Route path="/mypage" exact component={MyPage} />
          <Route path="/auth" component={Auth} />
          <Redirect from="/" exact to="/products" />
          <Route component={NotFoundPage}/>
        </Switch>
        </Layout>
      </BrowserRouter>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

App.propTypes = {
  auth: PropTypes.object,
};

export default connect(mapStateToProps, {loadUser})(App);
