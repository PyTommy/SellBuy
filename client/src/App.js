import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PrivateRoute from './hoc/PrivateRoute';

// Actions
import { loadUser } from './actions/auth';
import { getProducts } from './actions/product';

// Import Components
import Layout from './hoc/Layout/Layout';
import MyPage from './components/MyPage/MyPage';
import InboxPage from './containers/InboxPage/InboxPage';

import Auth from './components/Auth/Auth';
import Products from './components/Products/Products';
import SingleProduct from './components/SingleProduct/SingleProduct';
import Sell from './components/Sell/Sell';
import EditPage from './components/EditPage/EditPage';
import Avatar from './components/Avatar/Avatar';
import Profile from './components/Profile/Profile';
import conversation from './components/Conversation/Conversation';
import Conversation from './components/Conversation/Conversation';


class App extends Component {
  componentDidMount() {
    this.props.loadUser();
    this.props.getProducts();
  }

  render() {


    const LikePage = () => (
      <p>LikePage</p>
    );
    const BoughtPage = () => (
      <p>BoughtPage</p>
    );
    const NotFoundPage = () => (
      <p>404</p>
    );

    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path="/products/:id" component={SingleProduct} />
            <Route path="/products" exact component={Products} />
            <PrivateRoute path="/messages/:id" component={Conversation} />
            <PrivateRoute path="/likes" component={LikePage} />
            <PrivateRoute path="/bought" component={BoughtPage} />
            <PrivateRoute path="/sell" exact component={Sell} />
            <PrivateRoute path="/edit/:id" exact component={EditPage} />
            <PrivateRoute path="/inbox" component={InboxPage} />
            <PrivateRoute path="/mypage/avatar" exact component={Avatar} />
            <Route path="/profile/:id" component={Profile} />
            <PrivateRoute path="/mypage" exact component={MyPage} />
            <Route path="/auth" component={Auth} />
            <Redirect from="/" exact to="/products" />
            <Route component={NotFoundPage} />
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

export default connect(mapStateToProps, { loadUser, getProducts })(App);
