import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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
          <Switch>
            <Route
              path="/"
              render={props => {
                if (window.location.search[0] === '?') {
                  const subject = window.location.search.replace('?', '');
                  return <SharePage subject={subject} {...props} />;
                }

                return <MainPage {...props} />;
              }}
              changeBackgroundColor={this.changeBackgroundColor}
              exact
            />
            <Route
              path="/:subject"
              render={({ match: { params: { subject } }, ...props }) => (
                <SharePage subject={subject} {...props} />
              )}
              changeBackgroundColor={this.changeBackgroundColor}
            />
          </Switch>
        </PageContainer>
      </Router>
    );
  }
}
