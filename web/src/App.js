import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './reset.css';
import './index.css';

import PageContainer from './components/PageContainer';
import MainPage from './pages/MainPage';
import SharePage from './pages/SharePage';
import { colors } from './styles/variables';

// fix github page router path handler
const basename = window.location.hostname.indexOf('github') >= 0 &&
  window.location.pathname.split('/')[1]
  ? `/${window.location.pathname.split('/')[1]}`
  : undefined;

export default class extends Component {
  state = { backgroundColor: colors.blue };

  changeBackgroundColor = backgroundColor => {
    this.setState({ backgroundColor });
  };

  render() {
    const { backgroundColor } = this.state;

    return (
      <Router basename={basename}>
        <PageContainer background={backgroundColor}>
          <Route
            exact
            path="/"
            component={MainPage}
            changeBackgroundColor={this.changeBackgroundColor}
          />
          <Route
            path="/:subject"
            component={SharePage}
            changeBackgroundColor={this.changeBackgroundColor}
          />
        </PageContainer>
      </Router>
    );
  }
}
