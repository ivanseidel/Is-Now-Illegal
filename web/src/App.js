import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './reset.css';
import './index.css';

import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import PageContainer from './components/PageContainer';
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

          <Footer>
            <p>
              <a className="github-button" href="https://github.com/ivanseidel/Is-Now-Illegal" data-style="mega" data-count-href="/ivanseidel/Is-Now-Illegal/stargazers" data-count-api="/repos/ivanseidel/Is-Now-Illegal#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star ivanseidel/Is-Now-Illegal on GitHub">Star on GitHub</a>
            </p>
            <p>A nerdy protest made by </p>
            <p>
              <a href="https://github.com/ivanseidel" target="_blank">Ivan Seidal</a>,&nbsp;
              <a href="https://twitter.com/brunolemos" target="_blank">Bruno Lemos</a> &amp;&nbsp;
              <a href="https://github.com/joaopedrovbs" target="_blank">João Pedro</a>
            </p>
          </Footer>
        </PageContainer>
      </Router>
    );
  }
}
