import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PrivateRoute from './hoc/PrivateRoute';

// Actions
import { loadUser } from './store/actions/auth';

// Import Components
import Layout from './hoc/Layout/Layout';
import MyPage from './components/MyPage/MyPage';
import MyList from './components/MyList/MyList';
import Auth from './components/Auth/Auth';
import Products from './components/Products/Products';
import SingleProduct from './components/SingleProduct/SingleProduct';
import EditPage from './components/EditPage/EditPage';
import Profile from './components/Profile/Profile';
import NotificationPage from './components/NotificationPage/NotificationPage';
import Inbox from './components/Inbox/Inbox';
import MessageBox from './components/MessageBox/MessageBox';
import MessageForm from './components/MessageForm/MessageForm';
import UpdateAvatar from './components/UpdateAvatar/UpdateAvatar';
import UpdateProfile from './components/UpdateProfile/UpdateProfile';
import UpdateEmail from './components/UpdateEmail/UpdateEmail';
import UpdatePassword from './components/UpdatePassword/UpdatePassword';

class App extends Component {
  componentDidMount() {
    this.props.loadUser();
  }

  render() {
    const NotFoundPage = () => (
      <p>404</p>
    );

    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path="/products/:id" component={SingleProduct} />
            <Route path="/products" exact component={Products} />
            <Redirect from="/mylist" exact to="/mylist/liked" />
            <PrivateRoute path="/mylist/:status" component={MyList} />
            <PrivateRoute path="/sell" exact component={EditPage} />
            <PrivateRoute path="/edit/:id" exact component={EditPage} />
            <PrivateRoute path="/mypage" exact component={MyPage} />
            <PrivateRoute path="/mypage/update/avatar" exact component={UpdateAvatar} />
            <PrivateRoute path="/mypage/update/profile" exact component={UpdateProfile} />
            <PrivateRoute path="/mypage/update/email" exact component={UpdateEmail} />
            <PrivateRoute path="/mypage/update/password" exact component={UpdatePassword} />
            <PrivateRoute path="/notification" exact component={NotificationPage} />
            <Redirect from="/inbox" exact to="/inbox/recieved" />
            <PrivateRoute path="/inbox/recieved/:id" component={MessageBox} />
            <PrivateRoute path="/inbox/sent/:id" component={MessageBox} />
            <PrivateRoute path="/inbox/:status" component={Inbox} />
            <PrivateRoute path="/messages/:id" component={MessageForm} />
            <Route path="/profile/:id" component={Profile} />
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

export default connect(mapStateToProps, { loadUser })(App);
