import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './reset.css';
import './index.css';

import PageContainer from './components/PageContainer';
import MainPage from './pages/MainPage';
import SharePage from './pages/SharePage';
import { colors } from './styles/variables';

export default class extends Component {
  state = { backgroundColor: colors.blue };

  changeBackgroundColor = backgroundColor => {
    this.setState({ backgroundColor });
  };

  render() {
    const { backgroundColor } = this.state;

    return (
      <Router>
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
